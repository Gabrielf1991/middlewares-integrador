const fs = require('fs');
const path = require('path');

function getAllUsers() {
    const file = path.join(__dirname, '../database/users.json');
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
}

module.exports = (req, res, next) => {
    if(!req.session.userLog && req.cookies.user){
        const users = getAllUsers();

        const userLogin = users.find( user => req.cookies.user == user.id);
        req.session.userLog = userLogin;
    }
    return next();
}