const express = require('express');
const { confirmAssignment, changeAssignedUser } = require('../controllers/accountController'); 
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.post('/:id/confirm', confirmAssignment);
router.put('/:id/change', changeAssignedUser); 

module.exports = router;
