const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
const patient = require('./models/patients')
const patientr = require('./route/patient.js');
const doctor = require('./route/doctor.js');

const app = express();

const port = process.env.PORT ||3000;


//body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

// parse application/json
app.use(bodyParser.json())

app.use(patientr);
app.use(doctor);



const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'rdev.dev06@gmail.com',
      pass: 'ostindev0663'
    }
  });


//doctor needs to be notified if the patient haven't filled the survey in last 4 weeks


 setInterval(() => {
  patient.find()
  .select('enq1 date email')
  .exec()
  .then(data=>{
      const tom = data.map(ne=>{
           if (Date.now()-ne.date >= (4*7*24*60*60*1000)) {
               return ne;
           }
       })
   const mailOptions = {
      from: 'rdev.dev06@gmail.com',
      to: 'rdev.dev63@gmail.com',
      subject: 'Sending Email using Node.js',
      text: JSON.stringify(tom.filter(x=>x))
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
   })

.catch('Something gets error')
 }, 120000);


//patient need to be notified every week on friday

setInterval(() => {
  let d = new Date();
  let n = d.getDay();
  if (n == 5) {
          patient.find()
          .select('enq1 date email')
          .exec()
          .then(data=>{
                  for (const i of data) {
                          if (Date.now()-i.date >= (1*7*24*60*60*1000)) {
                                  const mailOptions = {
                                          from: 'rdev.dev06@gmail.com',
                                          to: i.email,
                                          subject: 'Sending Email using Node.js',
                                          text: 'You need to fill enquiry form'
                                        };
                                        
                                        transporter.sendMail(mailOptions, function(error, info){
                                          if (error) {
                                            console.log(error);
                                          } else {
                                            console.log('Email sent: ' + info.response);
                                          }
                           })
                  }
                  
               }})
          .catch(err=>{
                  console.log(err);
          })   
  }
}, 180000);


app.get('/', (req,res) => {
    const mailOptions = {
        from: 'rdev.dev06@gmail.com',
        to: 'rdev.dev63@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    //res.send('This is homepage');
})

app.get('/se',(req,res)=>{
    
})


app.listen(port, () => console.log(`server is running at http://localhost:${port}`));