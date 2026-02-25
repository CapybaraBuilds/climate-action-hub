const express = require('express')
const postsRouter = express.Router()
const {posts, getNextPostId} = require('../data/db')
const commentsRouter = require('./comments')
postsRouter.use('/:postId/comments', commentsRouter)

const getPostsHandler = (req, res) => {
    res.send(posts);
}

const getPostByIdHandler = (req, res) => {
    const idx = req.url.split('/')[1];
    const post = posts.find(post=>post.id===parseInt(idx));
    if(post){
        res.send(post);
    }else{
        res.status(404).json({error: `Post with id ${parseInt(idx)} not found`});
    }
}

const createPostHandler = (req, res) => {
    const {title, content, authorId} = req.body;
    if(!title || !content || !authorId){
        res.status(400).json({error: 'title, content, and authorId are required!'});
    }else{
        const newPost = {
            id: getNextPostId(),
            title,
            content,
            authorId,
            createdAt: new Date()
        }
        posts.push(newPost);
        res.status(201).json(newPost);
    }
}

const updatePostHandler = (req, res)=>{
    const idx = req.url.split('/')[1];
    const postIdx = posts.findIndex(post=>post.id===parseInt(idx));
    if(postIdx !== -1){
        const {title, content, authorId} = req.body
        posts[postIdx].title = title;
        posts[postIdx].content = content;
        posts[postIdx].authorId = authorId;
        res.status(201).json(posts[postIdx])
    }else{
        res.status(404).json({error: `Post with id ${parseInt(idx)} not found`})
    }
}

const deletePostHandler = (req, res) => {
    const idx = req.url.split('/')[1];
    const postIdx = posts.findIndex(post=>post.id===parseInt(idx));
    if(postIdx !== -1){
        posts.splice(postIdx, 1);
        res.send(`Post with id ${parseInt(idx)} deleted`);
    }else{
        res.status(404).json({error: `Post with id ${parseInt(idx)} not found`});
    }
}

postsRouter.get('/', getPostsHandler)

postsRouter.get('/:id', getPostByIdHandler)

postsRouter.post('/', createPostHandler)

postsRouter.put('/:id', updatePostHandler)

postsRouter.delete('/:id', deletePostHandler)

module.exports = postsRouter