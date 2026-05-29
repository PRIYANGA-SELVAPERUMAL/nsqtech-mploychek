const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let User;
try { User = require('../models/user.model'); } catch {}
const { inMemoryStore, seedInMemory } = require('../config/seed');

function signToken(user) {
  return jwt.sign(
    { userId: user.userId, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

exports.login = async (req, res) => {
  try {
    const { userId, password, role } = req.body;
    if (!userId || !password || !role) {
      return res.status(400).json({ success: false, message: 'userId, password and role are required' });
    }

    let user = null;

    // Try MongoDB first
    try {
      user = await User.findOne({ userId });
      if (user) {
        const match = await user.comparePassword(password);
        if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });
        if (user.role !== role) return res.status(403).json({ success: false, message: `Role mismatch. Your role is ${user.role}` });
        const token = signToken(user);
        return res.json({ success: true, token, user: user.toSafeObject() });
      }
    } catch {}

    // Fallback: in-memory
    await seedInMemory();
    user = inMemoryStore.users.find(u => u.userId === userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    if (user.role !== role) return res.status(403).json({ success: false, message: `Role mismatch. Your role is ${user.role}` });

    const { password: _, ...safeUser } = user;
    const token = signToken(safeUser);
    return res.json({ success: true, token, user: safeUser });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    let user = null;
    try {
      user = await User.findOne({ userId: req.user.userId });
      if (user) return res.json({ success: true, user: user.toSafeObject() });
    } catch {}

    // In-memory fallback
    user = inMemoryStore.users.find(u => u.userId === req.user.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const { password: _, ...safeUser } = user;
    return res.json({ success: true, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
