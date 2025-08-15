const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nom: { type: String, required: true },
  statut: { type: String, enum: ['actif', 'corbeille'], default: 'actif' },
  mouvements: [{
    montant: { type: Number, required: true },
    libelle: { type: String, required: true },
    type: { type: String, enum: ['entree', 'sortie'], required: true },
    date: { type: Date, default: Date.now }
  }]
});

// Calcul solde (virtuel)
accountSchema.virtual('solde').get(function () {
  return this.mouvements.reduce((sum, mvt) => {
    return mvt.type === 'entree' ? sum + mvt.montant : sum - mvt.montant;
  }, 0);
});

// Inclure les champs virtuels par défaut
accountSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Account', accountSchema);