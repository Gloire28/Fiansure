const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Fonction generateUserId déplacée ici pour réutilisation
const generateUserId = (nom, prenom) => {
  if (!nom || !prenom) throw new Error('Nom et prénom sont requis pour générer un userId');
  const nomLetter = nom.charAt(0).toUpperCase();
  const prenomLetter = prenom.charAt(0).toUpperCase();
  const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();
  return `${nomLetter}${prenomLetter}${randomDigits}`;
};

const register = async (req, res, next) => {
  try {
    const { nom, prenom, telephone, password } = req.body;
    if (!nom || !prenom || !telephone || !password) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    
    const existingUser = await User.findOne({ telephone });
    if (existingUser) return res.status(400).json({ message: 'Numéro déjà utilisé' });
    
    let user = new User({ nom, prenom, telephone, password });
    if (!user.userId) {
      let newUserId;
      let existingUserId;
      do {
        newUserId = generateUserId(nom, prenom);
        existingUserId = await User.findOne({ userId: newUserId });
      } while (existingUserId);
      user.userId = newUserId;
    }
    
    await user.save();
    
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Utiliser userId sans préfixe
    res.status(201).json({ 
      token, 
      user: { 
        nom: user.nom, 
        prenom: user.prenom, 
        telephone: user.telephone,
        userId: user.userId // Retourner userId comme identifiant principal
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
    
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Utiliser userId sans préfixe
    res.json({ 
      token, 
      user: { 
        nom: user.nom, 
        prenom: user.prenom, 
        telephone: user.telephone,
        userId: user.userId // Retourner userId comme identifiant principal
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };