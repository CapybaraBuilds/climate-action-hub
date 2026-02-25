const express = require('express')
const usersRouter = express.Router()
const {users, getNextUserId} = require('../data/db')

const getUsersHandler = (req, res)=>{
    res.status(200).send(users)
}

const getUserByIdHandler = (req, res) => {
    const id = parseInt(req.url.split('/')[1]);
    const user = users.find(user=>user.id===id);
    if(user){
        res.status(200).json(user)
    }else{
        res.status(404).json({error:`User with id ${id} is not found.`})
    }
}

const createUserHandler = (req, res) =>{
    const {userName, email} = req.body;
    if(!userName || !email){
        res.status(400).json({error:'User name and email are required!'});
    }else{
        const newUser = {
            id: getNextUserId(),
            userName,
            email
        }
        users.push(newUser);
        res.status(201).json(newUser)
    }
}

usersRouter.get('/', getUsersHandler)
usersRouter.get('/:id', getUserByIdHandler)
usersRouter.post('/', createUserHandler)


module.exports = usersRouter