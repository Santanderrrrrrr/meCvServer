const express = require('express')
const router = express.Router()
const userModel = require('../models/schemas/User')
const { _sendMail } = require('../utils/nodemailer')

const handleNewUser = async (req, res) => {
    let { email, password, firstname, lastname, username, telephone, picture } = req.body;
    if (!firstname || !lastname) return res.status(400).json({ 'message': 'We need at least the first and last name' });
    if (!password || !username) return res.status(400).json({ 'message': 'The password and username fields cannot be left empty' });
    if (!telephone || !email) return res.status(400).json({ 'message': 'Email and telephone fields must be filled' });

    email = email.toLowerCase();
    firstname = firstname.toLowerCase();
    lastname = lastname.toLowerCase();
    username = username.toLowerCase();
    
    // create user(should check for duplicate usernames in the db) <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    try {
        try{
            const User = await userModel.create({email, password, firstname, lastname, username, telephone, picture})
            // res.status(201).json(User)
            
            // console.log(firstname, lastname, username, password, telephone, email);
            _sendMail(email, username)
            res.status(201).json({ 'success': `New user ${username} created!` });
        } catch(e){
            let msg = e.code == 11000 ? 'user already exists' : `error: ${e.message}`  
            console.log(msg)
            res.status(409).json({'message':msg}) //Conflict code
        }
    } catch (err) {
        console.log(error.message)
        res.status(500).json({ 'message': err.message });
    }
}

router.post('/', handleNewUser)

module.exports = router;