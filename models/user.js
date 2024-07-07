const { timeStamp } = require('console');
const {Schema, model} = require('mongoose')

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    authToken: {
      type: String,
    },
    authPurpose: {
      type: String,
    },
  },
  { timestamps: true }
);

const userModel = model("userlist", userSchema);

module.exports = userModel;
