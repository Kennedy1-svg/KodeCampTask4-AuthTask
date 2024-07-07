const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
const authRoutes = require("./routesAndcontrollers/authRoutes");
const userProfileRoutes = require("./routesAndcontrollers/userProfileRoutes");
require('dotenv').config();

const server = express();

server.use(express.json());

server.use(express.urlencoded({extended: false}));

server.use(logger("dev"));

const connection = mongoose.connect(process.env.MONGODB_URL)

connection.then( () => {
  console.log('Connection succesful')
}).catch((error) => {
  console.log('Connection not successful', error)
})


server.use("/users", authRoutes)
server.use("/user", userProfileRoutes);

server.listen(process.env.PORT, function () {
  console.log("Server is up");
});
