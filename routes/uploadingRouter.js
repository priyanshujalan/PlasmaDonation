const path=require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mysqlConnection = require('C:/PlasmaDonation/database/database.js');
const bcrypt = require('bcrypt');

const connection = mysqlConnection.mysqlPool;

const uploadingRouter = express.Router();

uploadingRouter.use(express.static(path.join(__dirname + "/../")));
uploadingRouter.use(bodyParser.json());
uploadingRouter.use(bodyParser.urlencoded({extended: false}));

uploadingRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    next();
})
.get((req,res,next) => {
    res.render('../registration.ejs');
})
.post((req, res, next) => {
	connection.getConnection((err, connector)=>{
		let insertQuery = "INSERT INTO donors SET ?";
		let insideQuery = mysql.format(insertQuery,[req]);
		connector.query(insideQuery,(err,rows)=>{
			connector.release();
			if(err){
				res.send("An error occured");
				console.log(err);
			}
			else{
					res.render('../login.ejs',{action: "putData", msg: "Password Incorrect!"});
			}
		});
	}); 
});

uploadingRouter.route('/upload')
.post((req,res,next) => {
    res.send("Under Construction");
});

module.exports = uploadingRouter;