const path=require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mysqlConnection = require('C:/PlasmaDonation/database/database.js');
const bcrypt = require('bcrypt');

const adminRouter = express.Router();

adminRouter.use(express.static(path.join(__dirname + "/../")));
adminRouter.use(bodyParser.json());
adminRouter.use(bodyParser.urlencoded({extended: false}));

const connection = mysqlConnection.mysqlPool;
const mysql = mysqlConnection.mysql;

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
	connection.getConnection((err, connector) => {
		if(err)
			console.log(err)
		else{
			let selectQuery = 'SELECT * FROM admins WHERE user=?';
			let query = mysql.format(selectQuery,[req.body.username]);
			connector.query(query, (err, rows)=>{
				connector.release();
				if(err){
					res.send("An Error Occured!");
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
		connection.getConnection((err, connector) => {
			if(err)
				console.log(err)
			else{
				let selectQuery = "SELECT * FROM "+req.body.type+" WHERE user=?";
				let query = mysql.format(selectQuery,[req.body.name]);
				connector.query(query, (err, rows)=>{
					if(err)
						console.log(err);
					else if(rows.length > 0){
						res.render('../adminPage.ejs',{msg: "User Already Present!"});
					}
					else{
						let insertQuery = "INSERT INTO "+req.body.type+" SET ?";
						let insideQuery = mysql.format(insertQuery,[data]);
						connector.query(insideQuery, (err, rows)=>{
							if(err)
								console.log("Error!")
							else{
								res.render('../adminPage.ejs',{msg: "User Added!"});
							}
						});
					}
				});
			}
			connector.release();
		});
		
	}

	else if(req.body.method == "delete"){
		connection.getConnection((err, connector) => {
			if(err)
				console.log(err)
			else{
				let delQuery = "DELETE FROM "+req.body.type+" WHERE user=?";
				let query = mysql.format(delQuery,[req.body.username]);
				connector.query(query, (err, rows)=>{
					connector.release();
					if(err)
						console.log(err);
					else if(rows.length() == 0){
						res.render('../adminPage.ejs',{msg: "User Not Found!"});
					}
					else{
						res.render('../adminPage.ejs',{msg: "User Deleted!"});
					}
				});
			}
		});
	}
});

module.exports = adminRouter;