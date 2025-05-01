const usersModel = require("../models/user");

exports.login = async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await usersModel.findOne({ email });
        if (!user) return res.json({ success: false, message: "User not found" });

        if (user.password === password) {
            return res.json({ success: true, message: "Login successful", user });
        } else {
            return res.json({ success: false, message: "Invalid password" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};