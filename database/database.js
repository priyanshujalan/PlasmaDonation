//Connection to database
const mysql=require('mysql');
const bcrypt=require('bcrypt');

const password=bcrypt.hashSync("Vuz83162",10);

var mysqlConnection = mysql.createConnection({
	host : 'remotemysql.com',
	user: '2WbjCHT0R3',
	password : 'b0TQjh75d9',
	database : '2WbjCHT0R3'
});

mysqlConnection.connect((err) => {
	if(!err){
		console.log('DB connection Success');
	}
	else{
		console.log(err);
	}
});

function tableCreation(){
	mysqlConnection.query('CREATE TABLE 2WbjCHT0R3.patients (idpatients INT NOT NULL AUTO_INCREMENT,name VARCHAR(45) NOT NULL,address VARCHAR(200) NOT NULL,bloodGroup VARCHAR(7) NOT NULL,date DATE NOT NULL,phone VARCHAR(10) NOT NULL, PRIMARY KEY (idpatients))',
	(err,rows) =>{
		if(err){
			console.log(err);
		}
		else{
			console.log("Patient Table Created.");
		}
	});
	mysqlConnection.query('CREATE TABLE 2WbjCHT0R3.receivingusers (user VARCHAR(45) NOT NULL,password VARCHAR(70) NOT NULL,PRIMARY KEY (user))',
	(err,rows) =>{
		if(err){
			console.log(err);
		}
		else{
			console.log("Receiving Users Table Created.");
		}
	});
	mysqlConnection.query('CREATE TABLE 2WbjCHT0R3.uploadingusers (user VARCHAR(45) NOT NULL,password VARCHAR(70) NOT NULL,PRIMARY KEY (user))',
	(err,rows) =>{
		if(err){
			console.log(err);
		}
		else{
			console.log("Uploading Users Table Created.");
		}
	});
	mysqlConnection.query('CREATE TABLE 2WbjCHT0R3.admins (user VARCHAR(45) NOT NULL,password VARCHAR(70) NOT NULL,PRIMARY KEY (user))',
	(err,rows) =>{
		if(err){
			console.log(err);
		}
		else{
			console.log("Admins Users Table Created.");
		}
	});
}

function addAdmin(){
	mysqlConnection.query('INSERT INTO admins SET ?',{user: "priyanshu", password: password},(err,rows)=>{
		if(err){
			console.log(err);
		}
		else{
			console.log("priyanshu's user was created.");
		}
	});
}
module.exports = {
	mysqlConnection,
	tableCreation,
	addAdmin
};