import mongoose from "mongoose";

const bookappointmentSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: [true, "Please add a patient name"],
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
  appoinmentDate: {
    type: Date,
    required: [true, "Please add an appoinment date"],
  },
  hospitalName: String,
  doctorName: String,
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

export default mongoose.model("Bookappointment", bookappointmentSchema);
