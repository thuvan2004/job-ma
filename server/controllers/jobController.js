const Job = require('../models/Job');

// எல்லா jobs get பண்ணு
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user._id });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Job add பண்ணு
const createJob = async (req, res) => {
  try {
    const { company, role, status, salary, jobUrl, notes } = req.body;
    const job = await Job.create({
      userId: req.user._id,
      company,
      role,
      status,
      salary,
      jobUrl,
      notes
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Job update பண்ணு
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Job delete பண்ணு
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getJobs, createJob, updateJob, deleteJob };