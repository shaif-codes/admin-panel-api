const { Role } = require('../models/associations'); // Make sure to adjust the path as per your project structure

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      // Assume `req.user` contains the authenticated user's data, including roleId
      console.log('req.user :', req.user);  
      const roleId = req.user.role.id;

      // Fetch the role from the database
      const role = await Role.findByPk(roleId);
      
      if (!role) {
        return res.status(403).json({ message: 'Role not found' });
      }
      
      console.log('role :', role);
      // Check if the role has the required permission
      const hasPermission = role.permissions.includes(requiredPermission);

      if (!hasPermission) {
        return res.status(403).json({ message: 'Access Forbidden: Insufficient Permissions' });
      }

      // Permission is valid, proceed to the next middleware or route handler
      next();
    } catch (error) {
      return res.status(500).json({ message: 'Error checking permissions', error: error.message });
    }
  };
};

module.exports = checkPermission;
