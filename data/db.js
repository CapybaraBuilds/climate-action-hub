let posts = [
    {
        id: 1,
        title: "Reduce Carbon Footprint",
        content: "Tips...",
        authorId: 1,
        createAt: new Date()
    }
];

let nextPostId = 2;

let comments = [
    {
        id: 1,
        postId: 1,
        content: 'Great post!',
        authorId: 2,
        createdAt: new Date()
    }
]

let nextCommentId = 2

let users = [
    {
        id: 1,
        userName: 'Alice',
        email: 'alice@mail.com'
    },
    {
        id:2,
        userName: 'Bill',
        email: 'bill@mail.com'
    }
]

let nextUserId = 3

module.exports = {posts, getNextPostId: ()=>nextPostId++, comments, getNextCommentId: ()=>nextCommentId++, users, getNextUserId: ()=>nextUserId++}