const express = require('express');
const path = require('path');
const cookieParser=require('cookie-parser');
const session=require('express-session');
const mongoose=require('mongoose');
const passport=require('passport');
const MongoStore=require('connect-mongo')(session); 
const body_parser=require('body-parser');

const spawn = require("child_process").spawn;
const app = express();
mongoose.connect('mongodb://mohankukreja1:novice123@ds125945.mlab.com:25945/novice_database',{ useNewUrlParser: true }, function(err, db) {
    if (err) {
        console.log('Unable to connect to the server. Please start the server. Error:', err);
    } else {
        console.log('Connected to DB successfully!');
    }
},);

app.use(session({
    secret:'mysecretsessionkey',
    resave:true,
    saveUninitialized:true,
    store: new MongoStore({mongooseConnection : mongoose.connection })
}));
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());
app.use(body_parser.urlencoded({extended:true}));
app.use(body_parser.json());
var main = require('./controller/user');
app.use('/', main);
app.post('/test',function(req,res){
    //console.log(req);
    const pythonProcess = spawn('python',["script.py", req.body.first, req.body.second]);

    pythonProcess.stdout.on('data', (data) => {
        // Do something with the data returned from python script
        console.log(data.toString());
    });
})


app.listen('4000',function(req,res){
    console.log('server started');
})
