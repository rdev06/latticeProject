const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    try {
        const token = req.headers.authorization.split(' ')[1];
        //console.log(token);
        jwt.verify(token,'lovecoding',(err,verify)=>{
            if (err) {
                console.log(err);
            } else {
         req.userData = verify;
        next();
            }
        });
         
    } catch (error) {
        console.log(error);
        res.end('Auth Failed!!');
    }
}