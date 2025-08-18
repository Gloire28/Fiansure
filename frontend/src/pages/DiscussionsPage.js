import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Badge,
  CircularProgress,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getDiscussions } from '../services/api';

function DiscussionsPage() {
  const [discussions, setDiscussions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiscussions = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Veuillez vous connecter pour voir les discussions.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await getDiscussions();
        const sorted = res.data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setDiscussions(sorted);
        setFiltered(sorted);
        setError(null);
      } catch (err) {
        console.error('Error fetching discussions:', err.response?.data);
        setError(
          'Erreur lors du chargement des discussions: ' +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussions();
  }, []);

  // filtre recherche
  useEffect(() => {
    const results = discussions.filter((d) =>
      d.nom.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(results);
  }, [search, discussions]);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading)
    return (
      <Box sx={{ p: 2, pt: 10, pb: 10, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 2, pt: 10, pb: 10, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );

  return (
    <Box sx={{ p: 2, pt: 10, pb: 10 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        💬 Mes Discussions
      </Typography>

      {/* Barre de recherche */}
      <TextField
        fullWidth
        size="small"
        variant="outlined"
        placeholder="Rechercher une discussion..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      {filtered.length === 0 ? (
        <Typography color="text.secondary">
          Aucune discussion active. Acceptez une invitation pour commencer.
        </Typography>
      ) : (
        <List>
          {filtered.map((discussion) => (
            <React.Fragment key={discussion.accountId}>
              <ListItem
                button
                onClick={() => navigate(`/discussions/${discussion.accountId}`)}
                sx={{
                  '&:hover': { bgcolor: 'action.hover' },
                  borderRadius: 2,
                  mb: 1,
                  boxShadow: 1,
                }}
              >
                <ListItemAvatar>
                  <Badge
                    color="primary"
                    badgeContent={discussion.unreadCount || 0}
                    invisible={!discussion.unreadCount}
                  >
                    <Avatar>
                      {discussion.nom.charAt(0).toUpperCase()}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        {discussion.nom}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(discussion.timestamp)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    discussion.lastMessage
                      ? discussion.lastMessage.length > 40
                        ? discussion.lastMessage.substring(0, 40) + '...'
                        : discussion.lastMessage
                      : `Nouveaux messages: ${discussion.unreadCount || 0}`
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
}

export default DiscussionsPage;
