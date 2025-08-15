const express = require('express');
const { createGoal, getGoals, getGoal, addEntry, updateGoalDate, deleteGoal, getCorbeille, restoreGoal } = require('../controllers/goalController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware); // Protect all routes
router.post('/', createGoal);
router.get('/', getGoals);
router.get('/corbeille', getCorbeille);
router.put('/corbeille/:id/restore', restoreGoal);
router.get('/:id', getGoal);
router.post('/:id/entrees', addEntry);
router.put('/:id', updateGoalDate);
router.delete('/:id', deleteGoal);

module.exports = router;