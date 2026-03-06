const express = require('express');
const {protect} = require('../middleware/auth');
const commentsRouter = express.Router({mergeParams: true});
// const {comments, getNextCommentId, posts} = require('../data/db')
const Comment = require('../models/Comment');
const Post = require('../models/Post');

// const getCommentsHandler = (req, res) => {
//     const postId = req.params.postId;
//     const commentsByPostId = comments.filter(comment => comment.postId===parseInt(postId));
//     if(commentsByPostId.length > 0){
//         res.status(200).json(commentsByPostId)
//     }else{
//         res.status(404).json({error: `Post with id ${parseInt(postId)} has no comments`})
//     }
// }

// const createCommentHandler = (req, res) => {
//     const postId = parseInt(req.params.postId);
//     const post = posts.find(post=>post.id===postId);
//     if(post){
//         const {content, authorId} = req.body
//         const newComment = {
//             id: getNextCommentId(),
//             postId,
//             content,
//             authorId,
//             createdAt: new Date()
//         }
//         comments.push(newComment)
//         res.status(201).json(newComment)
//     }else{
//         res.status(400).json({error: `Post with id ${postId} unfound`})
//     }
// }

// const deleteCommentHandler = (req, res)=>{
//     const postId = parseInt(req.params.postId);
//     const commentId = parseInt(req.params.id);
//     const commentIdx = comments.findIndex(comment=>comment.id === commentId)
//     if(commentIdx !== -1 && comments[commentIdx].postId === postId){
//         comments.splice(commentIdx, 1)
//         res.status(200).send(`Comment with id ${commentId} of post with id ${postId} is deleted.`)
//     }else if(commentIdx !== -1 && comments[commentIdx].postId !== postId){
//         res.status(404).json({error: `Post with id ${postId} has no such comment.`})
//     }else{
//         res.status(404).json({error: `Comment with id ${commentId} not found`})
//     }
// }

const getCommentsByPostIdHandler = async(req, res) => {
    try{
        const post = await Post.findById(req.params.postId)
        if(!post){
            return res.status(404).json({error: 'Post not found'})
        }
        const comments = await Comment.find({postId: req.params.postId});
        res.json(comments);
    }catch(err){
        if(err.name === 'CastError') {
            return res.status(400).json({error: 'Invalid ID format!'})
        }
        res.status(500).json({error: err.message});
    }
}

const createCommentHandler = async(req, res) => {
    try{
        const {content} = req.body;
        if(!content){
            return res.status(400).json({error: 'Content is required!'});
        }
        const post = await Post.findById(req.params.postId);
        if(!post){
            return res.status(404).json({error: 'Post not found!'})
        }
        const comment = await Comment.create({
            content,
            postId: req.params.postId,
            authorId: req.user._id
        })
        res.json(comment);
    }catch(err){
        if(err.name === 'CastError'){
            return res.status(400).json({error: 'Invalid id format'});
        }
        res.status(500).json({error: err.message})

    }
}

const deleteCommentHandler = async(req, res) => {
    try{
        const post = await Post.findById(req.params.postId);
        if(!post){
            return res.status(404).json({error: 'Post not found'});
        }
        const comment = await Comment.findById(req.params.id);
        if(!comment){
            return res.status(404).json({error: 'Comment not found'});
        }
        if(comment.authorId.toString() !== req.user._id.toString()){
            return res.status(403).json({error: 'Not authorized to delete this comment!'});
        }
        await Comment.findByIdAndDelete(req.params.id);
        res.json({message: 'Comment deleted successfully!', comment})
    }catch(err){
        if(err.name === 'CastError'){
            return res.status(404).json({error: 'Invalid id format!'})
        }
        res.status(500).json({error: err.message})
    }
}

commentsRouter.get('/', getCommentsByPostIdHandler)

commentsRouter.post('/', protect, createCommentHandler)

commentsRouter.delete('/:id', protect, deleteCommentHandler)


module.exports = commentsRouter