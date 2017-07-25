var jwtStrategy = require('passport-jwt').Strategy,
 ExtractJwt=require('passport-jwt').ExtractJwt;
var config = require('../config/database');
var user = require('../app/models/account');
var reviews = require('../datasets/reviews');
module.exports = function (passport) {
    var opts = {};
    opts.jwtFromRequest=ExtractJwt.fromAuthHeader();
    opts.secretOrKey = 'helloworld';
    passport.use(new jwtStrategy(opts, function (jwt_payload, done) {
        user.findOne({ id: jwt_payload.id }, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);

            }
            else {
                done(null, false);
            }
        });
    }));
};