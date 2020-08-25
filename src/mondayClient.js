import mondaySdk from "monday-sdk-js";

/*
 * To import write the following at the top of a file: import { mondayClient } from './mondayClient';
*/

class mondayClient {
    constructor() {
        this.monday = mondaySdk();
        this.monday.
        this.api_key = process.env.REACT_APP_MONDAY_TOKEN;
        this.setAllGraphs();
        this.sleep(10000);
    }
    /*
    async post(apiQuery) {
        try {
            const res = await fetch(this.endpoint, {
                method: "POST",
                body: JSON.stringify({ query: apiQuery }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": this.api_key
                }
            }).then((response) => response.json())
                .then((responseJSON) => {
                    console.log(responseJSON);
                    return responseJSON;
                });
            return res;
        } catch (error) {
            console.error(error);
        }
    }*/
    sleep(delay) {
        var start = new Date().getTime();
        while (new Date().getTime() < start + delay);
    }

    getTeammates() {
        const teammates = this.monday.api("{users{name,email,photo_original}}").then(res => {
            return res;
        });
        return teammates;
    }

    async getAllGraphs() {
        const allGraphs = this.monday.storage.instance.getItem("all_graphs").then(res => {
            return res["data"]["value"].split(",");
        });
        return allGraphs;
    }

    deleteAllGraphs() {
        const success = this.monday.storage.instance.setItem("all_graphs", "null").then(res => {
            return res["data"]["success"];
        });
        return success;
    }

    saveGraph(graphName, graphJSON) {
        const success = this.monday.storage.instance.getItem("all_graphs").then(res => {
            const data = res["data"];
            var graphList = data["value"];
            if (graphName.includes(",")) {
                console.log("Invalid graph name, name must not contain any commmas");
                return false;
            }
            if (graphList == null || data["value"].toString().localeCompare("null") == 0) {
                this.monday.storage.instance.setItem("all_graphs", graphName);
                console.log("Adding ", graphName, " as first graph of graph list");
                return true;
            } else {
                if (graphList.split(",").includes(graphName)) {
                    console.log("Graph by the name of '" + graphName + "' already exists");
                    return false;
                } else {
                    this.monday.storage.instance.setItem(graphName, JSON.stringify(graphJSON));
                    graphList = graphList + "," + graphName;
                    console.log("Adding ", graphName, " to graph list");
                    this.monday.storage.instance.setItem("all_graphs", graphList);
                    return true;
                }
            }
            this.sleep(5000);
        });
        return success;
    }
    async getGraph(graphName) {
        const graphJSON = await this.monday.storage.instance.getItem(graphName).then(res => {
            const graph = JSON.parse(res["data"]["value"]);
            return graph;
        });
        return graphJSON;
    }
    async containsGraph(graphName) {
        const contains = this.monday.storage.instance.getItem(graphName).then(res => {
            if (!res["data"]["success"] || res["data"]["value"] == null){
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
    }
}

export { mondayClient };