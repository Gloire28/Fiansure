const Goal = require('../models/Goal');
const mongoose = require('mongoose');

const createGoal = async (req, res, next) => {
  try {
    const { nom, montantCible, dateDebut, dateFin, couleur } = req.body;
    const userId = req.userId;
    console.log('Creating goal:', { nom, montantCible, dateDebut, dateFin, userId });

    if (new Date(dateDebut) > new Date()) {
      console.log('Invalid start date:', dateDebut);
      return res.status(400).json({ message: 'Date de début non future' });
    }
    if (new Date(dateFin) <= new Date(dateDebut)) {
      console.log('Invalid end date:', dateFin);
      return res.status(400).json({ message: 'Date de fin invalide' });
    }
    const activeGoals = await Goal.countDocuments({ userId, statut: 'actif' });
    if (activeGoals >= 5) {
      console.log('Goal limit reached:', activeGoals);
      return res.status(400).json({ message: 'Limite de 5 objectifs actifs atteinte' });
    }

    const goal = new Goal({ userId, nom, montantCible, dateDebut, dateFin, couleur });
    await goal.save();
    console.log('Goal created:', goal._id, 'Progression:', goal.progression);
    res.status(201).json(goal);
  } catch (error) {
    console.error('Error creating goal:', error);
    next(error);
  }
};

const getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ userId: req.userId, statut: 'actif' });
    console.log('Fetched goals for user:', req.userId, goals.length, goals.map(g => ({ id: g._id, progression: g.progression })));
    res.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    next(error);
  }
};

const getGoal = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      console.log('Invalid goal ID:', req.params.id);
      return res.status(400).json({ message: 'ID d\'objectif invalide' });
    }
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.userId });
    if (!goal) {
      console.log('Goal not found:', req.params.id);
      return res.status(404).json({ message: 'Objectif non trouvé' });
    }
    console.log('Fetched goal:', goal._id, 'Progression:', goal.progression);
    res.json(goal);
  } catch (error) {
    console.error('Error fetching goal:', error);
    next(error);
  }
};

const addEntry = async (req, res, next) => {
  try {
    const { montant, libelle } = req.body;
    if (montant <= 0) {
      console.log('Invalid entry amount:', montant);
      return res.status(400).json({ message: 'Entrée positive requise' });
    }
    
    if (!mongoose.isValidObjectId(req.params.id)) {
      console.log('Invalid goal ID for entry:', req.params.id);
      return res.status(400).json({ message: 'ID d\'objectif invalide' });
    }
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.userId });
    if (!goal) {
      console.log('Goal not found for entry:', req.params.id);
      return res.status(404).json({ message: 'Objectif non trouvé' });
    }
    
    goal.entrees.push({ montant, libelle: libelle || '' }); // Libellé optionnel
    await goal.save();
    console.log('Entry added to goal:', goal._id, 'New progression:', goal.progression);
    res.json(goal);
  } catch (error) {
    console.error('Error adding entry:', error);
    next(error);
  }
};

const updateGoalDate = async (req, res, next) => {
  try {
    const { dateFin } = req.body;
    if (!mongoose.isValidObjectId(req.params.id)) {
      console.log('Invalid goal ID for update:', req.params.id);
      return res.status(400).json({ message: 'ID d\'objectif invalide' });
    }
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.userId });
    if (!goal) {
      console.log('Goal not found for update:', req.params.id);
      return res.status(404).json({ message: 'Objectif non trouvé' });
    }
    
    if (new Date(dateFin) <= goal.dateDebut) {
      console.log('Invalid end date for update:', dateFin);
      return res.status(400).json({ message: 'Date de fin invalide' });
    }
    
    goal.dateFin = dateFin;
    if (goal.statut === 'expire') goal.statut = 'actif';
    await goal.save();
    console.log('Goal date updated:', goal._id, 'Progression:', goal.progression);
    res.json(goal);
  } catch (error) {
    console.error('Error updating goal date:', error);
    next(error);
  }
};

const deleteGoal = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      console.log('Invalid goal ID for deletion:', req.params.id);
      return res.status(400).json({ message: 'ID d\'objectif invalide' });
    }
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.userId });
    if (!goal) {
      console.log('Goal not found for deletion:', req.params.id);
      return res.status(404).json({ message: 'Objectif non trouvé' });
    }
    
    goal.statut = 'corbeille';
    await goal.save();
    console.log('Goal moved to trash:', goal._id);
    res.json({ message: 'Objectif déplacé vers corbeille' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    next(error);
  }
};

const getCorbeille = async (req, res, next) => {
  try {
    const goals = await Goal.find({ userId: req.userId, statut: 'corbeille' });
    console.log('Fetched trash goals for user:', req.userId, goals.length);
    res.json(goals);
  } catch (error) {
    console.error('Error fetching trash goals:', error);
    next(error);
  }
};

const restoreGoal = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      console.log('Invalid goal ID for restore:', req.params.id);
      return res.status(400).json({ message: 'ID d\'objectif invalide' });
    }
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.userId });
    if (!goal) {
      console.log('Goal not found for restore:', req.params.id);
      return res.status(404).json({ message: 'Objectif non trouvé' });
    }
    
    goal.statut = new Date(goal.dateFin) < new Date() ? 'expire' : 'actif';
    await goal.save();
    console.log('Goal restored:', goal._id, 'Progression:', goal.progression);
    res.json(goal);
  } catch (error) {
    console.error('Error restoring goal:', error);
    next(error);
  }
};

module.exports = { createGoal, getGoals, getGoal, addEntry, updateGoalDate, deleteGoal, getCorbeille, restoreGoal };
