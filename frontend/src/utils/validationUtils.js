export const isPositiveAmount = (amount) => amount > 0;
export const isGoalLimitReached = (goals) => goals.filter(g => g.statut === 'actif').length >= 5;
export const isAccountLimitReached = (accounts) => accounts.filter(a => a.statut === 'actif').length >= 10;

// Placeholder libellés prédéfinis (à remplacer par GET /api/libelles)
export const libelles = {
  revenus: ['Facture Client', 'Salaire', 'Vente'],
  depenses: ['Abonnement Logiciel', 'Transport', 'Fournitures'],
  autre: 'Autre'
};