/**
 * Controller: auth
 * Purpose: Handle incoming HTTP requests and responses for authentication
 * Owner: Member 2
 */

const service = require('./auth.service');

module.exports = {
  register: async (req, res, next) => {
    try {
      const { name, email, password, phone } = req.body;
      const data = await service.register({ name, email, password, phone });
      res.status(201).json({ success: true, message: 'User registered successfully', ...data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const data = await service.login({ email, password });
      res.json({ success: true, message: 'Login successful', ...data });
    } catch (err) {
      res.status(401).json({ success: false, message: err.message });
    }
  },

  me: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const data = await service.getCurrentUser(userId);
      res.json({ success: true, ...data });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  }
};
