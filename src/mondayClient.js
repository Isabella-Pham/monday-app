class mondayClient {
    constructor() {
        this.api_key = process.env.REACT_APP_MONDAY_TOKEN;
        this.endpoint = "https://api.monday.com/v2";
    }
    async post(apiQuery) {
        try {
            const response = await fetch(this.endpoint, {
                method: "POST",
                body: JSON.stringify({ query: apiQuery }),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": this.api_key
                }
            });
            const json = await response.json();
            return json;
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = mondayClient;