import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText, Divider, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from 'framer-motion';

function HistoryList({ items, entrees }) {
  console.log('Rendering HistoryList with:', { items, entrees });

  // Vérifier que items ou entrees est un tableau, sinon utiliser un tableau vide
  const validItems = Array.isArray(items) ? items : [];
  const validEntrees = Array.isArray(entrees) ? entrees : [];
  const [filterType, setFilterType] = useState('all'); // État pour le filtre (comptes uniquement)

  // Filtrer les mouvements pour les comptes selon le type sélectionné
  const filteredItems = filterType === 'all' ? validItems : validItems.filter(mvt => mvt.type === filterType);

  // Déterminer si on affiche les entrées (objectifs) ou les mouvements (comptes)
  const isGoalHistory = !!entrees; // Si entrees est défini, c'est pour un objectif

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Accordion sx={{ mt: 2, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            {isGoalHistory ? 'Historique des Entrées' : 'Historique des Mouvements'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {isGoalHistory ? (
            // Affichage pour les entrées (objectifs)
            validEntrees.length === 0 ? (
              <Typography variant="body1" color="textSecondary">
                Aucune entrée enregistrée.
              </Typography>
            ) : (
              <List>
                {validEntrees.map((entree, index) => (
                  <React.Fragment key={entree._id || index}>
                    <ListItem sx={{ py: 1 }}>
                      <ListItemText
                        primary={`${entree.libelle || 'Sans libellé'} - ${entree.montant.toFixed(2)} FCFA`}
                        secondary={`Entrée - ${new Date(entree.date).toLocaleDateString()}`}
                        primaryTypographyProps={{ fontWeight: 500 }}
                        secondaryTypographyProps={{ color: '#4CAF50' }}
                      />
                    </ListItem>
                    {index < validEntrees.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )
          ) : (
            // Affichage pour les mouvements (comptes)
            <>
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                <FormControl sx={{ minWidth: 120 }} size="small">
                  <InputLabel id="filter-type-label">Filtrer par type</InputLabel>
                  <Select
                    labelId="filter-type-label"
                    value={filterType}
                    label="Filtrer par type"
                    onChange={(e) => {
                      setFilterType(e.target.value);
                      console.log('Filter changed to:', e.target.value);
                    }}
                  >
                    <MenuItem value="all">Tous</MenuItem>
                    <MenuItem value="entree">Entrées</MenuItem>
                    <MenuItem value="sortie">Sorties</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              {filteredItems.length === 0 ? (
                <Typography variant="body1" color="textSecondary">
                  Aucun mouvement {filterType === 'all' ? '' : filterType === 'entree' ? 'd’entrée' : 'de sortie'} enregistré.
                </Typography>
              ) : (
                <List>
                  {filteredItems.map((mvt, index) => (
                    <React.Fragment key={mvt._id || index}>
                      <ListItem sx={{ py: 1 }}>
                        <ListItemText
                          primary={`${mvt.libelle || 'Sans libellé'} - ${mvt.montant.toFixed(2)} FCFA`}
                          secondary={`${mvt.type === 'entree' ? 'Entrée' : 'Sortie'} - ${new Date(mvt.date).toLocaleDateString()}`}
                          primaryTypographyProps={{ fontWeight: 500 }}
                          secondaryTypographyProps={{ color: mvt.type === 'entree' ? '#4CAF50' : '#F44336' }}
                        />
                      </ListItem>
                      {index < filteredItems.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </>
          )}
        </AccordionDetails>
      </Accordion>
    </motion.div>
  );
}

export default HistoryList;
