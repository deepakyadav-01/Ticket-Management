import mongoose from "mongoose";
import { hashPassword } from "../helpers/passwordHelper.js";
import { AUTH_MESSAGES } from "../constants/messages.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, AUTH_MESSAGES.NAME_REQUIRED],
    },
    email: {
      type: String,
      required: [true, AUTH_MESSAGES.EMAIL_REQUIRED],
      unique: true,
      lowercase: true,
      // Validate email format using a regular expression
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: AUTH_MESSAGES.INVALID_EMAIL,
      },
    },
    password: {
      type: String,
      required: [true, AUTH_MESSAGES.PASSWORD_REQUIRED],
      minlength: [8, AUTH_MESSAGES.PASSWORD_TOO_SHORT],
    },
  },
  { timestamps: true }
);

// Middleware to hash password before saving to the database
userSchema.pre("save", async function (next) {
  // Check if password is being modified (e.g., during registration or password change)
  if (!this.isModified("password")) return next(); // Skip hashing if password is not modified
  // Hash the password using the hashPassword helper function
  this.password = await hashPassword(this.password);
  next(); // Proceed with saving the user
});

export default mongoose.model("User", userSchema);
