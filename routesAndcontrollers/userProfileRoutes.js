const express = require("express");
const userCollection = require("../models/user");
const { v4 } = require("uuid");
const jwt = require("jsonwebtoken");

const profileRoute = express.Router();

function checkLoggedInUser(req, res, next){
    const authToken = req.headers.authorization.split(" ")
    const strategy = authToken[0]
    const profileToken = authToken[1]

    if (!authToken) {
        res.status(403).send({
            message: "Invalid token"
        })
    }

    if(strategy == 'Bearer'){
        const userDetails = jwt.verify(profileToken, process.env.AUTH_KEY);
        req.userDetails = userDetails;
        console.log('user details', req.userDetails)
        next();
    } else {
        res.status(403).send({
            message: 'Invalid auth strategy!'
        })
    }

}

profileRoute.use(checkLoggedInUser);

profileRoute.get("/user-profile", async (req, res) => {
    const user = await userCollection.findById(req.userDetails.userId);
  
  res.status(201).send({
    userProfile: {
      fullName: user.fullName,
      email: user.email,
    },
  });
});



module.exports = profileRoute;
