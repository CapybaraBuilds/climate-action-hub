const express = require('express')
const usersRouter = express.Router()
// const {users, getNextUserId} = require('../data/db')
const User = require('../models/User')

const getUsersHandler = async(req, res)=>{
    try{
        const users = await User.find();
        res.json(users);
    }catch (err){
        res.status(500).json({error: err.message});
    }
}

// const getUserByIdHandler = (req, res) => {
//     const id = parseInt(req.url.split('/')[1]);
//     const user = users.find(user=>user.id===id);
//     if(user){
//         res.status(200).json(user)
//     }else{
//         res.status(404).json({error:`User with id ${id} is not found.`})
//     }
// }

const getUserByIdHandler = async(req, res) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({error: 'User not found'});
        }
        res.json(user);
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

// const createUserHandler = (req, res) =>{
//     const {userName, email} = req.body;
//     if(!userName || !email){
//         res.status(400).json({error:'User name and email are required!'});
//     }else{
//         const newUser = {
//             id: getNextUserId(),
//             userName,
//             email
//         }
//         users.push(newUser);
//         res.status(201).json(newUser)
//     }
// }

const createUserHandler = async(req, res) =>{
    try{
        const {username, email} = req.body;
        if(!username || !email){
            return res.status(400).json({error:'Username and email required!'});
        }
        const user = await User.create({username, email});
        res.status(201).json(user);
    }catch(err){
        if(err.code === 11000){
            return res.status(400).json({error: 'Username or email already exists'});
        }
        res.status(500).json({error: err.message});
    }
}

usersRouter.get('/', getUsersHandler)
usersRouter.get('/:id', getUserByIdHandler)
usersRouter.post('/', createUserHandler)


module.exports = usersRouter