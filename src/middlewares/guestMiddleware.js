const guestMiddleware = function (req, res, next) {
    if(!req.session.userLog) {
        return next();
    } else {
        res.redirect('/');
    }
}

module.exports = guestMiddleware;