const bcrypt = require('bcryptjs');
let User;
try { User = require('../models/user.model'); } catch {}
const { inMemoryStore, seedInMemory } = require('../config/seed');

async function findAllUsers() {
  try { return (await User.find()).map(u => u.toSafeObject()); } catch {}
  await seedInMemory();
  return inMemoryStore.users.map(({ password, ...u }) => u);
}

async function findUser(userId) {
  try {
    const u = await User.findOne({ userId });
    return u ? u.toSafeObject() : null;
  } catch {}
  await seedInMemory();
  const u = inMemoryStore.users.find(u => u.userId === userId);
  if (!u) return null;
  const { password, ...safe } = u;
  return safe;
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await findAllUsers();
    res.json({ success: true, users, count: users.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await findUser(req.params.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { userId, name, email, password, role, department } = req.body;
    if (!userId || !name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }
    try {
      const user = new User({ userId, name, email, password, role, department, avatar: name.split(' ').map(n => n[0]).join('').toUpperCase() });
      await user.save();
      return res.status(201).json({ success: true, user: user.toSafeObject() });
    } catch {}

    // In-memory
    await seedInMemory();
    if (inMemoryStore.users.find(u => u.userId === userId)) {
      return res.status(400).json({ success: false, message: 'User ID already exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const newUser = { userId, name, email, password: hashed, role, department, avatar: name.split(' ').map(n => n[0]).join('').toUpperCase(), _id: userId, isActive: true, createdAt: new Date() };
    inMemoryStore.users.push(newUser);
    const { password: _, ...safeUser } = newUser;
    res.status(201).json({ success: true, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = { ...req.body };
    delete updates.password; // password update handled separately
    try {
      const user = await User.findOneAndUpdate({ userId }, updates, { new: true });
      if (user) return res.json({ success: true, user: user.toSafeObject() });
    } catch {}

    await seedInMemory();
    const idx = inMemoryStore.users.findIndex(u => u.userId === userId);
    if (idx === -1) return res.status(404).json({ success: false, message: 'User not found' });
    inMemoryStore.users[idx] = { ...inMemoryStore.users[idx], ...updates, updatedAt: new Date() };
    const { password, ...safeUser } = inMemoryStore.users[idx];
    res.json({ success: true, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    try {
      const result = await User.findOneAndDelete({ userId });
      if (result) return res.json({ success: true, message: 'User deleted' });
    } catch {}

    await seedInMemory();
    const idx = inMemoryStore.users.findIndex(u => u.userId === userId);
    if (idx === -1) return res.status(404).json({ success: false, message: 'User not found' });
    inMemoryStore.users.splice(idx, 1);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
