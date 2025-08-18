const Account = require('../models/Account');
const AssignmentHistory = require('../models/AssignmentHistory');
const Message = require('../models/Message');
const mongoose = require('mongoose');
const User = require('../models/User');

// Validation personnalisée pour userId (deux lettres + quatre chiffres)
const isValidCustomUserId = (userId) => {
  const customUserIdRegex = /^[A-Z]{2}\d{4}$/;
  return customUserIdRegex.test(userId);
};

// Envoyer une invitation à un gestionnaire
const sendInvitation = async (req, res, next) => {
  try {
    const { assignedUserId } = req.body;
    const accountId = req.params.id;
    const userId = req.user.userId;
    console.log('sendInvitation called - accountId:', accountId, 'assignedUserId:', assignedUserId, 'req.user.userId:', userId);
    if (!mongoose.isValidObjectId(accountId)) {
      return res.status(400).json({ message: 'ID de compte invalide' });
    }
    if (!assignedUserId || !isValidCustomUserId(assignedUserId)) {
      return res.status(400).json({ message: 'ID d\'utilisateur invalide (format AB1234 requis)' });
    }
    const account = await Account.findOne({ _id: accountId, userId });
    if (!account) {
      return res.status(404).json({ message: 'Compte non trouvé' });
    }
    await account.addPendingInvitation(assignedUserId, userId);
    await account.save();
    console.log('Invitation sent successfully - accountId:', accountId, 'pendingInvitations:', account.pendingInvitations);
    res.status(201).json({ message: 'Invitation envoyée avec succès', account: account.toJSON({ virtuals: true }) });
  } catch (error) {
    console.error('Error sending invitation:', error.message, 'stack:', error.stack);
    next(error);
  }
};

// Récupérer les invitations en attente pour l'utilisateur connecté
const getPendingInvitations = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    console.log('getPendingInvitations called - userId:', userId);
    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }
    const accounts = await Account.find({
      'pendingInvitations.userId': userId,
      statut: 'actif'
    });
    const invitations = accounts.map(account => ({
      accountId: account._id,
      accountName: account.nom,
      invitedBy: account.pendingInvitations.find(inv => inv.userId === userId).invitedBy,
      dateSent: account.pendingInvitations.find(inv => inv.userId === userId).dateSent
    }));
    console.log('Formatted invitations:', invitations);
    res.json(invitations);
  } catch (error) {
    console.error('Error fetching pending invitations:', error.message, 'stack:', error.stack);
    next(error);
  }
};

// Accepter une invitation
const acceptInvitation = async (req, res, next) => {
  try {
    const accountId = req.params.id;
    const userId = req.user.userId;
    console.log('acceptInvitation called - accountId:', accountId, 'req.user.userId:', userId);
    if (!mongoose.isValidObjectId(accountId)) {
      return res.status(400).json({ message: 'ID de compte invalide' });
    }
    const account = await Account.findOne({ _id: accountId });
    if (!account) {
      return res.status(404).json({ message: 'Compte non trouvé' });
    }
    await account.acceptInvitation(userId);
    await account.save();
    console.log('Invitation accepted - accountId:', accountId, 'new state:', account.toJSON({ virtuals: true }));
    res.json({ message: 'Invitation acceptée avec succès', account: account.toJSON({ virtuals: true }) });
  } catch (error) {
    console.error('Error accepting invitation:', error.message, 'stack:', error.stack);
    next(error);
  }
};

// Créer un compte
const createAccount = async (req, res, next) => {
  try {
    const { nom, solde, assignedUserId } = req.body;
    const userId = req.user.userId;
    console.log('Creating account:', { nom, solde, userId, assignedUserId });

    await Account.checkAccountLimit(userId);

    // Création basique du compte sans initialiser les tableaux
    const account = new Account({ userId, nom });
    
    if (solde && parseFloat(solde) > 0) {
      account.mouvements = [{
        montant: parseFloat(solde),
        libelle: 'Solde initial',
        type: 'entree'
      }];
    }
    
    if (assignedUserId && isValidCustomUserId(assignedUserId)) {
      await account.addPendingInvitation(assignedUserId, userId);
    } else if (assignedUserId) {
      return res.status(400).json({ message: 'ID d\'utilisateur invalide' });
    }
    
    await account.save();
    console.log('Account created:', account._id);
    res.status(201).json(account.toJSON({ virtuals: true }));
  } catch (error) {
    console.error('Error creating account:', error);
    next(error);
  }
};

// Récupérer les comptes
const getAccounts = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }
    const accounts = await Account.find({
      $or: [{ userId }, { assignedUserId: userId }],
      statut: 'actif'
    });
    console.log('Fetched accounts for user:', userId, accounts.length, accounts.map(a => ({ id: a._id, nom: a.nom, statut: a.statut })));
    res.json(accounts.map(account => account.toJSON({ virtuals: true })));
  } catch (error) {
    console.error('Error fetching accounts:', error);
    next(error);
  }
};

// Récupérer un compte
const getAccount = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID de compte invalide' });
    }
    const account = await Account.findOne({ _id: req.params.id });
    if (!account) {
      return res.status(404).json({ message: 'Compte non trouvé' });
    }
    if (account.userId !== req.user.userId && account.assignedUserId !== req.user.userId) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    console.log('Fetched account:', account._id, { statut: account.statut, userId: account.userId });
    res.json(account.toJSON({ virtuals: true }));
  } catch (error) {
    console.error('Error fetching account:', error);
    next(error);
  }
};

// Ajouter un mouvement
const addMovement = async (req, res, next) => {
  try {
    const { montant, libelle, type } = req.body;
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID de compte invalide' });
    }
    if (!montant || montant <= 0 || !['entree', 'sortie'].includes(type)) {
      return res.status(400).json({ message: 'Montant positif et type valide (entree/sortie) requis' });
    }
    const account = await Account.findOne({ _id: req.params.id });
    if (!account) {
      return res.status(404).json({ message: 'Compte non trouvé' });
    }
    if (account.userId !== req.user.userId && account.assignedUserId !== req.user.userId) {
      return res.status(403).json({ message: 'Seul le créateur ou l\'utilisateur assigné peut ajouter des mouvements' });
    }
    
    // Ajouter le mouvement
    account.mouvements.push({ 
      montant: parseFloat(montant), 
      libelle, 
      type,
      date: new Date() // Ajout de la date actuelle
    });
    
    // Sauvegarder
    await account.save();
    console.log('Movement added to account:', account._id);

    // Retourner le compte mis à jour
    res.json(account.toJSON({ virtuals: true }));
  } catch (error) {
    console.error('Error adding movement:', error);
    res.status(400).json({ message: error.message || 'Erreur lors de l\'ajout du mouvement' });
    next(error);
  }
};

// Supprimer un compte
const deleteAccount = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID de compte invalide' });
    }
    const account = await Account.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!account) {
      return res.status(404).json({ message: 'Compte non trouvé' });
    }
    
    account.statut = 'corbeille';
    if (account.assignedUserId) {
      const history = account.assignmentHistory.find(h => h.userId === account.assignedUserId && !h.endDate);
      if (history) history.endDate = new Date();
    }
    await account.save();
    console.log('Account moved to trash:', account._id, { statut: account.statut, userId: account.userId });
    const trashAccounts = await Account.find({ userId: req.user.userId, statut: 'corbeille' });
    console.log('Trash accounts after deletion:', trashAccounts.map(a => ({ id: a._id, nom: a.nom, statut: a.statut })));
    res.json({ message: 'Compte déplacé vers corbeille', account: account.toJSON({ virtuals: true }) });
  } catch (error) {
    console.error('Error deleting account:', error);
    next(error);
  }
};

// Récupérer les comptes corbeille
const getCorbeille = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }
    console.log('Fetching trash accounts for user:', userId);
    const accounts = await Account.find({ userId, statut: 'corbeille' });
    console.log('Fetched trash accounts:', accounts.length, accounts.map(a => ({ id: a._id, nom: a.nom, statut: a.statut, userId: a.userId })));
    res.json(accounts.map(account => account.toJSON({ virtuals: true })));
  } catch (error) {
    console.error('Error fetching trash accounts:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des comptes supprimés' });
    next(error);
  }
};

// Restaurer un compte
const restoreAccount = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID de compte invalide' });
    }
    const account = await Account.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!account) {
      return res.status(404).json({ message: 'Compte non trouvé' });
    }
    await Account.checkAccountLimit(req.user.userId); // Vérifier la limite avant restauration
    account.statut = 'actif';
    await account.save();
    console.log('Account restored:', account._id, { statut: account.statut, userId: account.userId });
    res.json(account.toJSON({ virtuals: true }));
  } catch (error) {
    console.error('Error restoring account:', error);
    next(error);
  }
};

// Assigner un utilisateur
const assignUser = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID de compte invalide' });
    }
    const { assignedUserId } = req.body;
    const account = await Account.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!account) {
      return res.status(404).json({ message: 'Compte non trouvé' });
    }
    if (account.assignedUserId) {
      console.log('Account already assigned, allowing update:', req.params.id);
    }
    if (assignedUserId && !isValidCustomUserId(assignedUserId)) {
      return res.status(400).json({ message: 'ID d\'utilisateur invalide' });
    }
    if (assignedUserId) {
      await account.addPendingInvitation(assignedUserId, req.user.userId);
      await account.save();
    } else {
      return res.status(400).json({ message: 'ID d\'utilisateur requis' });
    }
    console.log('Invitation sent to:', assignedUserId, 'for account:', account._id);
    res.json({ message: 'Invitation envoyée avec succès', account: account.toJSON({ virtuals: true }) });
  } catch (error) {
    console.error('Error assigning user:', error);
    next(error);
  }
};

// Confirmer une assignation
const confirmAssignment = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID de compte invalide' });
    }
    const account = await Account.findOne({ _id: req.params.id });
    if (!account) {
      return res.status(404).json({ message: 'Compte non trouvé' });
    }
    const invitation = account.pendingInvitations.find(inv => inv.userId === req.user.userId);
    if (!invitation) {
      return res.status(400).json({ message: 'Aucune invitation en attente pour cet utilisateur' });
    }
    await account.acceptInvitation(req.user.userId);
    await account.save();
    console.log('Assignment confirmed for:', account._id, req.user.userId);
    res.json({ message: 'Assignation confirmée', account: account.toJSON({ virtuals: true }) });
  } catch (error) {
    console.error('Error confirming assignment:', error);
    next(error);
  }
};

// Changer l'utilisateur assigné
const changeAssignedUser = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID de compte invalide' });
    }
    const { newAssignedUserId } = req.body;
    const account = await Account.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!account) {
      return res.status(404).json({ message: 'Compte non trouvé' });
    }
    if (!account.assignedUserId) {
      return res.status(400).json({ message: 'Aucun utilisateur assigné' });
    }
    const oldHistory = account.assignmentHistory.find(h => h.userId === account.assignedUserId && !h.endDate);
    if (oldHistory) oldHistory.endDate = new Date();
    if (newAssignedUserId && !isValidCustomUserId(newAssignedUserId)) {
      return res.status(400).json({ message: 'Nouvel ID d\'utilisateur invalide' });
    }
    if (newAssignedUserId) {
      await account.addPendingInvitation(newAssignedUserId, req.user.userId);
      await account.save();
    } else {
      return res.status(400).json({ message: 'Nouvel ID d\'utilisateur requis' });
    }
    console.log('Invitation sent to new user:', newAssignedUserId, 'for account:', account._id);
    res.json({ message: 'Invitation envoyée pour changement d\'utilisateur', account: account.toJSON({ virtuals: true }) });
  } catch (error) {
    console.error('Error changing assigned user:', error);
    next(error);
  }
};

// Récupérer l'historique d'un compte
const getAccountHistory = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID de compte invalide' });
    }
    const account = await Account.findOne({ _id: req.params.id });
    if (!account) {
      return res.status(404).json({ message: 'Compte non trouvé' });
    }
    if (account.userId !== req.user.userId && (account.assignedUserId !== req.user.userId || !account.assignedUserId)) {
      return res.status(403).json({ message: 'Accès à l\'historique non autorisé' });
    }
    const historyStart = account.assignmentHistory.find(h => h.userId === req.user.userId && h.status === 'active')?.startDate || null;
    const historyEnd = account.assignmentHistory.find(h => h.userId === req.user.userId && h.status === 'active')?.endDate || new Date();
    const movements = account.mouvements.filter(m => 
      (!historyStart || m.date >= historyStart) && (!historyEnd || m.date <= historyEnd)
    );
    console.log('Fetched history for:', req.params.id, movements.length);
    res.json({ movements, solde: account.solde });
  } catch (error) {
    console.error('Error fetching account history:', error);
    next(error);
  }
};

// Récupérer les discussions
const getDiscussions = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    console.log('User ID in getDiscussions:', userId);
    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }
    const accounts = await Account.find({
      $or: [{ userId }, { assignedUserId: userId }],
      statut: 'actif',
      discussionStarted: true
    });
    console.log('Accounts found in getDiscussions:', accounts.map(a => a._id.toString()));
    const accountIds = accounts.map(account => account._id);
    
    const discussions = await Promise.all(accountIds.map(async (accountId) => {
      console.log('Processing accountId in getDiscussions:', accountId.toString());
      const messages = await Message.find({ accountId })
        .populate('senderId', 'nom prenom')
        .populate('receiverId', 'nom prenom');
      const unreadCount = messages.filter(m => m.receiverId.toString() === userId && !m.read).length;
      const account = await Account.findById(accountId);
      return {
        accountId,
        nom: account.nom,
        unreadCount,
        lastMessage: messages.length > 0 ? messages[messages.length - 1].content : null,
        timestamp: messages.length > 0 ? messages[messages.length - 1].timestamp : null
    };
    }));

    console.log('Fetched discussions for user:', userId, discussions.length);
    res.json(discussions);
  } catch (error) {
    console.error('Error fetching discussions:', error.message, error.stack, 'Response:', error.response?.data);
    next(error);
  }
};

module.exports = { createAccount, getAccounts, getAccount, addMovement, deleteAccount, getCorbeille, restoreAccount, assignUser, confirmAssignment, changeAssignedUser, getAccountHistory, getDiscussions, sendInvitation, getPendingInvitations, acceptInvitation };