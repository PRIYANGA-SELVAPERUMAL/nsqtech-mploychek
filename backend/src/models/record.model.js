const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  recordId: { type: String, required: true, unique: true },
  candidateName: { type: String, required: true },
  position: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'In Progress', 'Verified', 'Flagged', 'Rejected'], default: 'Pending' },
  submittedDate: { type: Date, default: Date.now },
  completedDate: { type: Date },
  assignedTo: { type: String },         // userId of the General User
  createdBy: { type: String },          // userId of the Admin
  checks: [{
    type: { type: String },             // Criminal, Education, Employment, etc.
    status: { type: String },
    remarks: { type: String }
  }],
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  company: { type: String, default: 'NSQTech Private Limited' }
}, { timestamps: true });

module.exports = mongoose.model('Record', recordSchema);
