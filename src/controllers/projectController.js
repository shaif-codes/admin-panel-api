const Project = require('../models/Project'); // Assuming you have a Project model
const { createAuditLog } = require('./auditLogController');

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
    await createAuditLog('CREATE_PROJECT', req.user.id, `Project with ID: ${newProject.id} created`, `${newProject.id}`);
  } catch (error) {
    res.status(500).json({ error: 'Error creating project', message: error.message });
    await createAuditLog('CREATE_PROJECT', req.user.id, `Error creating project: ${error.message}`, 'CREATE_PROJECT');
  }
};

// Get all projects (Accessible by all users)
const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({where: { isDeleted: false }});
    if (!projects.length) {
        await createAuditLog("VIEW_ALL_PROJECTS", req.user.id, 'No projects found', "ALL_PROJECTS");
      return res.status(404).json({ message: 'No projects found' });
    }
    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching projects', message: error.message });
    await createAuditLog("VIEW_ALL_PROJECTS", req.user.id, `Error fetching projects:\n ${error.message}`, "ALL_PROJECTS");
  }
};

// Get project by ID (Accessible by all users)
const getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findByPk(projectId, { where: { isDeleted: false } });

    if (!project || project.isDeleted) {
        await createAuditLog("VIEW_PROJECT", req.user.id, `Project with ID: ${projectId} not found`, `${projectId}`);
      return res.status(404).json({ message: 'Project not found' });
    }

    // console.log(project.length, " Project Found");
    res.status(200).json({ project });
    await createAuditLog("VIEW_PROJECT", req.user.id, `Project with ID: ${projectId} fetched`, `${projectId}`);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching project', message: error.message });
    await createAuditLog("VIEW_PROJECT", req.user.id, `Error fetching project:\n ${error.message}`, `${req.params.id}`);
  }
};

// Update project (Admin only)
const updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { name, description, startDate, endDate } = req.body;

    const project = await Project.findByPk();

    if (!project || project.isDeleted) {
        await createAuditLog("UPDATE_PROJECT", req.user.id, `Project with ID: ${projectId} not found`, `${projectId}`);
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.update({ name, description, startDate, endDate });

    res.status(200).json({ message: 'Project updated successfully', project });
    await createAuditLog('UPDATE_PROJECT', req.user.id, `Project with ID: ${projectId} updated`, `${projectId}`);
  } catch (error) {
    res.status(500).json({ error: 'Error updating project', message: error.message });
    await createAuditLog('UPDATE_PROJECT', req.user.id, `Error updating project:\n ${error.message}`, 'UPDATE_PROJECT');
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
    await createAuditLog('DELETE_PROJECT', req.user.id, `Error deleting project:\n ${error.message}`, 'DELETE_PROJECT');
  }
};

// Restore soft-deleted project (Admin only)
const restoreProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findByPk(projectId, { where: { isDeleted: true } });

    if (!project) {
        await createAuditLog("RESTORE_PROJECT", req.user.id, `Project with ID: ${projectId} not found or not deleted`, `${projectId}`);
      return res.status(404).json({ message: 'Project not found or not deleted' });
    }

    await project.update({ isDeleted: false });

    res.status(200).json({ message: 'Project restored successfully', project });
    await createAuditLog("RESTORE_PROJECT", req.user.id, `Project with ID: ${projectId} restored`, `${projectId}`);
  } catch (error) {
    res.status(500).json({ error: 'Error restoring project', message: error.message });
    await createAuditLog("RESTORE_PROJECT", req.user.id, `Error restoring project:\n ${error.message}`, 'RESTORE_PROJECT');
  }
};

// Permanently delete project (Admin only)
const permanentDeleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findByPk(projectId);

    if (!project) {
        await createAuditLog("PERMANENT_DELETE_PROJECT", req.user.id, `Project with ID: ${projectId} not found`, `${projectId}`);
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.destroy();

    res.status(200).json({ message: 'Project permanently deleted' });
    await createAuditLog("PERMANENT_DELETE_PROJECT", req.user.id, `Project with ID: ${projectId} permanently deleted`, `${projectId}`);
  } catch (error) {
    res.status(500).json({ error: 'Error permanently deleting project', message: error.message });
    await createAuditLog("PERMANENT_DELETE_PROJECT", req.user.id, `Error permanently deleting project:\n ${error.message}`, 'PERMANENT_DELETE_PROJECT');
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
