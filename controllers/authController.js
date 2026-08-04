const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const registerPage = (req, res) => {
    res.render("auth/register");
};


const loginPage = (req, res) => {
    res.render("auth/login");
};


const registerUser = async (req, res) => {

    try {

        const { username, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.send("Email already registered.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || "user"
        });

        res.redirect("/login");

    } catch (error) {

        console.log(error);

        res.send("Registration Failed");

    }

};


const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.send("Invalid Email");
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.send("Invalid Password");
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.cookie("token", token, {
            httpOnly: true
        });

        res.redirect("/articles");

    } catch (error) {

        console.log(error);

        res.send("Login Failed");

    }

};


const logoutUser = (req, res) => {

    res.clearCookie("token");

    res.redirect("/login");

};

module.exports = {
    registerPage,
    loginPage,
    registerUser,
    loginUser,
    logoutUser
};