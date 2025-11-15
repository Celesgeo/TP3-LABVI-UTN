    const passport = require('passport');
    const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
    const pool = require('./db');

    const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'tu_secreto_jwt'
    };

    passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
        const [rows] = await pool.query('SELECT id, username FROM usuarios WHERE id = ?', [jwt_payload.id]);
        if (rows.length) return done(null, rows[0]);
        return done(null, false);
        } catch (err) {
        return done(err, false);
        }
    })
    );

    module.exports = passport;
