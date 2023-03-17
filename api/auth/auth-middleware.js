const { findByUserSpecial } = require("../models/users-model");
const bcrypt = require('bcryptjs');

const inputCheck = (req, res, next) => {
    const {username, password} = req.body;
    if (username === undefined || password === undefined ||!username || !password ) {
        next({
            status: 400,
            message: "username veya password eksik"
        })
    }
    else {
        req.body.password = String(req.body.password);
        next();
    }
}

const passwordCheck = (req, res, next) => {
    try{
        const { password } = req.body;
        if (!bcrypt.compareSync(password, req.user.password)) {
            next({
                status: 401,
                message: "Geçersiz kriter"
            })
        }
        else {
            next();
        }
    }
    catch(err){
        next(err);
    }
};

const usernameCheck = async (req, res, next) => {
    try {
        const { originalUrl } = req;
        const { username } = req.body;
        const possible = await findByUserSpecial({ username: username });
        if (originalUrl.includes("auth/login")) {
            if (!possible) {
                next({
                    status: 401,
                    message: "Geçersiz kriter"
                })
            }
            else {
                req.user = possible;
                next();
            }
        }
        else {
            if (possible) {
                next({
                    status: "400",
                    message: "Username kullanılıyor"
                })
            }
            else {
                next();
            }
        }
    }
    catch (err) {
        next(err);
    }
}



module.exports = {
    usernameCheck,
    passwordCheck,
    inputCheck
}