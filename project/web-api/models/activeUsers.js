const User = require("./user");
const Cart = require("./cart");

class activeUsers {
    constructor() {
        this.users = new Map();
        this.carts = new Map();
    }

    addUser(user, sessionId) {
        // Remove any previously active users
        this.users.forEach((value, key) => {
            this.users.delete(key)
        });

        // Add the new user
        this.users.set(user, sessionId);
        console.log("Added User to the Active Users Map");
        console.log("User:" + user.username);
        console.log("SessionId:" + sessionId);
    }

    removeUser(user) {
        this.users.delete(user);
    }

    // Checks if a specific user is active
    isActive(username, sessionId) {
        console.log("Comparing username with sessionId");
        for (const user of this.users.keys()) {
            if (user.username === username && this.users.get(user) === sessionId) {
                console.log("User is active");
                return true;
            }
        } 

        return false
    }

    // Checks if no one is active 
    noOneIsActive() {
        return this.users.size === 0; 
    }

    getActiveUser() {
        return this.users.entries().next().value[0];
    }

    getActiveSessionId() {
        return this.users.entries().next().value[1];
    }

    setCart(cart) {
        this.carts.set(this.getActiveUser().username, cart);
    }

    getCart() {
        return this.carts.get(this.getActiveUser().username);
    }

}

module.exports = activeUsers;