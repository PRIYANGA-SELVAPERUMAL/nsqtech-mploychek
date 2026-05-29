let Record;
try { Record = require('../models/record.model'); } catch {}
const { inMemoryStore, seedInMemory } = require('../config/seed');

// Artificial delay helper — showcases async processing
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

exports.getRecords = async (req, res) => {
  try {
    const delay = parseInt(req.query.delay) || 0;
    const { role, userId } = req.user;

    // Showcase async delay
    if (delay > 0) {
      console.log(`[Records] Simulating ${delay}ms delay...`);
      await sleep(delay);
    }

    let records = [];
    let query = role === 'Admin' ? {} : { assignedTo: userId };

    try {
      records = await Record.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, records, count: records.length, delayed: delay > 0 });
    } catch {}

    // In-memory fallback
    await seedInMemory();
    records = role === 'Admin'
      ? inMemoryStore.records
      : inMemoryStore.records.filter(r => r.assignedTo === userId);

    res.json({ success: true, records, count: records.length, delayed: delay > 0 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getRecordById = async (req, res) => {
  try {
    let record = null;
    try { record = await Record.findOne({ recordId: req.params.recordId }); } catch {}
    if (!record) {
      await seedInMemory();
      record = inMemoryStore.records.find(r => r.recordId === req.params.recordId);
    }
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.json({ success: true, record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    let records = [];
    try { records = await Record.find(); } catch {
      await seedInMemory();
      records = inMemoryStore.records;
    }

    const stats = {
      total: records.length,
      verified: records.filter(r => r.status === 'Verified').length,
      inProgress: records.filter(r => r.status === 'In Progress').length,
      pending: records.filter(r => r.status === 'Pending').length,
      flagged: records.filter(r => r.status === 'Flagged').length,
    };
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
