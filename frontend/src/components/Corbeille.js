import React from 'react';
import { Box, Typography, Button, Card, CardContent, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';
import HistoryList from './HistoryList';
import RestoreIcon from '@mui/icons-material/Restore';

function Corbeille({ items, onRestore, isGoal }) {
  console.log('Rendering Corbeille with items:', items);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      {items.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          Aucun {isGoal ? 'objectif' : 'compte'} dans la corbeille.
        </Typography>
      ) : (
        items.map((item, index) => (
          <motion.div
            key={item._id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card sx={{ mb: 2, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                  {item.nom}
                </Typography>
                {isGoal ? (
                  <>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Montant cible: {item.montantCible.toFixed(2)} FCFA
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Date de début: {new Date(item.dateDebut).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Date de fin: {new Date(item.dateFin).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Montant total entré: {(item.entrees ? item.entrees.reduce((sum, entrée) => sum + entrée.montant, 0) : 0).toFixed(2)} FCFA
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Progression: {item.progression ? item.progression.toFixed(2) : 0}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={item.progression || 0}
                      sx={{ mb: 2, height: 8, borderRadius: 4 }}
                    />
                    <HistoryList entrees={item.entrees} />
                  </>
                ) : (
                  <>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Solde: {item.solde !== undefined ? item.solde.toFixed(2) : '0.00'} FCFA
                    </Typography>
                    <HistoryList items={item.mouvements} />
                  </>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<RestoreIcon />}
                  onClick={() => {
                    console.log('Restoring', isGoal ? 'goal' : 'account', ':', item._id);
                    onRestore(item._id);
                  }}
                  sx={{ mt: 2 }}
                >
                  Restaurer
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))
      )}
    </Box>
  );
}

export default Corbeille;
