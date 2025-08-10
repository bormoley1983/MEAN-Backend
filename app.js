const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Origin', '*');
    resp.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    resp.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();
});

// app.use((req, resp, next) => {
//     console.log('In the middleware');
//     next();
// });


app.post('/api/posts', (req, resp, next) => {
    const post = req.body;//by bodyParser
    console.log(post);
    resp.status(201).json({
        message: 'Post added successfully'
    });
});

app.use('/api/posts', (req, resp, next) => {
    const posts = [
        {
            id: 'abc',
            title: 'First post',
            content: 'This is the first post!'
        },
        {
            id: 'def',
            title: 'Second post',
            content: 'This is the second post!'
        }
    ];

    resp.status(200).json({
        message: 'Posts fetched successfully',
        posts: posts
    });
});

module.exports = app;