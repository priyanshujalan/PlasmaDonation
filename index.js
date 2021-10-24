const path=require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('./database/database');
const receivingRouter = require('./routes/receivingRouter');
const uploadingRouter = require('./routes/uploadingRouter');
const adminRouter = require('./routes/adminRouter');

const connection = mysql.mysqlPool;
//mysql.tableCreation();
mysql.addAdmin();

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
	connection.getConnection((err, connector) => {
		if(err)
			console.log(err)
		else{
			let delQuery = 'DELETE FROM donars WHERE date<=?';
			let query = mysql.format(delQuery,[myDate]);
			connector.query(query, (err, rows)=>{
				connector.release();
				if(err)
					console.log(err);
				else
					console.log('Deleted the Non-Valid Donars for Today!');
			});
		}
	});
}, 86400000);