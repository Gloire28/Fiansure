const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  telephone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userId: { type: String, unique: true, required: true }
});

// Fonction pour générer un userId basé sur nom, prénom et chiffres aléatoires
const generateUserId = (nom, prenom) => {
  if (!nom || !prenom) throw new Error('Nom et prénom sont requis pour générer un userId');
  const nomLetter = nom.charAt(0).toUpperCase();
  const prenomLetter = prenom.charAt(0).toUpperCase();
  const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();
  return `${nomLetter}${prenomLetter}${randomDigits}`;
};

// Hash password and generate userId before saving
userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    if (!this.userId) {
      let newUserId;
      let existingUser;
      do {
        newUserId = generateUserId(this.nom, this.prenom);
        existingUser = await mongoose.model('User', userSchema).findOne({ userId: newUserId });
      } while (existingUser);
      this.userId = newUserId;
    }
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);