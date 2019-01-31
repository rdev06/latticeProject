const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const patient = require('../models/patients.js');
const checkAuth = require('../check-auth');
const route = express.Router();



route.get('/patients',(req,res)=>{
patient.find()
        .select('email')
        .exec()
        .then(doc=>{
                const response = {
                        message:'All patients!!!',
                        all:doc.map(x=>{
                                return {
                                        email:x.email,
                                }
                        }) 

                };
                res.status(200).json(response); 
        })
        .catch(err=>{
                console.log(err);
                
        })
        }      
)

route.post('/add_patient',(req,res)=>{
        patient.find({email:req.body.email},(err,data)=>{
                if (err) {
                       console.log(err);
                } else {
                if (data[0]) {
                        res.status('302').json({
                                message:'patient already exit',
                                profile:data
                        })   
                } else {
                        Date.now()
                        
                        const n = new patient({
                                email:req.body.email,
                                password:req.body.password,
                                date:Date.now(),
                        })
                        bcrypt.genSalt(10, (err, salt) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                        bcrypt.hash(n.password, salt, (err, hash) => {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    n.password = hash;
                                                    n.save((err,out)=>{
                                                        if (err) {
                                                               console.log(err);
                                                        } else {
                                                                res.status('201').json({
                                                                        message:'patient added successfully',
                                                                        result:out
                                                                })  
                                                        }
                                                })
                                                }
                                        })
                                }
                        })
                }
                }
                
        })
})


route.post('/login',(req,res)=>{
        patient.findOne({email:req.body.email},(err,result)=>{
                if (!result) {
                      res.status(200).json({
                              msg:'User not found'
                      }) 
                } else {
                        bcrypt.compare(req.body.password,result.password,(err,match)=>{
                                if (err) {
                                       console.log(err);
                                } else {
                                        if (match) {
                                                const token = jwt.sign({
                                                        email:result.email,           //here user is the return query from the database
                                                        userID:result._id          
                                                    },'lovecoding',
                                                    {
                                                        expiresIn:'1h'
                                                    })
                                                    res.status(200).json({
                                                            msg:'You logged in, save your token',
                                                            token:token
                                                    })
                                        } else {
                                               res.status(200).json({
                                                       msg:'Wrong password'
                                               }) 
                                        }
                                }
                        })  
                }
        })
        
})

route.get('/patient_details/:id',checkAuth,(req,res)=>{
        patient.findById(req.params.id)
        .select('email enq1 date')
        .exec()
        .then(result=>{
                res.status(200).json({
                        details:result
                })
        })
        .catch(err=>console.log(err))
})

route.post('/update_patient/:id',checkAuth,(req,res)=>{
        let u = {};
        req.body.enq1?u.enq1=req.body.enq1:'';
        u.date=Date.now();
        patient.findByIdAndUpdate(req.params.id,{$set:u},{upsert:true},(err,out)=>{
                if (err) {
                        console.log(err); 
                }
                res.status(200).json({
                        enq:out
                })
        });
})


route.delete('/patient/:id',checkAuth,(req,res)=>{
        patient.findOneAndDelete(req.params.id,(err)=>{
                if (err) {
                       console.log(err);
                }
        })
})

module.exports = route;