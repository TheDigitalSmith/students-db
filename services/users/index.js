const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    console.log(`You can get users now`);
})

router.post('/',(req,res)=>{
    console.log(`You can add users now`);
})

router.put('/',(req,res)=>{
    console.log(`You can now edit your users`);
})

router.delete('/',(req,res)=>{
    console.log(`You can delete users now`);
})


module.exports = router;