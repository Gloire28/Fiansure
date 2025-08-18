const express = require('express');
const { sendMessage, getMessages, markAsRead } = require('../controllers/messageController');
const { getDiscussions } = require('../controllers/accountController'); 
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// Définir la route /discussions en premier pour éviter les conflits
router.get('/discussions', getDiscussions);

// Route avec paramètre :accountId doit venir après
router.get('/:accountId', getMessages);
router.post('/', sendMessage); 
router.put('/:messageId/read', markAsRead); 

module.exports = router;