import appointmentBooking from "../models/bookAppontment.js";
import { sendEmail } from "../utils/sendMail.js";

// @desc    Post  BookAppoinment
// @route   POST/api/v1/bookappoinment
// @access  Public
///////////////////////// Mail Content Body /////////////////////////////////
const generateEmailBody = async (appointment) => {
  return `
    <h1>Appointment Details</h1>    
    <ul>
      <li><strong>Patient Name:</strong> ${appointment.patientName}</li>
      <li><strong>Email:</strong> ${appointment.email}</li>
      <li><strong>Phone Number:</strong> ${appointment.phoneNumber}</li>
      <li><strong>Appointment Date:</strong> ${
        new Date(appointment.appoinmentDate).toLocaleDateString() ||
        "Not provided"
      }</li>
      <li><strong>Hospital Name:</strong> ${
        appointment.hospitalName || "Not provided"
      }</li>
      <li><strong>Doctor Name:</strong> ${
        appointment.doctorName || "Not provided"
      }</li>
      <li><strong>Description:</strong> ${appointment.description}</li>
    </ul>
    <p>Best regards,</p>
    <p>Your Healthcare Team</p>
  `;
};

export const addBookAppoinment = async (req, res) => {
  try {
    console.log(req.body, "req.bodyreq.body");

    // Create a new appointment document
    const newAppointment = new appointmentBooking(req.body);

    // Save the appointment to the database
    const savedAppointment = await newAppointment.save();

    const body = await generateEmailBody(req.body);
    const subject = "Book An Appointment";
    const adminEmail = process.env.ADMIN_EMAIL;
    await sendEmail(adminEmail, subject, body);

    // Send a success response
    res.status(201).json(savedAppointment);
  } catch (error) {
    // Send an error response if validation fails
    res.status(400).json({ message: error.message });
  }
};

////////////////////////////// Admin /////////////////////////////////////////////

// @desc    GET  BookAppoinment
// @route   GET/api/v1/admin/bookappoinment
// @access  ADMIN
export const getBookAppoinment = async (req, res) => {
  try {
    // Fetch all appointments and sort them by status
    const appointments = await appointmentBooking.aggregate([
      {
        $addFields: {
          sortOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$appoinmentStatus", "PENDING"] }, then: 1 },
                { case: { $eq: ["$appoinmentStatus", "COMPLETED"] }, then: 2 },
                { case: { $eq: ["$appoinmentStatus", "REJECTED"] }, then: 3 },
              ],
              default: 4,
            },
          },
        },
      },
      { $sort: { sortOrder: 1 } }, // Sort by the custom field we added
      { $project: { sortOrder: 0 } }, // Remove sortOrder from the result
    ]);

    res.status(200).json(appointments);
  } catch (error) {
    // Send an error response if validation fails
    res.status(400).json({ message: error.message });
  }
};

// @desc    PATCH  Change Status Book appoinment
// @route   PATCH/api/v1/admin/bookappoinment/:id/status
// @access  ADMIN
export const updateStatusBookAppoinment = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  // Validate status
  if (!["COMPLETED", "REJECTED", "PENDING"].includes(status)) {
    return res.status(400).json({
      message: 'Invalid status. Must be either "COMPLETED" or "REJECTED".',
    });
  }
  try {
    const appoinment = await appointmentBooking.findByIdAndUpdate(
      id,
      {
        appoinmentStatus: status,
      },
      { new: true }
    );

    if (!appoinment) {
      return res.status(404).json({ message: "Appointment not found." });
    }
    res.status(200).json({ message: "Update Status Sucessfully.", appoinment });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error while updating appointment status." });
  }
};

// @desc    PATCH  Change Status Book appoinment
// @route   PATCH/api/v1/admin/bookappoinment/:id
// @access  ADMIN
export const updateBookAppoinment = async (req, res) => {
  const { id } = req.params;
  const {
    patientName,
    email,
    phoneNumber,
    appoinmentDate,
    hospitalName,
    doctorName,
    description,
  } = req.body;

  try {
    const updatedAppointment = await appointmentBooking.findByIdAndUpdate(
      id,
      {
        patientName,
        email,
        phoneNumber,
        appoinmentDate,
        hospitalName,
        doctorName,
        description,
      },
      { new: true, runValidators: true } // Return the updated document and apply validators
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res
      .status(200)
      .json({ updatedAppointment, message: "Appointment Update Sucessfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error while updating appointment details." });
  }
};

// @desc    GET  Change Status Book appoinment
// @route   GET/api/v1/admin/bookappoinment/:id
// @access  ADMIN
export const getSingelBookAppoinment = async (req, res) => {
  const { id } = req.params;
  try {
    const appoinment = await appointmentBooking.findById(id);
    if (!appoinment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    res.status(200).json(appoinment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};
