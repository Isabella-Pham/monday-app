import mondaySdk from "monday-sdk-js";

/*
 * To import write the following at the top of a file: import { mondayClient } from './mondayClient';
*/

class mondayClient {
    constructor() {
        this.monday = mondaySdk();
        this.api_key = process.env.REACT_APP_MONDAY_TOKEN;
        this.monday.storage.instance.setItem("all_graphs", null);
    }
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
    }
    getTeammates() {
        const teammates = this.monday.api("{users{name,email,photo_original}}").then(res => {
            return res;
        });
        return teammates;
    }
    async getAllGraphs() {
        const allGraphs = this.monday.storage.instance.getItem("all_graphs").then(res => {
            return res["data"]["value"];
        });
        return allGraphs;
    }
    saveGraph(graphName, graphJSON) {
        this.monday.storage.instance.setItem(graphName, JSON.stringify( graphJSON ));
        this.monday.storage.instance.getItem("all_graphs").then(res => {
            const data = res["data"];
            if (data["value"] == null) {
                this.monday.storage.instance.setItem("all_graphs", graphName);
            } else {
                var graphList= data["value"] + "," + graphName;
                this.monday.storage.instance.setItem("all_graphs", graphList);
            }
        });
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
            if (!res["data"]["success"]){
                return false;
            } else {
                return true;
            }
        });
        return contains;
    }
}

export { mondayClient };