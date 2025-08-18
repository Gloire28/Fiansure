const express = require('express');
const { createAccount, getAccounts, getAccount, addMovement, deleteAccount, getCorbeille, restoreAccount, assignUser, confirmAssignment, changeAssignedUser, getAccountHistory, sendInvitation, getPendingInvitations, acceptInvitation } = require('../controllers/accountController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Routes pour la gestion des comptes
router.post('/', createAccount);
router.get('/', getAccounts);
router.get('/corbeille', getCorbeille);
router.put('/corbeille/:id/restore', restoreAccount);
router.get('/:id', getAccount);
router.post('/:id/mouvements', addMovement);
router.delete('/:id', deleteAccount);
router.post('/:id/assign', assignUser);
router.post('/:id/confirm-assign', confirmAssignment);
router.put('/:id/change-assign', changeAssignedUser);
router.get('/:id/history', getAccountHistory);

// Routes pour la gestion des invitations
router.post('/:id/invite', sendInvitation);
router.get('/invitations/pending', getPendingInvitations);
router.post('/:id/accept', acceptInvitation);

module.exports = router;