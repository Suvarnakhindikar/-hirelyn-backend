const express = require("express");

const router = express.Router();

const {
  updateApplicationStatus,getMyApplications,
} = require("../controllers/applicationController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.patch(
  "/:applicationId/status",
  protect,
  authorizeRoles("recruiter"),
  updateApplicationStatus
);
router.get(
  "/my",
  protect,
  authorizeRoles("job_seeker"),
  getMyApplications
);
module.exports = router;