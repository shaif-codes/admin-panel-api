const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/permissionMiddleware');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  restoreProject,
  permanentDeleteProject
} = require('../controllers/projectController');

// Admin routes
router.post('/project', authenticateToken, checkPermission('create-projects'), createProject);
router.put('/project/:id', authenticateToken, checkPermission('edit-projects'), updateProject);
router.delete('/project/:id', authenticateToken, checkPermission('delete-projects'), deleteProject);
router.patch('/project/restore/:id', authenticateToken, checkPermission('restore-projects'), restoreProject);
router.delete('/project/permanent/:id', authenticateToken, checkPermission('delete-projects'), permanentDeleteProject); // Optional

// Public routes
router.get('/project', authenticateToken, getProjects);
router.get('/project/:id', authenticateToken, getProjectById);

module.exports = router;
