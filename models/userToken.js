const { timeStamp } = require("console");
const { Schema, model } = require("mongoose");

const userTokenSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    reset_PasswordToken: {
      type: String,
      required: true,
    },
    authPurpose: {
      type: String,
    },
  },
  { timestamps: true }
);

const userTokenModel = model("usertoken", userTokenSchema);

module.exports = userTokenModel;
