import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, FormControl, InputLabel, Select, MenuItem, Button, Alert } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const buttonColors = { bg: '#FF9800', hover: '#FB8C00' };

function HistoryList({ items, entrees }) {
  const validItems = Array.isArray(items) ? items : [];
  const validEntrees = Array.isArray(entrees) ? entrees : [];
  const [filterType, setFilterType] = useState('all');
  const [isOpen, setIsOpen] = useState(false);
  const filteredItems = filterType === 'all' ? validItems : validItems.filter(mvt => mvt.type === filterType);
  const isGoalHistory = !!entrees;

  const formStyle = {
    p: 3,
    borderRadius: 3,
    boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
    bgcolor: '#F5F7FA',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    width: '100%',
    maxWidth: 650,
    mx: 'auto',
    mb: 3,
  };

  return (
    <Box sx={{ flex: 1 }}>
      <Button
        variant="contained"
        onClick={() => setIsOpen(!isOpen)}
        sx={{ mb: 2, bgcolor: buttonColors.bg, '&:hover': { bgcolor: buttonColors.hover } }}
      >
        {isOpen ? 'Cacher l\'Historique' : 'Voir l\'Historique'}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
            <Box sx={formStyle}>
              {isGoalHistory ? (
                validEntrees.length === 0 ? (
                  <Alert severity="info">Aucune entrée enregistrée.</Alert>
                ) : (
                  <List>
                    {validEntrees.map((entree, index) => (
                      <React.Fragment key={entree._id || index}>
                        <ListItem>
                          <ListItemText
                            primary={`${entree.libelle || 'Sans libellé'} - ${new Intl.NumberFormat('fr-FR').format(entree.montant)} FCFA`}
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
                <>
                  <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Filtrer par type</InputLabel>
                    <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                      <MenuItem value="all">Tous</MenuItem>
                      <MenuItem value="entree">Entrées</MenuItem>
                      <MenuItem value="sortie">Sorties</MenuItem>
                    </Select>
                  </FormControl>

                  {filteredItems.length === 0 ? (
                    <Alert severity="info">
                      Aucun mouvement {filterType !== 'all' ? (filterType === 'entree' ? "d’entrée" : "de sortie") : ''} enregistré.
                    </Alert>
                  ) : (
                    <List>
                      {filteredItems.map((mvt, index) => (
                        <React.Fragment key={mvt._id || index}>
                          <ListItem>
                            <ListItemText
                              primary={`${mvt.libelle || 'Sans libellé'} - ${new Intl.NumberFormat('fr-FR').format(mvt.montant)} FCFA`}
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
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

export default HistoryList;
