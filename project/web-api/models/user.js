class User {
    constructor(username, password) {
        this._username = username;
        this._password = password;
    }

    get username() {
        return this._username;
    }

    set username(username) {
        this._username = username;
    }
    
    get password() {
    return this._password;
    }

    set password(password) {
    this._password = password;
    }
}

module.exports = User; 