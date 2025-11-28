// Middleware to check if user is authenticated
module.exports.requireAuth = function(req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash('loginMessage', 'You must be logged in to perform this action');
        return res.redirect('/auth/login');
    }
    next();
};

// Middleware to pass user info to all views
module.exports.userInfo = function(req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.displayName = req.user.displayName;
        res.locals.username = req.user.username;
        res.locals.isAuthenticated = true;
    } else {
        res.locals.displayName = '';
        res.locals.username = '';
        res.locals.isAuthenticated = false;
    }
    next();
};