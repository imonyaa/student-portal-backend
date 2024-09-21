import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
    unique: true,
  },
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
  role: {
    type: String,
    enum: ["student", "teacher"],
    required: true,
  },
  academicLevel: {
    type: String,
    enum: ["Licence", "Master"],
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
    enum: ["Control", "Computer Engineering", "Power", "Telecommunications"],
    required: function () {
      return this.role === "student" && this.academicLevel === "Master";
    },
  },
  group: {
    type: Number,
    required: function () {
      return this.role === "student";
    },
  },
  profileImage: {
    type: String,
    default:
      "https://as2.ftcdn.net/v2/jpg/04/10/43/77/1000_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg",
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
