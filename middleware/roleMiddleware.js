const roleMiddleware = (...roles) => {
    return (req, res, next) => {
        if (!req.isAuthenticated()) {
            return res.redirect('/signin');
        }

        if (!roles.includes(req.user.role)) {
            return res.render('unauthorized', { user: req.user });
        }

        next();
    };
};

module.exports = roleMiddleware;