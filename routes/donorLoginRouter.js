const path=require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mysqlConnection = require('C:/PlasmaDonation/database/database.js');
const bcrypt = require('bcrypt');

const connection = mysqlConnection.mysqlPool;

const donorLoginRouter = express.Router();

donorLoginRouter.use(express.static(path.join(__dirname + "/../")));
donorLoginRouter.use(bodyParser.json());
donorLoginRouter.use(bodyParser.urlencoded({extended: false}));

donorLoginRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    next();
})
.get((req,res,next) => {
    res.render('../login.ejs',{action: "donor", msg: ""});
})
.post((req, res, next) => {
	connection.getConnection((err, connector) => {
		if(err)
			console.log(err)
		else{
			let selectQuery = 'SELECT * FROM donors WHERE email=?';
			let query = mysql.format(selectQuery,[req.body.username]);
			connector.query(query, (err, rows)=>{
				connector.release();
				if(err){
					res.send("An Error Occured!");
					console.log(err);
				}
				else if(rows.length==0){
					res.render('../login.ejs',{action: "donor", msg: "User Doesn't Exist!"});
				}
				else{
					if(bcrypt.compareSync(req.body.password, rows[0].password)){
						res.render('../donorPage.ejs',{msg: ""});
					}
					else{
						res.render('../login.ejs',{action: "donor", msg: "Password Incorrect!"});
					}
				}
			});
		}
	});
});

module.exports = donorLoginRouter;