const mongoose = require('mongoose');
const Message = require('./Message');
const User = require('./User');
const { v4: uuidv4 } = require('uuid'); // Pour générer des tokens uniques

const accountSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User.userId', required: true },
  nom: { type: String, required: true, unique: true },
  statut: { type: String, enum: ['actif', 'corbeille'], default: 'actif' },
  assignedUserId: { type: String, ref: 'User.userId', default: null },
  discussionStarted: { type: Boolean, default: false },
  mouvements: [{
    montant: { type: Number, required: true },
    libelle: { type: String, required: true },
    type: { type: String, enum: ['entree', 'sortie'], required: true },
    date: { type: Date, default: Date.now }
  }],
  assignmentHistory: [{
    userId: { type: String, ref: 'User.userId' },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    status: { type: String, enum: ['pending', 'active', 'ended'], default: 'pending' }
  }],
  pendingInvitations: [{
    userId: { type: String, ref: 'User.userId', required: true },
    invitedBy: { type: String, ref: 'User.userId', required: true },
    dateSent: { type: Date, default: Date.now },
    invitationToken: {
      type: String,
      default: () => uuidv4(),
    }
  }]
});

accountSchema.index({ "pendingInvitations.invitationToken": 1 }, {
  unique: true,
  sparse: true,
  partialFilterExpression: {
    "pendingInvitations.invitationToken": { $exists: true, $ne: null }
  }
});

// Calcul du solde (virtuel)
accountSchema.virtual('solde').get(function () {
  return this.mouvements.reduce((sum, mvt) => {
    return mvt.type === 'entree' ? sum + mvt.montant : sum - mvt.montant;
  }, 0);
});

// Inclure les champs virtuels par défaut
accountSchema.set('toJSON', { virtuals: true });

// Méthode pour ajouter une invitation
accountSchema.methods.addPendingInvitation = function (userId, invitedBy) {
  const existingInvitation = this.pendingInvitations.find(inv => inv.userId === userId);
  if (existingInvitation) {
    throw new Error('Une invitation existe déjà pour cet utilisateur.');
  }
  const invitationToken = uuidv4();
  this.pendingInvitations.push({ userId, invitedBy, invitationToken });
  return this.save();
};

// Méthode pour accepter une invitation
accountSchema.methods.acceptInvitation = async function (userId) {
  const invitation = this.pendingInvitations.find(inv => inv.userId === userId);
  if (!invitation) {
    throw new Error('Aucune invitation en attente pour cet utilisateur.');
  }
  this.pendingInvitations = this.pendingInvitations.filter(inv => inv.userId !== userId);

  if (!this.assignedUserId) {
    this.assignedUserId = userId;
  }

  this.assignmentHistory.push({ userId, status: 'active', startDate: new Date() });
  this.discussionStarted = true;

  // Création d’un message initial
  const sender = await User.findOne({ userId: this.userId });
  const receiver = await User.findOne({ userId: userId });
  if (!sender || !receiver) throw new Error('Utilisateur non trouvé');

  const initialMessage = new Message({
    senderId: sender._id,
    receiverId: receiver._id,
    accountId: this._id,
    content: `Bienvenue dans la discussion pour le compte ${this.nom}!`,
    discussionName: this.nom
  });

  await initialMessage.save();
  return this.save();
};

// Limite de 10 comptes actifs
accountSchema.statics.checkAccountLimit = async function (userId) {
  const count = await this.countDocuments({ userId, statut: 'actif' });
  if (count >= 10) {
    throw new Error('Limite de 10 comptes actifs atteinte pour cet utilisateur.');
  }
};

module.exports = mongoose.model('Account', accountSchema);
