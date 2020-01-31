const express = require('express');

const app = express();

app.use((request, response) => {
    response.json({ message: 'Hey! This is your server response!' });  
});

module.exports = app;