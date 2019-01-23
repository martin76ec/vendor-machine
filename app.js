/*
 *
 *   _____     _        _____
 *  |     |___|_|___   |  _  |___ ___
 *  | | | | .'| |   |  |     | . | . |
 *  |_|_|_|__,|_|_|_|  |__|__|  _|  _|
 *                           |_| |_|
 *                       Version 0.0.1
 *
 *  Larrea  Martín <mlarreaa@est.ups.edu.ec>
 *
 */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var machineRouter = require('./routes/machine');

var app = express();

//Socket IO
var server = app.listen(3001);
var io = require('socket.io').listen(server);

//Johnny Five START
var five = require("johnny-five"),
    board, lcd, button_1, button_2, button_3, button_4, button_5, button_6;
board = new five.Board();
var counter = 0;

board.on("ready", function() {
  /*-- LCD --*/
  lcd = new five.LCD({
    pins: [7, 8, 9, 10, 11, 12],
    backlight: 6,
    rows: 2,
    cols: 20
  });

  /*-- BUTTONS --*/
  button_1 = new five.Button(13);
  button_2 = new five.Button(6);
  button_3 = new five.Button(5);
  button_4 = new five.Button(4);
  button_5 = new five.Button(3);
  button_6 = new five.Button(2);

  /*-- INJECT OBJECTS --*/
  this.repl.inject({
    lcd: lcd,
    button_1: button_1,
    button_2: button_2,
    button_3: button_3,
    button_4: button_4,
    button_5: button_5,
    button_6: button_6
  });

  /*-- EVENT HANDLERS --*/
  button_1.on("down", function(){
    io.emit('addMoney', "1cent");
  });
  button_2.on("down", function(){
    io.emit('addMoney', "10cent");
  });
  button_3.on("down", function(){
    io.emit('addMoney', "25cent");
  });
  button_4.on("down", function(){
    io.emit('addMoney', "50cent");
  });
  button_5.on("down", function(){
    io.emit('addMoney', "1dolarcent");
  });
  button_6.on("down", function(){
    io.emit('cancel');
  });
});
//Johnny Five END

//LCD Write Function
function writeLCD(message){
  lcd.clear().print(message);
}

// Socket IO Listener
app.get('/Lcd', function (req, res) {
  lcd.clear().print(req.query.string);
})

io.on('connection', function(socket){
  socket.on('message', function(msg){
    writeLCD(msg);
  });
});

// TEST
var stateQ0 = require('./routes/test.js');
app.get('/State', function (req, res) {
  res.send(stateQ0.listen(req.query.entry, req.query.objectClass, req.query.total));
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/machine', machineRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;



