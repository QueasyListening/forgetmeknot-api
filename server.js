const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const userRouter = require('./routers/userRouter');

//const config = require('./config');

mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/forget-me-knot', {useNewUrlParser: true})
        .then(() => {
            console.log('Connected to DB');
        })
        .catch(() => {
            console.log('Failed to connect to DB');
        });

const server = express();

// use middleware
server.use(express.json());
server.use(helmet());
server.use(cors({
    origin: process.env.CLIENTURL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
  }));
server.options('*', cors({
    origin: process.env.CLIENTURL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
  }));

server.use(
    session({
      secret: process.env.SESSION_SECRET || 'developmentsecret',
      cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
      secure: false,
      httpOnly: true,
      name: 'forget-me-knot-sessions',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 1000 * 60 * 60 * 24
      })
    })
  );

  server.get('/', (req, res) => {
      res.json({ 'Forget me knot api': 'running'})
  });

  server.use('/user', userRouter);

  server.listen(process.env.PORT || 5000, () => {
      console.log(`API running on port ${process.env.PORT || '5000'}`);
  });
