const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    profilePicture: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true,
});

const usersModel = mongoose.model("User", usersSchema); // Capital 'U' for convention
module.exports = usersModel;