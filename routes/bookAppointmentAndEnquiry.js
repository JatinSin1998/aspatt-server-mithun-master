import express, { Router } from "express";
import {
  addBookAppoinment,
  getBookAppoinment,
  getSingelBookAppoinment,
  updateBookAppoinment,
  updateStatusBookAppoinment,
} from "../controllers/bookAppontment.js";
import middleware from "../middlewares/index.js";
import {
  addEnquiry,
  getAllEnquiry,
  updateStatusEnquiry,
} from "../controllers/enquiry.js";

const router = express.Router();

///////////////////////  Book appoinment and Enqury  ////////////////////////

router.post("/bookappoinment", addBookAppoinment);
router.post("/enqury", addEnquiry);

///////////////////////  Admin CRUD  With Bookappoinment and Enqury ////////////////////////
// Book Appoinment CRUD
router.get("/admin/bookappoinment", middleware, getBookAppoinment);
router.get("/admin/bookappoinment/:id", middleware, getSingelBookAppoinment);
router.patch(
  "/admin/bookappoinment/:id/status",
  middleware,
  updateStatusBookAppoinment
);
router.patch("/admin/bookappoinment/:id", middleware, updateBookAppoinment);

// ENQURY CRUD
router.get("/admin/enquiry", middleware, getAllEnquiry);
router.patch("/admin/enquiry/:id/status", middleware, updateStatusEnquiry);

export default router;
