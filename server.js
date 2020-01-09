const express = require('express');
const server = express();
const studentServices = require('../students/services/students/index');
const userServices  = require ('../students/services/users/index');
const PORT = 8000;
server.use(express.json());
server.listen(PORT,()=>{
    console.log (`Yo my man, your server is running at port 8000`);
})

server.use('/students', studentServices);

