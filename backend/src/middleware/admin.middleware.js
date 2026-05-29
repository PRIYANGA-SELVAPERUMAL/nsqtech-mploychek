module.exports = function adminMiddleware(req, res, next) {
  if (req.user && req.user.role === 'Admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Admin access required' });
};
