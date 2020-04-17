import RequestService from '../services/request-service';

class AuthService {
    
    constructor() {
        this.registerUrl = "/auth/register";
        this.loginUrl = "/auth/login";
        this.logoffUrl = "/auth/logout";
        this.userKey = 'user-key';
        this.selectedUserKey = 'selected-user-key';
        this.request = new RequestService;
    }

    async register(email, fullname, password) {
        let userKey = this.userKey;
        return await this.request.post(this.registerUrl, { email, fullname, password }, null).then(function(loginData) {
            if (!loginData.error) {
                localStorage.setItem(userKey, JSON.stringify(loginData));
            }
            return loginData;
        });
    }

    async login(email, password) {
        let userKey = this.userKey;
        let selectedUserKey = this.selectedUserKey;
        return await this.request.post(this.loginUrl, { email, password }, null).then(function(loginData) {
            if (!loginData.error) {
                let stringifiedData = JSON.stringify(loginData);
                localStorage.setItem(userKey, stringifiedData);
                localStorage.setItem(selectedUserKey, stringifiedData);
            }
            return loginData;
        });
    }

    async logoff() {
        let userKey = this.userKey;
        let selectedUserKey = this.selectedUserKey;
        let user = this.getUser();
        return await this.request.post(this.logoffUrl, null, user.token).then(function() {
            localStorage.removeItem(userKey);
            localStorage.removeItem(selectedUserKey);
        });
    }

    getUser() {
        let userData = localStorage.getItem(this.userKey);
        return JSON.parse(userData);
    }

    updateSelectedUser(user) {
        localStorage.setItem(this.selectedUserKey, JSON.stringify(user));
    }

    getSelectedUser() {
        var userData = localStorage.getItem(this.selectedUserKey);
        return JSON.parse(userData);

    }
}

export default AuthService;