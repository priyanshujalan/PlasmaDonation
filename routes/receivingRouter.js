const path=require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('C:/PlasmaDonation/database/database.js');
const bcrypt = require('bcrypt');
const connection = mysql.mysqlConnection;

const receivingRouter = express.Router();

receivingRouter.use(express.static(path.join(__dirname + "/../")));
receivingRouter.use(bodyParser.urlencoded({extended: false}));
receivingRouter.use(bodyParser.json());

receivingRouter.route('/')
.get((req,res,next) => {
    res.render('../login.ejs',{action: "getData", msg: "" });
})
.post((req, res, next) => {
    connection.query("SELECT * FROM receivingusers WHERE user=?",[req.body.username],(err,rows)=>{
        if(err){
            res.send("Error Occured!");
            console.log(err);
        }
        else if(rows.length==0){
            res.render('../login.ejs',{action: "getData", msg: "User Doesn't Exist"});
        }
        else{
            if(bcrypt.compareSync(req.body.password, rows[0].password)){
                res.render('../recevingPage.ejs',{records: []});
            }
            else{
                res.render('../login.ejs',{action: "getData", msg: "Incorrect Password!"});
            }
        }
    });
});

receivingRouter.route('/data')
.post((req, res, next) => {
    let bg;
    let place = '%' + req.body.place + '%';
    let date= new Date();
    let day = date.getDate()-21;
    date.setDate(day); 
    
    let myDate = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
    switch(req.body.type){

        case 'op':
            bg = 'O+';
            break;
        case 'ap':
            bg = 'A+';
            break;
        case 'bp':
            bg = 'B+';
            break;
        case 'abp':
            bg = 'AB+';
            break;
        case 'on':
            bg = 'O-';
            break;
        case 'an':
            bg = 'A-';
            break;
        case 'bn':
            bg = 'B-';
            break;
        case 'abn':
            bg = 'AB-';
            break;

    }
    connection.query('SELECT * FROM patients WHERE address LIKE ? AND bloodGroup=? AND date<=?',[place,bg,myDate],(err,rows)=>{
        if(err){
            console.log(err);
        }
        else if(rows.length == 0){
            res.render('../recevingPage.ejs',{records: rows});
        }
        else{
            rows.forEach((record)=>{
                record.date = record.date.toString().substring(0,15);
            });
            res.render('../recevingPage.ejs',{records: rows});
        }
    });
});

module.exports = receivingRouter;