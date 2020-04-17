import RequestService from '../services/request-service';
import AuthService from '../services/auth-service';

class MealService {
    
    constructor() {
        this.mealUrl = "/meal";
        this.mealFilterUrl = "/meal/filter";
        this.userSettings = "/usersettings";
        this.request = new RequestService;
        this.auth = new AuthService;
    }

    async getMeals(userId, fromDate, toDate, fromTime, toTime) {
        let user = this.auth.getUser();
        return await this.request.post(this.mealFilterUrl, { userId, fromDate, toDate, fromTime, toTime }, user.token);
    }

    async getMeal(userId, mealId) {
        let user = this.auth.getUser();
        return await this.request.get(this.mealUrl + "/" + userId + "/" + mealId, user.token);
    }

    async createOrUpdateUser(userId, mealId, date, description, calories) {
        let user = this.auth.getUser();
        return await this.request.post(this.mealUrl, { userId, mealId, date, description, calories }, user.token);
    }

    async getSettings(userId) {
        let user = this.auth.getUser();
        return await this.request.get(this.userSettings + "/" + userId, user.token);
    }

    async saveSettings(userId, dailyNumberOfCalories) {
        let user = this.auth.getUser();
        return await this.request.post(this.userSettings, { userId, dailyNumberOfCalories } ,user.token);
    }
}

export default MealService;