var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var multiparty= require('connect-multiparty');
var multipartMiddleware=multiparty();
var jwt = require('jwt-simple');
var config = require('./config/database');
var user = require('./app/models/account');
var pics = require('./datasets/pics'); 
var reviews = require('./datasets/reviews'); 

var viewController=require('./controllers/viewController');
var shareController=require('./controllers/shareController');
var reviewController=require('./controllers/reviewController');

var fs = require('fs');
var cloudinary= require('cloudinary');
var configs = require('./configs/config.js');
process.env.GLOBAL_PATH= __dirname;
configs.setConfigs();
var cors=require('cors');
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
var server = require('http').createServer(handler)
//mongoose connection
if(env=='development')
{
mongoose.connect('mongodb://localhost/traveldb');
}
else{
mongoose.connect('mongodb://asad:maidaaaa1@ds161162.mlab.com:61162/heroku_54txt9cj');
}
var env=process.env.NODE_ENV=process.env.NODE_ENV||'development';

//passport Configuration
var io = require('socket.io')(server);
require('./config/passport')(passport);
var port = app.listen(8080, function () {
    console.log('listening on *:8080');
});
function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

//routes

var apiRoutes= express.Router();
app.get('/getNewPhoto', viewController.getNewPhoto);
app.post('/mobileShare', shareController.submitMobilePhoto);
apiRoutes.post('/signup', function(req,res){
    if(!req.body.email || !req.body.password|| !req.body.dob||!req.body.name)
    {
        res.json({success:false, msg:'Please Enter the Complete Details'});

    }
    else{
        var newUser= new user({
            name: req.body.name,
            email: req.body.email,
            dob: req.body.dob,
            password:req.body.password

        });
        newUser.save(function(err){
            if (err) 
            {
                return res.json({ success: false, msg: 'Email Already Exist '+ err});
            }
            else 
            {
                res.json({ success: true, msg: 'Successful created' });
            }


        });
    }
});
apiRoutes.get('/usersList', function (req, res) {
  
    user.find({})
    .limit(20)
    .exec(function(err, users){
        if(err)
        {
            res.send(500).end();
        
        }
        else
        {
            res.json(users);
        }
    })
});
apiRoutes.post('/openFilePicker', function (req, res) {
   var imageBuff= new Buffer(req.body.imageUri, 'base64');
    fs.writeFile('./tmp/picture.jpg',imageBuff,function(err){
        if(err)
        {
            console.log('Error Found',err);
        }
        else
        {

            var fileName= process.env.GLOBAL_PATH+'/tmp/picture.png';
            cloudinary.uploader.upload(fileName, function(response)
            {
                var picture=new pics();
                picture.name= req.body.name;
                picture.description=req.body.description;
                picture.url=response.secure_url;
                console.log('Image secure_url is' + res.secure_url);
                picture.save();
                res.status(200).end();
                console.log('This the response '+ response);
            });
        }
    });
});
apiRoutes.post('/authenticate', function (req, res) {
    user.findOne({
        email: req.body.email
    }, function (err, user1) {
        if (err)
            throw err;
        if(!user1)
        {
            res.send({ success: false, msg: 'Authentication Failed' });

        }
        else {
            user1.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    var token = jwt.encode(user1, 'helloworld');
                    res.json({ success: true, token: 'JWT' + token });

                }
                else {
                    res.send({ success: false, msg: 'Authentication Failed Wrong Password' });
                }
            });
        }
    });
});
apiRoutes.get('/memberinfo', passport.authenticate('jwt', { session: false }), function (req, res) {
    var token = getToken(req.headers);
    if(token)
    {
        var decoded = jwt.decoded(token, 'helloworld');
        user.findOne({
            email: decoded.email
        }, function (err, user1) {
            if (err) throw err;
            if (!user1) {
                return res.status(403).send({ success: false, msg: 'Authentication failed' });

            }
            else
            {
                res.json({ success: true, msg: 'Welcome to Home Page'+ user1.email });
            }
        });
    }
    else {
        return res.status(403).send({ success: false, msg: 'No token provided' });
    }
});
apiRoutes.post('/addingReview', function(req,res){
    var newUser= new reviews({
            description: req.body.description,
            rate:req.body.rate
        });
        newUser.save(function(err){
            if (err) 
            {
                return res.json({ success: false, msg: ' '+ err});
            }
            else 
            {
                res.json({ success: true, msg: 'Successful created' });
            }


        });
});
getToken = function (headers) {
    if (headers && headers.autherization) {
        var parted = headers.autherization.split(' ');
        if(parted.length===2)
        {
            return parted[1];

        }
        else
        {
            return null;
        }
        
    }
    else {
        return null;
    }
};


app.use(function (req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
if (req.method === 'OPTIONS') {
res.end();
} else {
next();
}
});
app.use('/api',apiRoutes);
app.get('/', function (req, res) {
    res.send('Hello! Localhost is working at  8080 ');
});
// Start the server
//app.listen(port);
