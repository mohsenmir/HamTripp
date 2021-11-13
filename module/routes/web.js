const express = require('express');

const router = express.Router();


router.get('/',(req,res) => {
    res.json('Welcome to Home page')
});

router.get('/aboute',(req,res)=>{
    res.json('Welcome to About page')
});

module.exports = router;