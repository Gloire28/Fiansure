const mongoose = require('mongoose');

const assignmentHistorySchema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  userId: { type: String, ref: 'User.userId', required: true },
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },
  status: { type: String, enum: ['pending', 'active', 'ended'], default: 'pending' }
});

module.exports = mongoose.model('AssignmentHistory', assignmentHistorySchema);