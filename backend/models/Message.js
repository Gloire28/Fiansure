const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }], // Tableau des utilisateurs ayant lu
  delivered: { type: Boolean, default: false }, // Statut d'envoi
  discussionName: { type: String, required: true } 
});

// Index pour optimiser les requêtes par compte et ordre chronologique
messageSchema.index({ accountId: 1, timestamp: -1 });

module.exports = mongoose.model('Message', messageSchema);