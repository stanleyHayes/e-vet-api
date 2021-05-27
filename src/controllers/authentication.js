const User =  require("../models/user.js");

const register = async (req, res) => {
    try {
        const {name, email, role, password, position, department, phone} = req.body;
        if(!email || !password || !position || !phone){
            return res.status(400).json({data: null, message: 'Required fields missing'});
        }
        let user = await User.findOne({email});
        if (user) {
            return res.status(409).json({data: null, message: `Account with email ${email} already exist`});
        }
        user = await User.create({name, role, position, email, phone, password, department});
        const token = await user.generateToken();
        res.status(201).json({data: user, message: `Account successfully created`, token});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
}


const login = async (req, res) => {
    try {
        console.log(req.body)
        const {email, password} = req.body;
        if(!(email && password)){
            return res.status(400).json({data: null, message: `Email or password missing`});
        }
        const user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({data: null, message: `Authentication failed`});
        }
        if(!await user.matchPassword(password)){
            return res.status(401).json({data: null, message: `Authentication failed`});
        }
        const token = await user.generateToken();
        res.status(200).json({data: user, message: `Login successful`, token});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
}


const updateProfile = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'role', 'position',  'phone', 'password', 'department'];
        const isAllowed = updates.every(update => allowedUpdates.includes(update));
        if(!isAllowed){
            return res.status(400).json({data: null, message: `Updates not allowed`});
        }
        for(let key of updates){
            req.user[key] = req.body[key];
        }
        await req.user.save();
        res.status(200).json({message: `Account created successfully`, data: req.user});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
}


const changePassword = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['newPassword', 'currentPassword'];
        const isAllowed = updates.every(update => allowedUpdates.includes(update));
        if(!isAllowed){
            return res.status(400).json({data: null, message: `Updates not allowed`});
        }
        const matches = await req.user.matchPassword(req.body['currentPassword']);
        if(!matches){
            return res.status(401).json({data: null, message: `Passwords do not match`});
        }
        req.user['password'] = req.body['newPassword'];
        await req.user.save();
        res.status(200).json({message: `Account created successfully`, data: req.user});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
}


const getProfile = async (req, res) => {
    try {
        res.status(200).json({message: `Account retrieved`, data: req.user, token: req.token});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
}


const deleteProfile = async (req, res) => {
    try {
        req.user.status = 'DELETED';
        await req.user.save();
        res.status(200).json({message: `Account deleted successfully`, data: req.user});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
}


const logout = async (req, res) => {
    try {
        req.logins = req.user.logins.filter(login => login.token !== req.token);
        await req.user.save();
        res.status(200).json({message: `Logout successful`, data: {}});
    } catch (e) {
        res.status(500).json({message: e.message});
    }
}

module.exports = {deleteProfile, getProfile, updateProfile, login, register, logout, changePassword};