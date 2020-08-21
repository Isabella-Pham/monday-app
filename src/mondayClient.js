import mondaySdk from "monday-sdk-js";

/*
 * To import write the following at the top of a file: import { mondayClient } from './mondayClient';
*/

class mondayClient {
    constructor() {
        this.monday = mondaySdk();
        this.api_key = process.env.REACT_APP_MONDAY_TOKEN;
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
        return this.monday.api("{users{name,email,photo_original}}");
    }
    getAllGraphs() {
        return this.monday.storage.instance.getItem("all_graphs");
    }
    saveGraph(graphName, graphJSON) {
        this.monday.storage.instance.setItem(graphName, graphJSON);
        this.monday.storage.instance.getItem("all_graphs").then(res => {
            if (res["success"].localeCompare("false")) {
                this.monday.storage.instance.setItem("all_graphs", graphName);
            } else {
                var updatedGraphList = res.data + ", " + graphName;
                this.monday.storage.instance.setItem("all_graphs", updatedGraphList);
            }
        });
    }
    getGraph(graphName) {
        return this.monday.storage.instance.getItem(graphName);
    }
    containsGraph(graphName) {
        this.monday.storage.instance.getItem(graphName).then(res => {
            if (res["success"].localeCompare("false")) {
                return false;
            } else {
                return true;
            }
        });
    }
}

export { mondayClient };