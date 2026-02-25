const express = require('express')
const commentsRouter = express.Router({mergeParams: true})
const {comments, getNextCommentId, posts} = require('../data/db')

const getCommentsHandler = (req, res) => {
    const postId = req.params.postId;
    const commentsByPostId = comments.filter(comment => comment.postId===parseInt(postId));
    if(commentsByPostId.length > 0){
        res.status(200).json(commentsByPostId)
    }else{
        res.status(404).json({error: `Post with id ${parseInt(postId)} has no comments`})
    }
}

const createCommentHandler = (req, res) => {
    const postId = parseInt(req.params.postId);
    const post = posts.find(post=>post.id===postId);
    if(post){
        const {content, authorId} = req.body
        const newComment = {
            id: getNextCommentId(),
            postId,
            content,
            authorId,
            createdAt: new Date()
        }
        comments.push(newComment)
        res.status(201).json(newComment)
    }else{
        res.status(400).json({error: `Post with id ${postId} unfound`})
    }
}

const deleteCommentHandler = (req, res)=>{
    const postId = parseInt(req.params.postId);
    const commentId = parseInt(req.params.id);
    const commentIdx = comments.findIndex(comment=>comment.id === commentId)
    if(commentIdx !== -1 && comments[commentIdx].postId === postId){
        comments.splice(commentIdx, 1)
        res.status(200).send(`Comment with id ${commentId} of post with id ${postId} is deleted.`)
    }else if(commentIdx !== -1 && comments[commentIdx].postId !== postId){
        res.status(404).json({error: `Post with id ${postId} has no such comment.`})
    }else{
        res.status(404).json({error: `Comment with id ${commentId} not found`})
    }
}

commentsRouter.get('/', getCommentsHandler)

commentsRouter.post('/', createCommentHandler)

commentsRouter.delete('/:id', deleteCommentHandler)


module.exports = commentsRouter