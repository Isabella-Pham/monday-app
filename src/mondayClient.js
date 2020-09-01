import mondaySdk from "monday-sdk-js";
import Constants from './constants/constants';
import axios from 'axios';

/*
 * To import write the following at the top of a file: import { mondayClient } from './mondayClient';
 * If you are trying to save two NEW graphs in a row, you must wait at least 10,000 milliseconds in between 
 * saving or else this can lead to problems. You can use sleep() to do so.
*/

class mondayClient {
    constructor() {
        this.monday = mondaySdk();
        this.sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
        this.BASE_URL = window.location.protocol + '//' + window.location.host + '/api/';

        this.team = "MondayWrkFlwApp";
    }

    async sendServerRequest(path, data) {
        data.teamName = this.team;
        data.clientId = Constants.CLIENT_ID;

        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            data: JSON.stringify(data),
            url: this.BASE_URL + path
        };

        return await axios(options).then((res) => {
            return res.data;
        }).catch((err) => {
            return err.response.data;
        });
    }

    //returns JSON array containing each user on the team and their name, email, and url to their photo
    async getTeammates() {
        const teammates = await this.monday.api("{users{name,id,email,photo_original}}").then(res => {
            return res;
        });
        return teammates ? teammates["data"]["users"] : [];
    }

    //Takes in the name of a user or their userID and returns all info about them. 
    //Be wary of trying to get info using someone's name if two people have the same exact name.
    async getUserInfo(name) {
        const teammates = await this.getTeammates().then(res => {
            for (var i = 0; i < res.length; i++) {
                var teammate = res[i];
                if (teammate["name"].localeCompare(name) == 0) {
                    return res[i];
                } else if (teammate["id"] == name) {
                    return res[i];
                }
            }
            return "teammate does not exist";
        });
        return teammates;
    }

    async getAllTasks() {
        const tasks = await this.monday.api("{items {name, id, updated_at, subscribers {name, id}}}").then(res => {
            return res;
        });
        return tasks ? tasks["data"]["items"] : [];
    }

    async createTask(taskName, listOfUsers) {
        const boardID = await this.monday.api("{boards{id}}").then(res => {
            return res["data"]["boards"][0]["id"];
        });

        console.log("Board ID", boardID);

        const taskID = await this.monday.api(`
            mutation{
                create_item(
                    board_id: ${boardID},
                    item_name: "${taskName}"
                ) {
                    id
                }
            }
        `).then(res => {
            return res["data"]["create_item"]["id"];
        });

        console.log("Task ID", taskID);

        for (var i = 0; i < listOfUsers.length; i++) {
            var user_id = listOfUsers[i];
            const notif = await this.monday.api(`
              mutation {
                create_notification(
                  text: "You have been assigned the following task: ${taskName}",
                  user_id: ${user_id},
                  target_id: ${taskID},
                  target_type: Project,
                  internal: true
                ) { 
                  id 
                }
              }
            `)
            console.log("Notification created.")
        }
    }

    //returns an array containing all graphs saved 
    async getAllGraphs() {
        let response = await this.sendServerRequest('getAll', {});
        if (!response.error) {
            return response.graphs
        } else {
            return [];
        }
    }

    //delete the graph by the name graphName
    async deleteGraph(graphId) {
        return await this.sendServerRequest('delete', {graphId: graphId});
    }

    async createGraph(graphName, nodes, width, height) {
        return await this.sendServerRequest('create', {graphName: graphName, nodes: nodes, width: width, height: height})
    }

    async editGraph(graphId, graphName, nodes, width, height) {
        let request = {
            graphId: graphId,
            graphName: graphName,
            nodes: nodes,
            width: width,
            height: height
        }

        return await this.sendServerRequest('edit', request);
    }
}

export { mondayClient };

//the code below features the above functions except with the monday storage API. 
//As the monday storage API is currently in BETA, we did not use these functions but instead chose to store data in MongoDB.
//Once the storage API is no longer in BETA, this code can be implemented
/*
    //returns an array containing all graphs saved
    async getAllGraphs() {
        const allGraphs = await this.monday.storage.instance.getItem("all_graphs").then(res => {
            var all = res["data"]["value"];
            if (all != null) {
                return all.split(",");
            }
            return [];
        });
        return allGraphs;
    }

    //deletes all graphs saved
    async deleteAllGraphs() {
        const success = await this.monday.storage.instance.setItem("all_graphs", "null").then(res => {
            return res["data"]["success"];
        });
        return success;
    }

    //delete the graph by the name graphName
    async deleteGraph(graphName) {
        const success = await this.monday.storage.instance.getItem("all_graphs").then(res => {
            console.log("Deleting graph ", graphName);
            const data = res["data"];
            var graphList = data["value"].split(",");
            graphList.splice(graphList.indexOf(graphName), 1);
            const graphListString = graphList.toString();
            this.monday.storage.instance.setItem("all_graphs", graphListString);
            this.monday.storage.instance.setItem(graphName, "null");
            this.notifyServer("delete", { "graphName": graphName });
            return true;
        });
        return success;
    }

    //returns true/false if a graph is successfully saved. Will save new graphs, if a graph already exists then graph will be updated
    async saveGraph(graphName, graphJSON) {
        const success = await this.monday.storage.instance.getItem("all_graphs").then(res => {
            const data = res["data"];
            var graphList = data["value"];
            if (graphName.includes(",")) {
                console.log("Invalid graph name, name must not contain any commmas");
                return false;
            }
            if (data["value"] == null || data["value"].toString().localeCompare("null") === 0) {
                this.monday.storage.instance.setItem("all_graphs", graphName);
                console.log("Adding ", graphName, " as first graph of graph list");
                return true;
            } else {
                if (graphList.split(",").includes(graphName)) {
                    console.log("Updating graph " + graphName);
                } else {
                    graphList = graphList + "," + graphName;
                    console.log("Adding ", graphName, " to graph list");
                    this.monday.storage.instance.setItem("all_graphs", graphList);
                }
                const graphJSONString = JSON.stringify(graphJSON);
                this.monday.storage.instance.setItem(graphName, graphJSONString);
                this.notifyServer("save", { "graphName": graphName });
                return true;
            }
        });
        return success;
    }

    //returns JSON data of graph
    async getGraph(graphName) {
        const graphJSON = await this.monday.storage.instance.getItem(graphName).then(res => {
            const graph = (res["data"]["value"]);
            return graph;
        });
        this.notifyServer("load", { "graphName": graphName });
        return JSON.parse(graphJSON);
    }

    async renameGraph(oldName, newName){
        const graphJSON = this.getGraph(oldName);
        this.saveGraph(newName, graphJSON);
        await this.sleep(10000);
        this.deleteGraph(oldName);
        this.notifyServer("rename", { "oldName": oldName, "newName": newName });
    }

    //checks if there is a graph by the name of graphName
    async containsGraph(graphName) {
        const contains = await this.monday.storage.instance.getItem(graphName).then(res => {
            if (res["data"] == null || !res["data"]["success"]){
                return false;
            } else {
                return true;
            }
        });
        return contains;
    }

    async setAllGraphs() {
        const success = await this.containsGraph("all_graphs").then(res => {
            if (res === false) {
                this.monday.storage.instance.setItem("all_graphs", "null");
                return true;
            } else {
                return true;
            }
        });
        return success;
    }
}

*/