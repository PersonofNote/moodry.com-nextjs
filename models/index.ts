import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const db = {
    mongoose: mongoose,
    user: require('./user.model'),
    role: require("./role.model"),
    mood: require("./mood.model"),
    ROLES: ["user", "admin", "moderator"]
};


export default db;