//Connection to database
const mysql=require('mysql');
const bcrypt=require('bcrypt');

const password=bcrypt.hashSync("Vuz83162",10);

var mysqlPool = mysql.createPool({
	host : 'remotemysql.com',
	user: 'tb4GpADoaH',
	password : '3EV9hAN7Bn',
	database : 'tb4GpADoaH'
});

mysqlPool.getConnection((err, connection) => {
	if(!err){
		console.log('DB connection Success');
	}
	else{
		console.log(err);
	}
	connection.release();
});

function tableCreation(){
	mysqlPool.getConnection((err, connection) => {
		if(err)
			console.log(err)
		else{
			var query = 'CREATE TABLE donars (idpatients INT NOT NULL AUTO_INCREMENT,name VARCHAR(45) NOT NULL,address VARCHAR(200) NOT NULL,bloodGroup VARCHAR(7) NOT NULL,date DATE NOT NULL,phone VARCHAR(10) NOT NULL, PRIMARY KEY (idpatients))';
			connection.query(query, (err, rows)=>{
				connection.release();
				if(err)
					console.log(err);
				else
					console.log('Donars Table Created!');
			});
		}
	});

	mysqlPool.getConnection((err, connection) => {
		if(err)
			console.log(err)
		else{
			var query = 'CREATE TABLE receivingusers (user VARCHAR(45) NOT NULL,password VARCHAR(70) NOT NULL,PRIMARY KEY (user))';
			connection.query(query, (err, rows)=>{
				connection.release();
				if(err)
					console.log(err);
				else
					console.log('Receiving Users Table Created!');
			});
		}
	});

	mysqlPool.getConnection((err, connection) => {
		if(err)
			console.log(err)
		else{
			var query = 'CREATE TABLE uploadingusers (user VARCHAR(45) NOT NULL,password VARCHAR(70) NOT NULL,PRIMARY KEY (user))';
			connection.query(query, (err, rows)=>{
				connection.release();
				if(err)
					console.log(err);
				else
					console.log('Uploading Users Table Created!');
			});
		}
	});
	
	mysqlPool.getConnection((err, connection) => {
		if(err)
			console.log(err)
		else{
			var query = 'CREATE TABLE admins (user VARCHAR(45) NOT NULL,password VARCHAR(70) NOT NULL,PRIMARY KEY (user))';
			connection.query(query, (err, rows)=>{
				connection.release();
				if(err)
					console.log(err);
				else
					console.log('Uploading Users Table Created!');
			});
		}
	});
}

function addAdmin(){
	mysqlPool.getConnection((err, connection) => {
		if(err)
			console.log(err)
		else{
			var data={
				user: 'priyanshu',
				password: bcrypt.hashSync("vuz83162",10) 
			};
			let insertQuery = 'INSERT INTO admins SET ?';
			let query = mysql.format(insertQuery,[data]);
			connection.query(query, (err, rows)=>{
				connection.release();
				if(err)
					console.log(err);
				else
					console.log('Priyanshu Added as Admin!');
			});
		}
	});
}
module.exports = {
	mysqlPool,
	mysql,
	tableCreation,
	addAdmin
};