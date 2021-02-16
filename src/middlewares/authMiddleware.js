const authMiddleware = function (req, res, next) {
    if(req.session.userLog) {
        return next();
    } else {
       return res.redirect('/user/login');
    }
}

module.exports = authMiddleware;