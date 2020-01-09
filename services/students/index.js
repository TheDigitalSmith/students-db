const express = require ('express');
const router = express.Router();

const uuidv4 = require('uuid/v4');
const fs = require ('fs-extra');
const multer = require ('multer');
const {getStudents, writeStudents} = require ('../data/dataHelper');

router.get('/', async (req,res)=>{
    const students = await getStudents();
    res.send(students);
    console.log("You are getting it my man!");
})

router.get('/:id', async (req,res)=>{
    const students = await getStudents();
    const student = students.find(student => student._id === req.params.id);
    if (student){
        res.send(student);
    } else {
        res.status(404).send("Book not found");
    }
})

router.post('/', async (req,res)=>{
    const students = await getStudents();
    const newStudent = {
        ...req.body,
        _id: uuidv4(),
        createdAt: new Date (),
        updatedAt: new Date ()
    }
    students.push(newStudent);
    await writeStudents(students);
    res.send(newStudent);
    console.log(`That's it, you know how to post now!`);
})

const multerConfig = multer ({});
router.post('/:id/upload', multerConfig.single("profilePic"), async (req,res)=>{
    const students = await getStudents();
    const student = students.find(student => student._id == req.params.id);
    if (student){
        const filedestination = path.join("../../../images", req.params.id + path.extname(req.file.originalname));
        await fs.writeFile(filedestination,req.file.buffer);
        student.updatedAt = new Date ();
        student.img = "/images" + req.params.id + path.extname(req.file.originalname);
        await writeStudents(students);
        res.send(student);
    }else{
        res.status("404").send("student not found");
    }
})

router.put('/:id',async (req,res)=>{
    const students = await getStudents();
    const studentToEdit = students.find(student => student._id === req.params.id);
    if (studentToEdit){
        delete req.body._id;
        delete req.body.createdAt;
        delete req.body.updatedAt;
        req.body.updated = new Date ();
        const position = books.indexOf(bookToEdit);
        const editedStudent = Object.assign(studentToEdit,req.body);
        students[position] = editedStudent;
        await writeStudents(students);
        res.send(editedStudent);
    }
    console.log(`yes yes yes, you are starting to remember it`);
})

router.delete('/:id', async (req,res)=>{
    const students = await getStudents();
    const studentsRemained = students.filter(student => student._id !== req.params.id);
    if (studentsRemained.length < students.length){
        await writeStudents(studentsRemained);
        res.send('Removed')
    }else{
        res.status("404").send("student not found");
    }
    console.log(`Alright, it's just a walk in a park for you now`);
})
module.exports = router;