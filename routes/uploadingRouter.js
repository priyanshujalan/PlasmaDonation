const path=require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('C:/plasmaDonation/database/database.js');
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
	connection.query("SELECT * FROM uploadingusers WHERE user=?",[req.body.username],(err,rows)=>{
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

uploadingRouter.route('/upload')
.post((req,res,next) => {
    if(req.files){

		var file = req.files.excelFile;
		var filename = file.name;

		file.mv("./upload/"+filename,(err)=>{

			if(err){
				console.log(err);
				res.send("Error Occured!");
			}
			else{

				var wb = xlsx.readFile('./upload/'+filename,{cellDates: true});
				var ws = wb.Sheets[wb.SheetNames[0]];

				var data = xlsx.utils.sheet_to_json(ws);

				data.forEach((record)=>{

					var actualDate= record.date.getDate() +1;
					record.date.setDate(actualDate);
					connection.query('INSERT INTO patients SET ?',[record],(err,rows)=>{
						if(err){
							console.log(err);
						}
					});
				});
				fs.unlink('./upload/'+filename, (err)=>{
					if(err){
						res.send("data uploaded but an error occured.");
						console.log(err);
					}
					else{
						res.render('../uploadingPage.ejs',{msg: "Data Uploaded!"});
					}
				});
			}
		});
	}
});

module.exports = uploadingRouter;