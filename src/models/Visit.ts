import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
  {
    ip: String,
    page: String,
  },
  { timestamps: true }
);

export default mongoose.model("Visit", visitSchema);
