const express = require('express')
const postsRouter = express.Router()
// const {posts, getNextPostId} = require('../data/db')
const Post = require('../models/Post')
const commentsRouter = require('./comments')
postsRouter.use('/:postId/comments', commentsRouter)

// const getPostsHandler = (req, res) => {
//     res.send(posts);
// }

// const getPostByIdHandler = (req, res) => {
//     const idx = req.url.split('/')[1];
//     const post = posts.find(post=>post.id===parseInt(idx));
//     if(post){
//         res.send(post);
//     }else{
//         res.status(404).json({error: `Post with id ${parseInt(idx)} not found`});
//     }
// }

// const createPostHandler = (req, res) => {
//     const {title, content, authorId} = req.body;
//     if(!title || !content || !authorId){
//         res.status(400).json({error: 'title, content, and authorId are required!'});
//     }else{
//         const newPost = {
//             id: getNextPostId(),
//             title,
//             content,
//             authorId,
//             createdAt: new Date()
//         }
//         posts.push(newPost);
//         res.status(201).json(newPost);
//     }
// }

// const updatePostHandler = (req, res)=>{
//     const idx = req.url.split('/')[1];
//     const postIdx = posts.findIndex(post=>post.id===parseInt(idx));
//     if(postIdx !== -1){
//         const {title, content, authorId} = req.body
//         posts[postIdx].title = title;
//         posts[postIdx].content = content;
//         posts[postIdx].authorId = authorId;
//         res.status(201).json(posts[postIdx])
//     }else{
//         res.status(404).json({error: `Post with id ${parseInt(idx)} not found`})
//     }
// }

// const deletePostHandler = (req, res) => {
//     const idx = req.url.split('/')[1];
//     const postIdx = posts.findIndex(post=>post.id===parseInt(idx));
//     if(postIdx !== -1){
//         posts.splice(postIdx, 1);
//         res.send(`Post with id ${parseInt(idx)} deleted`);
//     }else{
//         res.status(404).json({error: `Post with id ${parseInt(idx)} not found`});
//     }
// }

const getPostsHandler = async(req, res) => {
    try{
        const posts = await Post.find();
        res.json(posts);
    }catch (err) {
        res.status(500).json({error: err.message});
    }
}

const getPostByIdHandler = async(req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({error: 'Post not found!'});
        }
        res.json(post);
    }catch (err){
        if (err.name === 'CastError'){
            return res.status(400).json({error: 'Invalid ID format'})
        }
        res.status(500).json({error: err.message});
    }
}

const createPostHandler = async(req, res) => {
    try{
        const {title, content, authorId} = req.body;
        if(!title || !content || !authorId){
            return res.status(400).json({error:'Title, content, and authorId are required!'});
        }
        const post = await Post.create({
            title,
            content,
            authorId
        });
        res.json(post)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

const updatePostHandler = async(req, res)=>{
    try{
        const {title, content, authorId} = req.body;
        if(!title || !content || !authorId){
            return res.status(400).json({error:'Title, content, and authorId are required!'});
        }
        // it returns the post before edited
        const post = await Post.findByIdAndUpdate(req.params.id, {
            title,
            content,
            authorId
        });
        if(!post){
            return res.status(404).json({error: 'Post not found!'})
        }
        res.json(post);
    }catch(err){
        if (err.name === 'CastError'){
            return res.status(400).json({error: 'Invalid ID format'})
        }
        res.status(500).json({error: err.message});
    }
}

const deletePostHandler = async(req, res) => {
    try{
        const post = await Post.findByIdAndDelete(req.params.id);
        if(!post){
            return res.status(404).json({error: 'Post not found!'});
        }
        res.json({message: 'Post deleted successfully!', post})
    }catch(err){
        if (err.name === 'CastError'){
            return res.status(400).json({error: 'Invalid ID format'})
        }
        res.status(500).json({error: err.message});
    }
}

postsRouter.get('/', getPostsHandler)

postsRouter.get('/:id', getPostByIdHandler)

postsRouter.post('/', createPostHandler)

postsRouter.put('/:id', updatePostHandler)

postsRouter.delete('/:id', deletePostHandler)

module.exports = postsRouter