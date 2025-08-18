const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User.userId', required: true }, // Changé en String
  nom: { type: String, required: true },
  montantCible: { type: Number, required: true, min: 0 },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  couleur: { type: String, default: '#4CAF50' },
  statut: { type: String, enum: ['actif', 'expire', 'corbeille'], default: 'actif' },
  entrees: [{
    montant: { type: Number, required: true, min: 0 },
    libelle: { type: String, required: false },
    date: { type: Date, default: Date.now }
  }]
});

// Calcul progression (virtuel)
goalSchema.virtual('progression').get(function () {
  const total = this.entrees.reduce((sum, entree) => sum + entree.montant, 0);
  return (total / this.montantCible) * 100;
});

// S'assurer que les champs virtuels sont inclus dans toJSON
goalSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Goal', goalSchema);