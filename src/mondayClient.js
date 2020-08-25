import mondaySdk from "monday-sdk-js";

/*
 * To import write the following at the top of a file: import { mondayClient } from './mondayClient';
*/

class mondayClient {
    constructor() {
        this.monday = mondaySdk();
        this.api_key = process.env.REACT_APP_MONDAY_TOKEN;
        this.setAllGraphs();
        this.sleep(10000);
    }

    //used to delay the executation of code by a specified number of milliseconds
    sleep(delay) {
        var start = new Date().getTime();
        while (new Date().getTime() < start + delay);
    }

    //returns JSON array containing each user on the team and their name, email, and url to their photo
    getTeammates() {
        const teammates = this.monday.api("{users{name,email,photo_original}}").then(res => {
            return res;
        });
        return teammates;
    }

    //returns an array containing all graphs saved 
    async getAllGraphs() {
        const allGraphs = this.monday.storage.instance.getItem("all_graphs").then(res => {
            var all = res["data"]["value"];
            if (all != null) {
                return all.split(",");
            }
            return [];
        });
        return allGraphs;
    }

    //deletes all graphs saved
    deleteAllGraphs() {
        const success = this.monday.storage.instance.setItem("all_graphs", "null").then(res => {
            return res["data"]["success"];
        });
        this.sleep(10000);
        return success;
    }

    //delete the graph by the name graphName
    deleteGraph(graphName) {
        const success = this.monday.storage.instance.getItem("all_graphs").then(res => {
            console.log("Deleting graph ", graphName);
            const data = res["data"];
            var graphList = data["value"].split(",");
            graphList.splice(graphList.indexOf(graphName), 1);
            const graphListString = graphList.toString();
            this.monday.storage.instance.setItem("all_graphs", graphListString);                
            this.monday.storage.instance.setItem(graphName, "null");
            return true; 
        });
        this.sleep(10000);
        return success;
    }

    //returns true/false if a graph is successfully saved. Will save new graphs, if a graph already exists then graph will be updated
    saveGraph(graphName, graphJSON) {
        const success = this.monday.storage.instance.getItem("all_graphs").then(res => {
            const data = res["data"];
            var graphList = data["value"];
            if (graphName.includes(",")) {
                console.log("Invalid graph name, name must not contain any commmas");
                return false;
            }
            if (data["value"] == null || data["value"].toString().localeCompare("null") == 0) {
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
                return true;            
            }
        });
        this.sleep(10000);
        return success;
    }

    //returns JSON data of graph
    async getGraph(graphName) {
        const graphJSON = await this.monday.storage.instance.getItem(graphName).then(res => {
            const graph = (res["data"]["value"]);
            return graph;
        });
        console.log("saving this data graphJSON: ", graphJSON);
        return JSON.parse(graphJSON);
    }

    //checks if there is a graph by the name of graphName
    async containsGraph(graphName) {
        const contains = this.monday.storage.instance.getItem(graphName).then(res => {
            if (!res["data"]["success"] || res["data"] == null){
                return false;
            } else {
                return true;
            }
        });
        return contains;
    }

    setAllGraphs() {
        const success = this.containsGraph("all_graphs").then(res => {
            if (res == false) {
                this.monday.storage.instance.setItem("all_graphs", "null");
                return true;
            } else {
                return true;
            }
        });
        return success;
    }
}

export { mondayClient };