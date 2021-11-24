const path=require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mysqlConnection = require('C:/PlasmaDonation/database/database.js');
const bcrypt = require('bcrypt');

const connection = mysqlConnection.mysqlPool;

const updatingRouter = express.Router();

updatingRouter.use(express.static(path.join(__dirname + "/../")));
updatingRouter.use(bodyParser.json());
updatingRouter.use(bodyParser.urlencoded({extended: false}));

updatingRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    next();
})
.get((req,res,next) => {
    res.render('../login.ejs',{action: "donor", msg: "Please Log in first!"});
})
.post((req, res, next) => {
	connection.getConnection((err, connector)=>{
		if(err){
			console.log(err);
		}
		else{
			let insertQuery = "UPDATE donors SET ? WHERE email=?";
			let insideQuery = mysql.format(insertQuery,[req,req.body.email]);
			connector.query(insideQuery,(err,rows)=>{
				connector.release();
				if(err){
					res.send("An error occured");
					console.log(err);
				}
				else{
					res.render('../login.ejs',{action: "donor", msg: "Database Updated!"});
				}
			});
		}
	});
});
module.exports = updatingRouter;

