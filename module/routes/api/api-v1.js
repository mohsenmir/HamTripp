const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.get('/',(req,res) => {
    res.json('Welcome to Api')
});

// Register
router.post('/register',(req,res,next)=>{
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


// Login
router.post('/login',(req,res,next)=>{
    User.find({ email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1){
            return res.status(401).json({
                message: 'اطلاعات وارد شده صحیح نیست'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err,result) => {
            if(err){
                return res.status(401).json({
                    message: 'اطلاعات وارد شده صحیح نیست'
                });
            }
            if(result) {
            const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                }, '1p09@d#d)g95ivgy&eih#8z82h02mqvl5czx2#0i&)4!prvqt=',
                {
                    expiresIn: '1h', // توکن بعد از یک ساعت غیرفعال میشه
                },
                
                )
                return res.status(200).json({
                    message : 'با موفقیت وارد شدید',
                    token : token
                });
            }
            return res.status(401).json({
                message: 'اطلاعات وارد شده صحیح نیست'
            });
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    }); 
})


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