import RequestService from '../services/request-service';
import AuthService from '../services/auth-service';

class UserService {
    
    constructor() {
        this.roleUrl = "/role";
        this.userUrl = "/user";
        this.request = new RequestService;
        this.auth = new AuthService;
    }

    async getRoles() {
        let user = this.auth.getUser();
        return await this.request.get(this.roleUrl, user.token);
    }

    async getUsers() {
        let user = this.auth.getUser();
        return await this.request.get(this.userUrl, user.token);
    }

    async getUser(id) {
        let user = this.auth.getUser();
        return await this.request.get(this.userUrl + "/" + id, user.token);
    }

    async createOrUpdateUser(userId, email, fullname, password, roleName, active) {
        let user = this.auth.getUser();
        return await this.request.post(this.userUrl, { userId, email, fullname, password, roleName, active }, user.token);
    }
}

export default UserService;