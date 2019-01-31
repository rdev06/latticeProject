const express = require('express');
const { check, validationResult } = require('express-validator/check');
const { saitize } = require('express-validator/filter');
const bcrypt = require('bcryptjs');
const patient = require('../models/patients.js');
const route = express.Router();

//An api which returns a list of patients who havent submitted any survey in 2 weeks

route.get('/noe',(req,res)=>{
    patient.find()
    .select('enq1 date email')
    .exec()
    .then(data=>{
           const response = data.map(ne=>{
            if (Date.now()-ne.date >= (2*7*24*60*60*1000)) {
                return ne
            }else{
                msg:'all user had sent there enquiry'
            }
        })
            
           res.status(200).json({
               msg:'List of user not sent there enquiry',
               li:response.filter(x=>x)
           })
        })
    .catch('Something gets error')
})

module.exports = route