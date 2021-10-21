const path=require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('C:/PlasmaDonation/database/database.js');
const bcrypt = require('bcrypt');

const adminRouter = express.Router();

adminRouter.use(express.static(path.join(__dirname + "/../")));
adminRouter.use(bodyParser.json());
adminRouter.use(bodyParser.urlencoded({extended: false}));

const connection = mysql.mysqlConnection;

adminRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    next();
})
.get((req,res,next) => {
    res.render('../login.ejs',{action: "admin", msg: ""}); 
})
.post((req, res, next) => {
	connection.query("SELECT * FROM admins WHERE user=?",[req.body.username],(err,rows)=>{
		if(err){
			res.send("An error occured");
			console.log(err);
		}
		else if(rows.length==0){
			res.render('../login.ejs',{action: "admin", msg: "User Doesn't Exist!"});
		}
		else{
			if(bcrypt.compareSync(req.body.password, rows[0].password)){
				res.render('../adminPage.ejs',{msg: ""});
			}
			else{
				res.render('../login.ejs',{action: "admin", msg: "Password Incorrect!"});
			}
		}
	});
    
});

adminRouter.route('/edit')
.post((req, res, next) => {

	if(req.body.method == "add"){

		var data={
		user: req.body.name,
		password: bcrypt.hashSync(req.body.password,10) 
		};
		var myQuery = "SELECT * FROM "+req.body.type+" WHERE user=?";
		let msgs=[];
	
		connection.query(myQuery, req.body.name,(err,rows)=>{
			if(err){
				res.send("Error Occured");
				console.log(err);
			}
			else if(rows.length>0){
				res.render('../adminPage.ejs',{msg: "Username used!"});
			}
			else{
				myQuery = "INSERT INTO "+req.body.type+" SET ?";
				connection.query(myQuery,[data],(err,rows)=>{

					if(err){
						console.log(err);
					}
					else{
						res.render('../adminPage.ejs',{msg: "User Added!"});
					}
				});
			}
		});
	}

	else if(req.body.method == "delete"){
		var myQuery = "DELETE FROM "+req.body.type+" WHERE user=?";
		connection.query(myQuery,req.body.username,(err,rows)=>{
			if(err){
				res.send("Error Occured");
				console.log(err);
			}
			else{
				res.render('../adminPage.ejs',{msg: "User Deleted!"});
			}
		});
	}
});

module.exports = adminRouter;