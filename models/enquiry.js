import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please add a Full Name"],
  },
  email: {
    type: String,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please add a valid email",
    ],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please add a phone number"],
    match: [
      /^\+?[1-9]\d{1,14}$/, // E.164 format (international)
      "Please add a valid phone number in E.164 format",
    ],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
  },
  appoinmentStatus: {
    type: String,
    enum: ["PENDING", "COMPLETED", "REJECTED"],
    default: "PENDING",
  },
});

export default mongoose.model("Enquiry", enquirySchema);
