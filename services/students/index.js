const express = require('express');
const router = express.Router();

const path = require('path');
const students = require("../models/students")
const uuidv4 = require('uuid/v4');
const fs = require('fs-extra');
const multer = require('multer');
const { getStudents, writeStudents } = require('../data/dataHelper');

// const readStudents = async () =>{
//     return await students.find()
// }

//Db GET
router.get('/', async (req, res) => {
    const student = await students.find({});
    res.send(student);
})

//FileSystem GET
// router.get('/', async (req,res)=>{
//     const students = await getStudents();
//     res.send(students);
//     console.log("You are getting it my man!");
// })

//Db GET by ID
router.get("/:id", async (req, res) => {
    const student = await students.findById(req.params.id)
    if (student) {
        res.send(student);
    } else {
        res.status(404).send("Student not found")
    }
})

//FileSystem GET by ID
// router.get('/:id', async (req, res) => {
//     const students = await getStudents();
//     const student = students.find(student => student._id === req.params.id);
//     if (student) {
//         res.send(student);
//     } else {
//         res.status(404).send("Book not found");
//     }
// })

//Db POST
router.post("/", async (req, res) => {
    try {
        const newStudent = await students.create(req.body)
        newStudent.save();
        res.send(newStudent)

    } catch (err) {
        res.status(500).send(err)
    }
})

//Filesystem POST
// router.post('/', async (req,res)=>{
//     const students = await getStudents();
//     const newStudent = {
//         ...req.body,
//         _id: uuidv4(),
//         createdAt: new Date (),
//         updatedAt: new Date ()
//     }
//     students.push(newStudent);
//     await writeStudents(students);
//     res.send(newStudent);
//     console.log(`That's it, you know how to post now!`);
// })


//Db POST w/ MULTER by ID
const multerConfig = multer({});
router.post("/:id/upload", multerConfig.single("profilePic"), async (req, res) => {
    const filedestination = path.join("./images", req.params.id + path.extname(req.file.originalname));
    await fs.writeFile(filedestination, req.file.buffer);
    req.body.img = "/images" + req.params.id + path.extname(req.file.originalname);
    try {
        const student = await students.create(req.body);
        students.save()
        res.send(student);
    } catch (err) {
        res.status(500).send(err);
    }
})

//FileSystem POST w/ MULTER by ID
// router.post('/:id/upload', multerConfig.single("profilePic"), async (req, res) => {
//     const students = await getStudents();
//     const student = students.find(student => student._id == req.params.id);
//     if (student) {
//         const filedestination = path.join("../../../images", req.params.id + path.extname(req.file.originalname));
//         await fs.writeFile(filedestination, req.file.buffer);
//         student.updatedAt = new Date();
//         student.img = "/images" + req.params.id + path.extname(req.file.originalname);
//         await writeStudents(students);
//         res.send(student);
//     } else {
//         res.status("404").send("student not found");
//     }
// })

//Db PUT by ID
router.put("/:id", async (req, res) => {

    delete req.body._id
    const student = await students.findByIdAndUpdate(req.params.id, { $set: { ...req.body } })
    if (student) {
        res.send(student)
    } else {
        res.status(404).send("not found" + req.params.id)
    }

})

//FileSystem PUT by ID
// router.put('/:id', async (req, res) => {
//     const students = await getStudents();
//     const studentToEdit = students.find(student => student._id === req.params.id);
//     if (studentToEdit) {
//         delete req.body._id;
//         delete req.body.createdAt;
//         delete req.body.updatedAt;
//         req.body.updated = new Date();
//         const position = books.indexOf(bookToEdit);
//         const editedStudent = Object.assign(studentToEdit, req.body);
//         students[position] = editedStudent;
//         await writeStudents(students);
//         res.send(editedStudent);
//     }
//     console.log(`yes yes yes, you are starting to remember it`);
// })

//Db DELETE by ID
router.delete("/:id", async (req, res) => {
    const result = await students.findByIdAndDelete(req.params.id)
    if (result) {
        res.send(result);
    } else {
        res.status(404).send("not found");
    }
})

//Db check Email

router.post("/checkEmail", async (req,res)=>{
    const emailExist = await students.findOne({email: req.body.email})
    console.log(emailExist);
    if(emailExist){
        res.send("Email already in use");
    }else{
        res.send("Email available");
    }
})

// FileSystem DELETE by ID
// router.delete('/:id', async (req, res) => {
//     const students = await getStudents();
//     const studentsRemained = students.filter(student => student._id !== req.params.id);
//     if (studentsRemained.length < students.length) {
//         await writeStudents(studentsRemained);
//         res.send('Removed')
//     } else {
//         res.status("404").send("student not found");
//     }
//     console.log(`Alright, it's just a walk in a park for you now`);
// })
module.exports = router;