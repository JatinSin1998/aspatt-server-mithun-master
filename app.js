import "./env.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import api from "./routes/index.js";
import apiBookAppoinmentAndEnquiry from "./routes/bookAppointmentAndEnquiry.js";
const app = express();

// const uri = `mongodb://${USER_NAME}:${PASSWORD}@cluster0-shard-00-00.kmfwq.mongodb.net:27017,cluster0-shard-00-01.kmfwq.mongodb.net:27017,cluster0-shard-00-02.kmfwq.mongodb.net:27017/MedCare?ssl=true&replicaSet=atlas-a9v4hk-shard-0&authSource=admin&retryWrites=true&w=majority`;

//use the following uri when running local MongoDB server

const uri = process.env.MONGODBURL;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.use(express.static("public"));

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "public/index.html");
});

app.use("/api", api);
// Book appoinment And Enquiry api
app.use("/api/v1", apiBookAppoinmentAndEnquiry);

const port = process.env.PORT || 27017;

app.listen(port, function () {
  console.log("Server started on port: ", port);
});
