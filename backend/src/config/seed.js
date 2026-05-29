const User = require('../models/user.model');
const Record = require('../models/record.model');

// In-memory store for non-MongoDB mode
const inMemoryStore = {
  users: [],
  records: [],
  seeded: false
};

const seedUsers = [
  {
    userId: 'USR001',
    name: 'Priyanga S',
    email: 'priyanga@nsqtech.com',
    password: 'password123',
    role: 'General User',
    department: 'Verification',
    avatar: 'PS'
  },
  {
    userId: 'ADM001',
    name: 'Admin User',
    email: 'admin@nsqtech.com',
    password: 'admin123',
    role: 'Admin',
    department: 'Management',
    avatar: 'AU'
  },
  {
    userId: 'USR002',
    name: 'Ravi Kumar',
    email: 'ravi@nsqtech.com',
    password: 'password123',
    role: 'General User',
    department: 'Operations',
    avatar: 'RK'
  },
  {
    userId: 'USR003',
    name: 'Deepa Nair',
    email: 'deepa@nsqtech.com',
    password: 'password123',
    role: 'General User',
    department: 'Verification',
    avatar: 'DN'
  },
  {
    userId: 'ADM002',
    name: 'Melody Fernandez',
    email: 'melody@mploychek.com',
    password: 'melody123',
    role: 'Admin',
    department: 'HR',
    avatar: 'MF'
  }
];

const seedRecords = [
  {
    recordId: 'REC001',
    candidateName: 'Arjun Mehta',
    position: 'Software Engineer',
    status: 'Verified',
    assignedTo: 'USR001',
    createdBy: 'ADM001',
    priority: 'High',
    checks: [
      { type: 'Criminal', status: 'Clear', remarks: 'No records found' },
      { type: 'Education', status: 'Verified', remarks: 'B.Tech from VIT confirmed' },
      { type: 'Employment', status: 'Verified', remarks: 'Previous employer confirmed' }
    ],
    submittedDate: new Date('2024-05-01'),
    completedDate: new Date('2024-05-08')
  },
  {
    recordId: 'REC002',
    candidateName: 'Sneha Pillai',
    position: 'Data Analyst',
    status: 'In Progress',
    assignedTo: 'USR001',
    createdBy: 'ADM001',
    priority: 'Medium',
    checks: [
      { type: 'Criminal', status: 'Clear', remarks: '' },
      { type: 'Education', status: 'Pending', remarks: '' },
      { type: 'Employment', status: 'Pending', remarks: '' }
    ],
    submittedDate: new Date('2024-05-10')
  },
  {
    recordId: 'REC003',
    candidateName: 'Karthik Bala',
    position: 'Product Manager',
    status: 'Flagged',
    assignedTo: 'USR002',
    createdBy: 'ADM001',
    priority: 'High',
    checks: [
      { type: 'Criminal', status: 'Flagged', remarks: 'Minor offence in 2019 — under review' },
      { type: 'Education', status: 'Verified', remarks: 'MBA from IIM confirmed' }
    ],
    submittedDate: new Date('2024-05-05')
  },
  {
    recordId: 'REC004',
    candidateName: 'Lavanya Suresh',
    position: 'UI Designer',
    status: 'Pending',
    assignedTo: 'USR001',
    createdBy: 'ADM002',
    priority: 'Low',
    checks: [],
    submittedDate: new Date('2024-05-12')
  },
  {
    recordId: 'REC005',
    candidateName: 'Rahul Iyer',
    position: 'DevOps Engineer',
    status: 'Verified',
    assignedTo: 'USR003',
    createdBy: 'ADM001',
    priority: 'Medium',
    checks: [
      { type: 'Criminal', status: 'Clear', remarks: '' },
      { type: 'Education', status: 'Verified', remarks: 'B.E CSE confirmed' },
      { type: 'Employment', status: 'Verified', remarks: '3 years at Infosys verified' }
    ],
    submittedDate: new Date('2024-04-28'),
    completedDate: new Date('2024-05-03')
  }
];

const bcrypt = require('bcryptjs');

async function getInMemoryUsers() {
  return inMemoryStore.users;
}

async function seedInMemory() {
  if (inMemoryStore.seeded) return;
  for (const u of seedUsers) {
    inMemoryStore.users.push({ ...u, password: await bcrypt.hash(u.password, 10), _id: u.userId, createdAt: new Date(), updatedAt: new Date() });
  }
  inMemoryStore.records = seedRecords.map(r => ({ ...r, _id: r.recordId }));
  inMemoryStore.seeded = true;
  console.log('In-memory store seeded');
}

module.exports = async function seed() {
  try {
    const count = await User.countDocuments();
    if (count > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }
    for (const userData of seedUsers) {
      const user = new User(userData);
      await user.save();
    }
    await Record.insertMany(seedRecords);
    console.log(`Seeded ${seedUsers.length} users and ${seedRecords.length} records`);
  } catch (err) {
    // MongoDB not available — seed in memory
    await seedInMemory();
  }
};

module.exports.inMemoryStore = inMemoryStore;
module.exports.seedInMemory = seedInMemory;
module.exports.bcrypt = bcrypt;
