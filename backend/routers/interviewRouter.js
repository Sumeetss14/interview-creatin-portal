const express = require("express");
const authController = require("../controllers/authController")
const interviewController = require("../controllers/interviewController")

const router = express.Router();

router.route("/").post(authController.authenticate, authController.protect("admin"), interviewController.createInterview).get(authController.authenticate, authController.protect("admin"), interviewController.getAllIncomingInterviews).patch(authController.authenticate, authController.protect("admin"), interviewController.updateInterview);
router.route("/:interviewId").get(interviewController.getInterview)
module.exports = router;