const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const mongoose = require('mongoose');

const authMiddleware = async (req, res, next) => {
  console.log('Auth middleware called for path:', req.path); // Log ajouté
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Accès non autorisé' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Normaliser userId en supprimant un éventuel préfixe USR- pour alignement
    req.user = { userId: decoded.userId.replace(/^USR-/, '') || decoded.userId };

    // Vérification spécifique pour les routes comptes
    if (req.path.startsWith('/comptes') && req.method !== 'GET' && req.path !== '/comptes' && req.path !== '/comptes/corbeille') {
      const accountId = req.params.id;
      if (accountId && !mongoose.isValidObjectId(accountId)) {
        return res.status(400).json({ message: 'ID de compte invalide' });
      }

      // Ne pas vérifier accountId pour les routes d'invitations globales
      if (req.path === '/comptes/invitations/pending' || req.path === '/comptes') {
        return next();
      }

      const account = await Account.findById(accountId);
      if (!account && accountId) {
        return res.status(404).json({ message: 'Compte non trouvé' });
      }

      // Autorisation : créateur ou utilisateur assigné
      const isCreator = account?.userId === req.user.userId;
      const isAssigned = account?.assignedUserId === req.user.userId;

      // Pour les assignations initiales, le créateur peut agir même si assignedUserId est null
      if (req.path.includes('/assign') && !account?.assignedUserId && isCreator) {
        return next();
      }

      // Actions réservées au créateur
      if (req.path.includes('/change-assign') || req.method === 'DELETE') {
        if (!isCreator) {
          return res.status(403).json({ message: 'Seul le créateur peut modifier l\'assignation ou supprimer le compte' });
        }
      } else if (req.path.includes('/mouvements') || req.path.includes('/confirm-assign') || req.path.includes('/accept')) {
        if (!isAssigned && !isCreator) {
          return res.status(403).json({ message: 'Seul l\'utilisateur assigné ou le créateur peut effectuer cette action' });
        }
      } else if (req.path.includes('/invite')) {
        if (!isCreator) {
          return res.status(403).json({ message: 'Seul le créateur peut envoyer une invitation' });
        }
      }
    } else if (req.path.startsWith('/comptes/invitations/pending') || req.path.startsWith('/comptes/history')) {
      // Autoriser l'accès sans vérification d'accountId pour ces routes
      return next();
    }

    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).json({ message: 'Token invalide' });
  }
};

module.exports = authMiddleware;