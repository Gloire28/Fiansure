const Account = require('../models/Account');
const mongoose = require('mongoose');

const createAccount = async (req, res, next) => {
  try {
    const { nom, solde } = req.body;
    const userId = req.userId;
    console.log('Creating account:', { nom, solde, userId });

    const activeAccounts = await Account.countDocuments({ userId, statut: 'actif' });
    if (activeAccounts >= 10) {
      console.log('Account limit reached:', activeAccounts);
      return res.status(400).json({ message: 'Limite de 10 comptes actifs atteinte' });
    }

    const account = new Account({ userId, nom });
    if (solde && parseFloat(solde) > 0) {
      account.mouvements.push({
        montant: parseFloat(solde),
        libelle: 'Solde initial',
        type: 'entree'
      });
    }
    await account.save();
    console.log('Account created:', account._id, { statut: account.statut, userId: account.userId });
    res.status(201).json(account.toJSON({ virtuals: true }));
  } catch (error) {
    console.error('Error creating account:', error);
    next(error);
  }
};

const getAccounts = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) {
      console.log('No userId provided for getAccounts');
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }
    const accounts = await Account.find({ userId, statut: 'actif' });
    console.log('Fetched accounts for user:', userId, accounts.length, accounts.map(a => ({ id: a._id, nom: a.nom, statut: a.statut })));
    res.json(accounts.map(account => account.toJSON({ virtuals: true })));
  } catch (error) {
    console.error('Error fetching accounts:', error);
    next(error);
  }
};

const getAccount = async (req, res, next) => {
  try {
    console.log('getAccount called with ID:', req.params.id);
    if (!mongoose.isValidObjectId(req.params.id)) {
      console.log('Invalid account ID:', req.params.id);
      return res.status(400).json({ message: 'ID de compte invalide' });
    }
    const account = await Account.findOne({ _id: req.params.id, userId: req.userId });
    if (!account) {
      console.log('Account not found:', req.params.id);
      return res.status(404).json({ message: 'Compte non trouvé' });
    }
    console.log('Fetched account:', account._id, { statut: account.statut, userId: account.userId });
    res.json(account.toJSON({ virtuals: true }));
  } catch (error) {
    console.error('Error fetching account:', error);
    next(error);
  }
};

const addMovement = async (req, res, next) => {
  try {
    const { montant, libelle, type } = req.body;
    if (!mongoose.isValidObjectId(req.params.id)) {
      console.log('Invalid account ID for movement:', req.params.id);
      return res.status(400).json({ message: 'ID de compte invalide' });
    }
    if (!montant || montant <= 0 || !['entree', 'sortie'].includes(type)) {
      console.log('Invalid movement data:', { montant, type });
      return res.status(400).json({ message: 'Montant positif et type valide (entree/sortie) requis' });
    }
    const account = await Account.findOne({ _id: req.params.id, userId: req.userId });
    if (!account) {
      console.log('Account not found for movement:', req.params.id);
      return res.status(404).json({ message: 'Compte non trouvé' });
    }
    
    account.mouvements.push({ montant: parseFloat(montant), libelle, type });
    await account.save();
    console.log('Movement added to account:', account._id);
    res.json(account.toJSON({ virtuals: true }));
  } catch (error) {
    console.error('Error adding movement:', error);
    res.status(400).json({ message: error.message || 'Erreur lors de l\'ajout du mouvement' });
    next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      console.log('Invalid account ID for deletion:', req.params.id);
      return res.status(400).json({ message: 'ID de compte invalide' });
    }
    const account = await Account.findOne({ _id: req.params.id, userId: req.userId });
    if (!account) {
      console.log('Account not found for deletion:', req.params.id);
      return res.status(404).json({ message: 'Compte non trouvé' });
    }
    
    account.statut = 'corbeille';
    await account.save();
    console.log('Account moved to trash:', account._id, { statut: account.statut, userId: account.userId });
    const trashAccounts = await Account.find({ userId: req.userId, statut: 'corbeille' });
    console.log('Trash accounts after deletion:', trashAccounts.map(a => ({ id: a._id, nom: a.nom, statut: a.statut })));
    res.json({ message: 'Compte déplacé vers corbeille', account: account.toJSON({ virtuals: true }) });
  } catch (error) {
    console.error('Error deleting account:', error);
    next(error);
  }
};

const getCorbeille = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) {
      console.log('No userId provided for getCorbeille');
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

const restoreAccount = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      console.log('Invalid account ID for restore:', req.params.id);
      return res.status(400).json({ message: 'ID de compte invalide' });
    }
    const account = await Account.findOne({ _id: req.params.id, userId: req.userId });
    if (!account) {
      console.log('Account not found for restore:', req.params.id);
      return res.status(404).json({ message: 'Compte non trouvé' });
    }
    
    account.statut = 'actif';
    await account.save();
    console.log('Account restored:', account._id, { statut: account.statut, userId: account.userId });
    res.json(account.toJSON({ virtuals: true }));
  } catch (error) {
    console.error('Error restoring account:', error);
    next(error);
  }
};

module.exports = { createAccount, getAccounts, getAccount, addMovement, deleteAccount, getCorbeille, restoreAccount };