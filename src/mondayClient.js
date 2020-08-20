class mondayClient {
    constructor() {
        this.api_key = process.env.REACT_APP_MONDAY_TOKEN;
        this.endpoint = "https://api.monday.com/v2";
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
        const teammates = this.post("{users{name,email,photo_original}}");
        return teammates;
    }
}

module.exports = mondayClient;