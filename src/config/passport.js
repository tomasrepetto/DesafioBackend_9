import passport from "passport";
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import {getUserById, getUserEmail, registerUser} from "../services/user.js"
import {createHash, isValidPassword} from "../utils/bcryptPassword.js"

const LocalStrategy = local.Strategy;

export const initializaPassport = () => {

    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField: 'email'}, 
        async (req, username, password, done) => {
            try {
                const {confirmPassword} = req.body;

                if(password !== confirmPassword){
                    console.log('No coinciden las contrasenas');
                    return done(null, false);
                }

                const user = await getUserEmail(username);

                if(user){
                    console.log('El usuario ya existe');
                    return done(null, false);
                }

                req.body.password = createHash(password);

                const newUser = await registerUser({...req.body});

                if(newUser)
                    return done(null, newUser);

                return done(null, false);

            } catch (error) {
                done(error)
            }
        }));

    passport.use('login', new LocalStrategy(
        {usernameField: 'email'}, 
        async (username, password, done) => {
            try {
                const user = await getUserEmail(username);

                if(!user) {
                    console.log('El usuario no existe');
                    return done(null, false);
                }

                if (!isValidPassword(password, user.password)){
                    console.log('Las password no coinciden');
                    return done(null, false);
                }

                return done(null, user);

            } catch (error){
                done(error);
            }
        }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async(id, done) => {
        const user = await getUserById(id);
        done(null, user);
    });

    passport.use('github', new GitHubStrategy(
        {
            clientID: "Iv23liBg6oIwQ1uRnQxt",
            clientSecret: "bc03f799ef1ad420b42bf15dbcf0712f203c8b2c",
            callbackURL:"http://localhost:8080/login-github-callback",
        }, 
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile._json.email;
                const user = await getUserById(email);
                if(user)
                    return done(null, user);
                const newUser = {
                    name: profile._json.name,
                    email,
                    password: '.$',
                    github: true
                };

                const result = await registerUser({ ...newUser });
                return done(null, result);
            } catch (error) {
                done(error)
            }
        }));
};