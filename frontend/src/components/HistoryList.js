import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText, Divider, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from 'framer-motion';

function HistoryList({ items, entrees }) {
  const validItems = Array.isArray(items) ? items : [];
  const validEntrees = Array.isArray(entrees) ? entrees : [];
  const [filterType, setFilterType] = useState('all');
  const filteredItems = filterType === 'all' ? validItems : validItems.filter(mvt => mvt.type === filterType);
  const isGoalHistory = !!entrees;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Accordion sx={{ mt: 2, borderRadius: 3, boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {isGoalHistory ? 'Historique des Entrées' : 'Historique des Mouvements'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {isGoalHistory ? (
            validEntrees.length === 0 ? (
              <Typography variant="body2" color="text.secondary">Aucune entrée enregistrée.</Typography>
            ) : (
              <List>
                {validEntrees.map((entree, index) => (
                  <React.Fragment key={entree._id || index}>
                    <ListItem sx={{ py: 1 }}>
                      <ListItemText
                        primary={`${entree.libelle || 'Sans libellé'} - ${new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(entree.montant)} FCFA`}
                        secondary={`Entrée - ${new Date(entree.date).toLocaleDateString()}`}
                        primaryTypographyProps={{ fontWeight: 500, color: '#212121' }}
                        secondaryTypographyProps={{ color: '#4CAF50' }}
                      />
                    </ListItem>
                    {index < validEntrees.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                <FormControl sx={{ minWidth: 140 }} size="small">
                  <InputLabel id="filter-type-label">Filtrer par type</InputLabel>
                  <Select
                    labelId="filter-type-label"
                    value={filterType}
                    label="Filtrer par type"
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <MenuItem value="all">Tous</MenuItem>
                    <MenuItem value="entree">Entrées</MenuItem>
                    <MenuItem value="sortie">Sorties</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              {filteredItems.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Aucun mouvement {filterType !== 'all' ? (filterType === 'entree' ? "d’entrée" : "de sortie") : ''} enregistré.
                </Typography>
              ) : (
                <List>
                  {filteredItems.map((mvt, index) => (
                    <React.Fragment key={mvt._id || index}>
                      <ListItem sx={{ py: 1 }}>
                        <ListItemText
                          primary={`${mvt.libelle || 'Sans libellé'} - ${new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(mvt.montant)} FCFA`}
                          secondary={`${mvt.type === 'entree' ? 'Entrée' : 'Sortie'} - ${new Date(mvt.date).toLocaleDateString()}`}
                          primaryTypographyProps={{ fontWeight: 500, color: '#212121' }}
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
