import enquiry from "../models/enquiry.js";
import { sendEmail } from "../utils/sendMail.js";

// @desc    Post  Enquiry
// @route   POST/api/v1/enquiry
// @access  Public
///////////////////////// Mail Content Body /////////////////////////////////
const generateEmailBody = async (enquiry) => {
  return `
    <h1>Enquiry Details</h1>    
    <ul>
      <li><strong>Patient Name:</strong> ${enquiry.fullName}</li>
      <li><strong>Email:</strong> ${enquiry.email}</li>
      <li><strong>Phone Number:</strong> ${enquiry.phoneNumber}</li>
      <li><strong>Description:</strong> ${enquiry.description}</li>
    </ul>
    <p>Best regards,</p>
    <p>Your Healthcare Team</p>
  `;
};

export const addEnquiry = async (req, res) => {
  try {
    console.log(req.body, "req.bodyreq.body");

    // Create a new appointment document
    const newEquiry = new enquiry(req.body);

    // Save the appointment to the database
    const savedAppointment = await newEquiry.save();

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

// @desc    GET  Enquiry
// @route   GET/api/v1/admin/enquiry
// @access  ADMIN
export const getAllEnquiry = async (req, res) => {
  try {
    // Fetch all appointments and sort them by status
    const appointments = await enquiry.aggregate([
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

// @desc    PATCH  Change Status Enquiry appoinment
// @route   PATCH/api/v1/admin/enquiry/:id/status
// @access  ADMIN
export const updateStatusEnquiry = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  // Validate status
  if (!["COMPLETED", "REJECTED", "PENDING"].includes(status)) {
    return res.status(400).json({
      message: 'Invalid status. Must be either "COMPLETED" or "REJECTED".',
    });
  }
  try {
    const enquiryStatus = await enquiry.findByIdAndUpdate(
      id,
      {
        appoinmentStatus: status,
      },
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({ message: "Appointment not found." });
    }
    res
      .status(200)
      .json({ message: "Update Status Sucessfully.", enquiryStatus });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error while updating appointment status." });
  }
};
