const path=require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('C:/PlasmaDonation/database/database.js');
const xlsx = require('xlsx');
const upload = require('express-fileupload');
const fs = require('fs');
const bcrypt = require('bcrypt');

const connection = mysql.mysqlConnection;

const uploadingRouter = express.Router();

uploadingRouter.use(express.static(path.join(__dirname + "/../")));
uploadingRouter.use(bodyParser.json());
uploadingRouter.use(bodyParser.urlencoded({extended: false}));

uploadingRouter.use(upload());

uploadingRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    next();
})
.get((req,res,next) => {
    res.render('../login.ejs',{action: "putData", msg: ""});
})
.post((req, res, next) => {
	connection.getConnection((err, connector)=>{
		connector.query("SELECT * FROM uploadingusers WHERE user=?",[req.body.username],(err,rows)=>{
			connector.release();
			if(err){
				res.send("An error occured");
				console.log(err);
			}
			else if(rows.length==0){
				res.render('../login.ejs',{action: "putData", msg: "User Doesn't Exist!"});
			}
			else{
				if(bcrypt.compareSync(req.body.password, rows[0].password)){
					res.render('../uploadingPage.ejs',{msg: ""});
	
				}
				else{
					res.render('../login.ejs',{action: "putData", msg: "Password Incorrect!"});
				}
			}
		});
	}); 
});

uploadingRouter.route('/upload')
.post((req,res,next) => {
    res.send("Under Construction");
});

module.exports = uploadingRouter;