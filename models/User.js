import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  role: {
    type: String,
    enum: ["student", "teacher"],
    required: true,
  },
  academicLevel: {
    type: String,
    enum: ["bachelor", "master"],
    required: function () {
      return this.role === "student";
    },
  },
  academicYear: {
    type: Number,
    required: function () {
      return this.role === "student";
    },
  },
  major: {
    type: String,
    enum: ["control", "computer", "power", "telecom"],
    required: function () {
      return this.role === "student" && this.academicLevel === "master";
    },
  },
  group: {
    type: Number,
    required: function () {
      return this.role === "student";
    },
  },
});

// Password hashing
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password comparison
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);

export default User;