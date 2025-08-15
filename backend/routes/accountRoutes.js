const express = require('express');
const { createAccount, getAccounts, getAccount, addMovement, deleteAccount, getCorbeille, restoreAccount } = require('../controllers/accountController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.post('/', createAccount);
router.get('/', getAccounts);
router.get('/corbeille', getCorbeille);
router.put('/corbeille/:id/restore', restoreAccount);
router.get('/:id', getAccount);
router.post('/:id/mouvements', addMovement);
router.delete('/:id', deleteAccount);


module.exports = router;