const path=require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('./database/database');
const receivingRouter = require('./routes/receivingRouter');
const uploadingRouter = require('./routes/uploadingRouter');
const adminRouter = require('./routes/adminRouter');

const connection = mysql.mysqlConnection;
//mysql.tableCreation();
//mysql.addAdmin();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use('/getData', receivingRouter);
app.use('/putData', uploadingRouter);
app.use('/admin', adminRouter);

app.get('/', (req,res,next)=>{

	res.render('../homepage.ejs');

});

app.listen(port, () => {

	console.log(`Server running in PORT ${port}`);

});

setInterval(()=> {
	let date= new Date();
    let day = date.getDate()-42;
    date.setDate(day); 
    
    let myDate = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
	connection.query('DELETE FROM patients WHERE date<=?',[myDate],(err,rows)=>{
		if(err){
			console.log(err);
		}
	});
}, 86400000);