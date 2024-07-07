const express = require("express");
const userTokenCollection = require("../models/userToken");
const userCollection = require("../models/user");
const bycrypt = require("bcrypt");
const { v4 } = require('uuid')
const jwt = require('jsonwebtoken')

const authRoutes = express.Router();


authRoutes.post("/register-user", async (req, res) => {
  const userDetails = req.body;

  const hashedPassword = bycrypt.hashSync(userDetails.password, 10);

  await userCollection.create({
    fullName: userDetails.fullName,
    email: userDetails.email,
    password: hashedPassword,
  });

  res.status(201).send({
    message: "User added successfully",
  });
});

authRoutes.post("/login-user", async (req, res) => {
  const { email, password} = req.body;

  const user = await userCollection.findOne({email})

  if(!user){
    res.send({
      isSuccessful : false,
      message: "User doesn't exist"
    });
    return;
  }

  const doPasswordMatch = bycrypt.compareSync(password, user.password);

  if (!doPasswordMatch) {
    res.status(400).send({
      isSuccessful: false,
      message: "Password Incorrect",
    });
    return;
  }

  const userToken = jwt.sign({
    userId: user._id,
    email: user.email
  }, process.env.AUTH_KEY);

  res.status(201).send({
    isSuccessful: true,
    userDetails: {
      fullName: user.fullName,
      email: user.email,
    },
    userToken,
    message: "Logged in succesfully",
  });
});

authRoutes.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  // const userEmail = req.body.email;
  console.log("email that forgot password", email);
  const token = v4()

  const user = await userCollection.findOne({email});

  if (!user) {
    res.send({
      isSuccessful: false,
      message: "User doesn't exist"
    });
    return;
  }

  await userTokenCollection.create({
    userId: user._id,
    reset_PasswordToken: token
  });

  console.log("user token collection", userTokenCollection);



  res.status(201).send({
    reset_PasswordToken: token,
    message: "Reset Password token sent"
  });
});

authRoutes.post("/reset-password", async (req, res) => {
  const { reset_PasswordToken, password } = req.body;
  console.log("unique Id collection", reset_PasswordToken, password);

  const userTokenCredential = await userTokenCollection.findOne({reset_PasswordToken});

  if (!userTokenCredential) {
    res.send({
      isSuccessful: false,
      message: "Invalid details",
    });
    return;
  }

  const user = await userCollection.findById(userTokenCredential.userId);
  const hashedPassword = bycrypt.hashSync(password, 10);

  await userCollection.findByIdAndUpdate(user._id,{
      password : hashedPassword
  }) 

  await userTokenCollection.findOneAndDelete({reset_PasswordToken});

  res.send({
    message: "Password Changed"
  })
});

module.exports = authRoutes;
