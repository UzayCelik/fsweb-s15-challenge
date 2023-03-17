const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const restrict = require('./middleware/restricted.js');

const authRouter = require('./auth/auth-router.js');
const bilmecelerRouter = require('./bilmeceler/bilmeceler-router.js');
const { logger } = require('./logger/logger.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use(logger);
server.use('/api/auth', authRouter);
server.use('/api/bilmeceler', restrict, bilmecelerRouter); // sadece giriş yapan kullanıcılar erişebilir!

server.get("/",(req,res)=>{
  res.status(200).json({
    message:"Server Get Deneme"
  })
})

server.use("*",(req, res) => {
    res.status(404).json({
      message:"Oops Sayfa Yok"
    })
});

server.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      message: err.message,
      stack: err.stack,
    });
});

module.exports = server;
