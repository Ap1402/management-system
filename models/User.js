const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"]
    },
    contact: [
      {
        phoneNumber: {
          type: String
        }
      }
    ],
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, "password is required"]
    },
    role: {
      type: String,
      default: "patient",
      enum: ["doctor", "admin", "patient"],
      required: [true, "role is required"]
    },
    active: {
      type: Boolean,
      default: true
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ]
  },
  { timestamps: true }
);

// Hash plain text password before saving or updating
UserSchema.pre("save", async function(next) {
  const user = this;

  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }

  next();
});

UserSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ user: { id: user.id } }, config.get("jwtSecret"), {
    expiresIn: 3600
  });
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

module.exports = User = mongoose.model("user", UserSchema);
