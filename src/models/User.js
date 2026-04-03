import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["viewer", "analyst", "admin"],
    default: "viewer",
  },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});

export default mongoose.model("User", UserSchema);
