const User = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
  try {
    const { nom, prenom, telephone, password } = req.body;
    if (!nom || !prenom || !telephone || !password) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    
    const existingUser = await User.findOne({ telephone });
    if (existingUser) return res.status(400).json({ message: 'Numéro déjà utilisé' });
    
    const user = new User({ nom, prenom, telephone, password });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ 
      token, 
      user: { 
        nom: user.nom, 
        prenom: user.prenom, 
        telephone: user.telephone 
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { telephone, password } = req.body;
    if (!telephone || !password) {
      return res.status(400).json({ message: 'Téléphone et mot de passe requis' });
    }
    
    const user = await User.findOne({ telephone });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ 
      token, 
      user: { 
        nom: user.nom, 
        prenom: user.prenom, 
        telephone: user.telephone 
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };