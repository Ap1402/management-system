const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const ErrorHandler = require("../helpers/ErrorHandler");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [false, "Name is required"],
    },
    dni: {
      type: String,
      required: [false, "A DNI is required"],
    },
    lastName: {
      type: String,
      required: [false, "Lastname is required"],
    },
    contact: [
      {
        phoneNumber: {
          type: String,
        },
      },
    ],
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    role: {
      type: String,
      default: "patient",
      enum: ["doctor", "admin", "patient"],
      required: [true, "role is required"],
    },
    active: {
      type: Boolean,
      default: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

UserSchema.set("toObject", { virtuals: true });
UserSchema.set("toJSON", { virtuals: true });

// Hash plain text password before saving or updating
UserSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
  next();
});

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ user: { id: user.id } }, config.get("jwtSecret"));
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

UserSchema.virtual("fullname").get(function () {
  const user = this;
  return user.firstName + " " + user.lastName;
});

module.exports = User = mongoose.model("user", UserSchema);
