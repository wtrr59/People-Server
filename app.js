// ENV
require('dotenv').config();
// DEPENDENCIES
const tf = require('@tensorflow/tfjs');
const tmPose = require('@teachablemachine/pose');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = require('express')();
var server = require('http').createServer(app);
var socketio = require('socket.io')(server);

const port = process.env.PORT || 80;

// Body-parser
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


// Node의 native Promise 사용
mongoose.Promise = global.Promise;


// Connect to MongoDB
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useFindAndModify:true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(e => console.error(e));


// ROUTERS
/*app.use('/contacts', require('./routes/contacts'));
app.use('/images', require('./routes/images'));
app.use('/gatherings', require('./routes/gatherings'));*/
app.use('/users', require('./routes/users'));
app.use('/chats', require('./routes/chats'));



const serv = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  evaluate().catch(e => console.error(e));
});

io = socketio.listen(serv);

io.on('connection', function(socket){
  console.log('Socket ID : ' + socket.id + ', Connect');
  socket.on('clientMessage', function(data){
    console.log('Client Message : ' + data);

    var message = { 
      msg : 'server',
      data : 'refresh'
    };
    io.sockets.emit('serverMessage', message);
  });
});

async function evaluate(){
  const t_model = await tmPose.load('https://teachablemachine.withgoogle.com/models/eI8StPan/model.json','https://teachablemachine.withgoogle.com/models/eI8StPan/metadata.json');
  console.log(t_model.getTotalClasses);
}

