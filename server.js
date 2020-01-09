const express = require('express');
const server = express();
const studentServices = require('../students/services/students/index');
const studentSchema = require('./services/models/students/index');
const mongoose = require("mongoose");

//DB
mongoose.connect("mongodb://127.0.0.1:27017/studentsdb", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(db => {
        console.log("MongoDb Connected")
    },
        err => console.log("Error connecting with MongoDb", err))

const PORT = 8000;
server.use(express.json());
server.listen(PORT, () => {
    console.log(`Yo my man, your server is running at port 8000`);
})

server.use('/students', studentServices);

