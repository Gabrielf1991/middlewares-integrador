const { body } = require('express-validator');
const path = require('path');
const bcryptjs = require('bcryptjs');


const usersFilePath = path.join(__dirname, '../database/users.json');

function getAllUsers () {
        return JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
}

module.exports = {
    register: [
        body('email')
            .notEmpty()
                .withMessage('El email es obligatorio.')
                .bail()
            .isEmail()
                .withMessage('El formato de email debe ser válido.')
                .bail()
            .custom((value, { req }) => {
                const users = getAllUsers();

                const userExist = users.find(user => value == user.email);

                if (userExist) {
                    return false;
                } else {
                    return true;
                }
            })
                .withMessage('El email ya está registrado.'),
        body('password')
            .notEmpty()
                .withMessage('La contraseña es obligatoria.')
                .bail()
            .isLength({ min:6 })
                .withMessage('La contraseña debe tener al menos 6 caracteres.')
                .bail()
            .custom((value, { req }) => {
                if(req.body.retype) {
                    return value === req.body.retype;
                }
                return true;
            })
                .withMessage('Las contraseñas no coinciden'),
            body('retype')
                .notEmpty()
                    .withMessage('Es obligatorio repetir la contraseña'),
            body('avatar')
                .custom((value, { req }) => {
                    return req.files[0];
                })
                    .withMessage('La imagen es obligatoria')
                    .bail()
                .custom((value, { req }) => {
                    req.files[0].originalname;
                    const ext = path.extname(nombreFoto);

                    return ext == '.jpg' || ext == '.png' || ext == '.jpeg'
                })

    ],
    login:[
        body('email')
            .notEmpty()
            .withMessage('El email es obligatorio.')
            .bail()
            .isEmail()
            .withMessage('Email con formato incorrecto')
            .bail()
        .custom((value, { req }) => {
                const users = getAllUsers();

                const userExist = users.find(user => value == user.email);

                if (userExist) {
                    if(bcryptjs.compareSync(req.body.password, userExist.password)){
                        return true;
                        }
                    } else {
                        return false;
                    }
                return false;
            })
            .withMessage('El email y/o la contraseña son invalidos')
    ] 
}
