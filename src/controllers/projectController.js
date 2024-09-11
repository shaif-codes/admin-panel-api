const Project = require('../models/Project'); // Assuming you have a Project model
// Create a new project (Admin only)
const createProject = async (req, res) => {
  try {
    const { name, description, startDate, endDate } = req.body;

    const newProject = await Project.create({
      name,
      description,
      createdBy: req.user.id,
      startDate,
      endDate
    });

    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    res.status(500).json({ error: 'Error creating project', message: error.message });
  }
};

// Get all projects (Accessible by all users)
const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({where: { isDeleted: false }});
    if (!projects.length) {
      return res.status(404).json({ message: 'No projects found' });
    }
    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching projects', message: error.message });
  }
};

// Get project by ID (Accessible by all users)
const getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findByPk(projectId, { where: { isDeleted: false } });

    if (!project || project.isDeleted) {
      return res.status(404).json({ message: 'Project not found' });
    }
    console.log(project.length, " Project Found");
    res.status(200).json({ project });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching project', message: error.message });
  }
};

// Update project (Admin only)
const updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { name, description, startDate, endDate } = req.body;

    const project = await Project.findByPk();

    if (!project || project.isDeleted) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.update({ name, description, startDate, endDate });
    res.status(200).json({ message: 'Project updated successfully', project });
  } catch (error) {
    res.status(500).json({ error: 'Error updating project', message: error.message });
  }
};

// Soft delete project (Admin only)
const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.update({ isDeleted: true });
    res.status(200).json({ message: 'Project soft-deleted successfully', project });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting project', message: error.message });
  }
};

// Restore soft-deleted project (Admin only)
const restoreProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findByPk(projectId, { where: { isDeleted: true } });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or not deleted' });
    }

    await project.update({ isDeleted: false });
    res.status(200).json({ message: 'Project restored successfully', project });
  } catch (error) {
    res.status(500).json({ error: 'Error restoring project', message: error.message });
  }
};

// Permanently delete project (Admin only)
const permanentDeleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.destroy();
    res.status(200).json({ message: 'Project permanently deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error permanently deleting project', message: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  restoreProject,
  permanentDeleteProject
};
