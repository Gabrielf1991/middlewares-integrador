const fs = require('fs');
const path = require('path');
const bcryptjs = require('bcryptjs')
const {  validationResult } = require('express-validator');

const usersFilePath = path.join(__dirname, '../database/users.json');

function getAllUsers () {
        return JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
}

function generateNewId () {
    const users = getAllUsers();
    return users.pop().id + 1;
}

function writeUser(user) {
    const users = getAllUsers();
    const userAGuardar = [...users, user];
    const userToJSON = JSON.stringify(userAGuardar, null, " ");
    fs.writeFileSync(usersFilePath, userToJSON);
}

module.exports = {
    showRegister: (req, res) => {
        // Do the magic
        return res.render('user/user-register-form');
    },
    processRegister: (req, res, next) => {
        // Do the magic
        const results = validationResult(req);
        const passwordHashed = bcryptjs.hashSync(req.body.password, 10);
        const image = req.files[0].filename;
        
        if(!results.isEmpty()){
            return res.render("user/user-register-form", {
                errors: results.mapped(),
                old: req.body
            });
        }

        const user = {
            id: generateNewId(),
            email: req.body.email,
            password: passwordHashed,
            avatar: image,
        }

        writeUser(user)
        res.redirect('/');
    },
    showLogin: (req, res) => {
        // Do the magic
        return res.render('user/user-login-form');
    },
    processLogin: (req, res) => {
        // Do the magic
        const results = validationResult(req);
        const email = req.body.email;
        const password = req.body.password;
        const users = getAllUsers();

        if(!results.isEmpty()){
            return res.render("user/user-login-form", {
                errors: results.errors,
                old: req.body
            });
        }    

        const userExist = users.find((user) => user.email == email);

        req.session.userLog = userExist;

        if (userExist && bcryptjs.compareSync(password, userExist.password)) {
			if (req.body.remember) {
				res.cookie('user', userExist.id, { maxAge: 1000 * 60 * 60 });
			}

            // req.session.email = email;

			return res.redirect('/');
        }

		res.redirect('/user/login');

    },
    showProfile: (req, res) => {

        const sessionUser = req.session.userLog;

        return res.render('user/profile', { sessionUser: sessionUser });
    },
    logout: (req, res) => {
        // Do the magic
        if(req.cookies.user){
            res.deleteCookie('user');
        }
        req.session.destroy();
        return res.redirect('/');
    }

}