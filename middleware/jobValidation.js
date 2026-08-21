const validateJob = (req, res, next) => {
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

  const allowedJobTypes = [
    "full-time",
    "part-time",
    "contract",
    "internship",
    "freelance",
  ];

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

  if (typeof title !== "string" || title.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: "Job title must be at least 3 characters",
    });
  }

  if (typeof description !== "string" || description.trim().length < 10) {
    return res.status(400).json({
      success: false,
      message: "Description must be at least 10 characters",
    });
  }

  if (Number.isNaN(Number(salary)) || Number(salary) < 0) {
    return res.status(400).json({
      success: false,
      message: "Salary must be a valid non-negative number",
    });
  }

  if (!allowedJobTypes.includes(jobType)) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid job type. Use full-time, part-time, contract, internship, or freelance",
    });
  }

  if (!Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Skills must be a non-empty array",
    });
  }

  next();
};

module.exports = validateJob;