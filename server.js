// Imports
const express = require('express');
const webRoutes = require('./routes/web');

// Session imports
let cookieParser = require('cookie-parser');
let session = require('express-session');
let flash = require('express-flash');
let passport = require('passport');

const axios = require('axios');

// Express app creation
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// Configurations
const appConfig = require('./configs/app');

// View engine configs
const exphbs = require('express-handlebars');
const hbshelpers = require("handlebars-helpers");
const multihelpers = hbshelpers();
const extNameHbs = 'hbs';
const hbs = exphbs.create({
  extname: extNameHbs,
  helpers: multihelpers
});
app.engine(extNameHbs, hbs.engine);
app.set('view engine', extNameHbs);

// Session configurations
let sessionStore = new session.MemoryStore;
app.use(cookieParser());
app.use(session({
  cookie: { maxAge: 60000 },
  store: sessionStore,
  saveUninitialized: true,
  resave: 'true',
  secret: appConfig.secret
}));
app.use(flash());

// Passport configurations
require('./configs/passport');
app.use(passport.initialize());
app.use(passport.session());

// Receive parameters from the Form requests
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/', express.static(__dirname + '/public'))
app.use('/', webRoutes);

let player_names = []
let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']


io.on('connection', (socket) => {
  axios.get("http://names.drycodes.com/1?nameOptions=starwarsFirstNames")
  .then((response) => {
    //console.log("axios response: ", response.data);
    var player = response.data[0];
      player_names.push(player);
      socket.emit('init', {player : player, player_names : player_names});
      socket.broadcast.emit('player added', {player_names : player_names});
    });

    socket.on('play', () => {
      letter = letters[Math.floor((Math.random() * 26))];
      socket.emit('play', {letter : letter});
      socket.broadcast.emit('play', {letter : letter});
      console.log(letter);
    });

    socket.on('end', () => {
      socket.emit('gradeAnswers', {letter : letter});
      socket.broadcast.emit('gradeAnswers', {letter : letter});
    })

    socket.on('res', () => {
      socket.emit('getres', {letter : letter});
      socket.broadcast.emit('getres', {letter : letter});
    })

})

// App init
server.listen(appConfig.expressPort, () => {
  console.log(`Server is listenning on ${appConfig.expressPort}! (http://localhost:${appConfig.expressPort})`);
});
