const Job = require("../models/Job");

const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      company,
      location,
      salary,
      jobType,
      skills,
      experience,
    } = req.body;

    if (
      !title ||
      !description ||
      !company ||
      !location ||
      salary === undefined ||
      !jobType ||
      !skills ||
      !experience
    ) {
      return res.status(400).json({
        success: false,
        message: "All job fields are required",
      });
    }

    const job = await Job.create({
      title,
      description,
      company,
      location,
      salary,
      jobType,
      skills,
      experience,
      postedBy: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create job",
      error: error.message,
    });
  }
};
const getAllJobs = async (req, res) => {
  try {
    const {
      search,
      location,
      jobType,
      minSalary,
      maxSalary,
      page = 1,
      limit = 10,
      sort = "-createdAt",
    } = req.query;

    const query = {};

    // Search by title, company or skills
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { skills: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by location
    if (location) {
      query.location = {
        $regex: location,
        $options: "i",
      };
    }

    // Filter by job type
    if (jobType) {
      query.jobType = jobType;
    }

    if (minSalary || maxSalary) {
  query.salary = {};

  if (minSalary) {
    query.salary.$gte = Number(minSalary);
  }

  if (maxSalary) {
    query.salary.$lte = Number(maxSalary);
  }
}

    const skip = (Number(page) - 1) * Number(limit);

    const totalJobs = await Job.countDocuments(query);

    const jobs = await Job.find(query)
      .populate("postedBy", "name email")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: jobs.length,
      totalJobs,
      currentPage: Number(page),
      totalPages: Math.ceil(totalJobs / Number(limit)),
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name email",
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch job",
      error: error.message,
    });
  }
};

const applyForJob = async (req, res) => {
  try {
    const { resume, coverLetter } = req.body;
    const { jobId } = req.params;

    if (!resume || !coverLetter) {
      return res.status(400).json({
        success: false,
        message: "Resume and cover letter are required",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "This job is closed",
      });
    }

    const Application = require("../models/Application");

    const existingApplication = await Application.findOne({
      applicant: req.user.userId,
      job: jobId,
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const application = await Application.create({
      applicant: req.user.userId,
      job: jobId,
      resume,
      coverLetter,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit application",
      error: error.message,
    });
  }
};
const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check whether the job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check whether the logged-in recruiter owns this job
    if (job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view these applications",
      });
    }

    const Application = require("../models/Application");

    const applications = await Application.find({
      job: jobId,
    })
      .populate("applicant", "name email")
      .populate("job", "title company")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
};
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check job ownership
    if (job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this job",
      });
    }

    const {
      title,
      description,
      company,
      location,
      salary,
      jobType,
      skills,
      experience,
      status,
    } = req.body;

    // Update only fields that were provided
    if (title !== undefined) job.title = title;
    if (description !== undefined) job.description = description;
    if (company !== undefined) job.company = company;
    if (location !== undefined) job.location = location;
    if (salary !== undefined) job.salary = salary;
    if (jobType !== undefined) job.jobType = jobType;
    if (skills !== undefined) job.skills = skills;
    if (experience !== undefined) job.experience = experience;
    if (status !== undefined) job.status = status;

    await job.save();

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update job",
      error: error.message,
    });
  }
};
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check ownership
    if (job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this job",
      });
    }

    await Job.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete job",
      error: error.message,
    });
  }
};
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      postedBy: req.user.userId,
    })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch your jobs",
      error: error.message,
    });
  }
};
const updateJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["open", "closed"];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Use open or closed",
      });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Only the recruiter who created the job can change its status
    if (job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this job",
      });
    }

    job.status = status;

    await job.save();

    res.status(200).json({
      success: true,
      message: `Job ${status} successfully`,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update job status",
      error: error.message,
    });
  }
};
module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  applyForJob,
  getJobApplications,
  updateJob,
  deleteJob,
  getMyJobs,
  updateJobStatus,
};
