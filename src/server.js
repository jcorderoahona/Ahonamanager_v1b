const express = require('express');
const session = require('express-session');
const app = express();
const path = require("path");
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {authUser} = require('./helpers/auth');
const {authRole} = require('./helpers/auth');
//import routes 
const indexRoute = require('./routes/index');
const orderRoute = require('./routes/order');
const historialRoute = require('./routes/historial');
const displayRoute = require('./routes/display');
const productRoute = require('./routes/addproduct');
const loginRoute = require('./routes/login');

//express settings
app.set('port', process.env.PORT || 3000);
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));


//middlewares
app.use(morgan('dev'));
app.use(cookieParser());
//app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'test',
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//routes
app.use('/home',authUser,indexRoute);
app.use('/order',authUser, orderRoute);
app.use('/historial',authUser, historialRoute);
app.use('/display',authUser, displayRoute);
app.use('/addproduct',authUser,authRole("Admin"), productRoute);
app.use('/',loginRoute);

//static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
//server start
app.listen(app.get('port'),() => { 
    console.log('Server port: 3000'); 
});