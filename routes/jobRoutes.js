const express = require("express");

const router = express.Router();

const {
  createJob,
  getAllJobs,
  getJobById,
  applyForJob,
  getJobApplications,
  updateJob,
  deleteJob,
  getMyJobs,
  updateJobStatus,
} = require("../controllers/jobController");
    
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const validateJob = require("../middleware/jobValidation");
const validateObjectId = require("../middleware/validateObjectId");

// Create job - recruiter only
router.post(
  "/",
  protect,
  authorizeRoles("recruiter"),
  validateJob,
  createJob
);

// Get all jobs - public
router.get("/", getAllJobs);

// Get recruiter's jobs
router.get(
  "/my",
  protect,
  authorizeRoles("recruiter"),
  getMyJobs
);

// Update job status
router.patch(
  "/:id/status",
  protect,
  authorizeRoles("recruiter"),
  validateObjectId("id"),
  updateJobStatus
);

// Get one job - public
router.get(
  "/:id",
  validateObjectId("id"),
  getJobById
);

// Apply for job - job seeker only
router.post(
  "/:jobId/apply",
  protect,
  authorizeRoles("job_seeker"),
  validateObjectId("jobId"),
  applyForJob
);

// Get applications for a job - recruiter only
router.get(
  "/:jobId/applications",
  protect,
  authorizeRoles("recruiter"),
  validateObjectId("jobId"),
  getJobApplications
);

// Update job - recruiter only
router.put(
  "/:id",
  protect,
  authorizeRoles("recruiter"),
  validateObjectId("id"),
  updateJob
);

// Delete job - recruiter only
router.delete(
  "/:id",
  protect,
  authorizeRoles("recruiter"),
  validateObjectId("id"),
  deleteJob
);

module.exports = router;