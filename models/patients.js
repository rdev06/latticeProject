const mongoose = require('mongoose');
const database = require('../config/database')
mongoose.connect(database.database, {
    useNewUrlParser: true
});
const db = mongoose.connection;

//for successful connection

db.once('open', () => {
    console.log('connected to MongoDB successfully!!!');

});

//for error in connection
db.on('error', (err) => {
    console.log(err);

});

//for defining schema
let patientSchema = mongoose.Schema({
    enq1: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date:{
        type:Number,
        required:true
    }
});

//for defining models

let patient = mongoose.model('patient', patientSchema);
module.exports = patient;
