const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../../models/user');
const bcrypt = require('bcrypt');

router.get('/',(req,res) => {
    res.json('Welcome to Api')
});

// Register
router.post('/Register',(req,res,next)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user => {
        if (user.length >= 1) {
             return res.status(409).json({
                message: 'ایمیل تکراری'
             });
            } else{
                bcrypt.hash(req.body.password,10, (err,hash)=>{
                    if (err) {
                       return res.status(500).json({
                           error : err
                       });
                    } else {
                        const user = new User({
                            _id : new mongoose.Types.ObjectId(),
                            name: req.body.name,
                            lastname: req.body.lastname,
                            email: req.body.email,
                            phone: req.body.phone,
                            password: hash
                        });
                        user
                        .save()
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: 'ثبت نام با موفقیت انجام شد'
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        })
                    }
                }) 
              
            }
    })
    .catch();
});

// Delete User
router.delete('/:userId' , (req , res , next) => {
    User.remove({_id: req.params.userId})
    .exec()
    .then(result => {
        res.status(200).json({
            message : 'کاربر حذف شد'
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    })
});

module.exports = router;