class RequestService {

    constructor() {
        this.baseUrl = 'https://localhost:5001';
    }

    async get(url, token) {        
        return await fetch(this.baseUrl + url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            }
        }).then(function(response){
            return response.json();
        }).catch(function(error) {
            return { error: true, errorMessage: 'Ups! Something bad happened: ' + error}
        });  
    }

    async post(url, data, token) {
        return await fetch(this.baseUrl + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            },
            body: this.stringifyData(data)
        }).then(function(response){
            return response.json();
        }).catch(function(error) {
            return { error: true, errorMessage: 'Ups! Something bad happened: ' + error}
        });  
    }

    stringifyData(data) {
        if (data)
        {
            return JSON.stringify(data);
        }
        return null;
    }
}

export default RequestService;