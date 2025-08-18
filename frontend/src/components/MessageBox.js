import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Box, TextField, Button, Typography, Avatar, IconButton, Tooltip, Badge
} from '@mui/material';
import {
  Send as SendIcon,
  Done as DoneIcon,
  DoneAll as DoneAllIcon,
  Call as CallIcon,
  Videocam as VideocamIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { getMessages, sendMessage, getAccount, markAsRead } from '../services/api';

function MessageBox({ accountId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const userId = localStorage.getItem('userId');
  const [account, setAccount] = useState(JSON.parse(localStorage.getItem(`account_${accountId}`)) || {});
  const [unreadCount, setUnreadCount] = useState(0); // Nouvel état pour le compteur
  const messagesEndRef = useRef(null);
  const sendingRef = useRef(false);

  const fetchMessages = async () => {
    try {
      console.log('Starting fetchMessages for account:', accountId);
      const res = await getMessages(accountId);
      console.log('Fetch successful, data length:', res.data.length);
      setMessages(res.data);

      const unreadMessages = res.data.filter(
        m => m.receiverId.toString() === userId && !m.readBy.some(u => u.userId === userId)
      );
      const newUnreadCount = unreadMessages.length;
      setUnreadCount(newUnreadCount); // Mettre à jour le compteur
      if (newUnreadCount > 0) {
        console.log('Found unread messages, marking as read:', newUnreadCount);
        await Promise.all(unreadMessages.map(m => markAsRead(m._id)));
        const updatedRes = await getMessages(accountId);
        console.log('Updated fetch successful, data length:', updatedRes.data.length);
        setMessages(updatedRes.data);
        setUnreadCount(0); // Réinitialiser après avoir marqué comme lu
      }
    } catch (err) {
      console.error('Error in fetchMessages:', err);
    }
  };

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        console.log('Starting fetchAccount for account:', accountId);
        const res = await getAccount(accountId);
        console.log('Fetch account successful:', res.data.nom);
        setAccount(res.data);
        localStorage.setItem(`account_${accountId}`, JSON.stringify(res.data));
      } catch (err) {
        console.error('Error in fetchAccount:', err);
      }
    };

    fetchMessages();
    fetchAccount();
  }, [accountId, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const receiverId = account.assignedUserId && account.assignedUserId.toString() !== userId
    ? account.assignedUserId
    : account.userId;

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !receiverId) return;
    try {
      console.log('Sending message:', { receiverId, accountId, content: newMessage });
      sendingRef.current = true;
      await sendMessage({ receiverId, accountId, content: newMessage });
      setNewMessage('');
      await fetchMessages();
    } catch (err) {
      console.error('Error in handleSendMessage:', err);
    } finally {
      setTimeout(() => (sendingRef.current = false), 300);
    }
  };

  const statusText = useMemo(() => {
    if (account?.isOnline) return 'En ligne';
    if (account?.lastActive) {
      const d = new Date(account.lastActive);
      return `Vu à ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return '';
  }, [account]);

  const ordered = useMemo(() => messages.slice().reverse(), [messages]);

  const isLastOfGroup = (i) => {
    if (i === ordered.length - 1) return true;
    const cur = ordered[i];
    const next = ordered[i + 1];
    const sameAuthor = (cur.senderId?.userId || cur.senderId) === (next.senderId?.userId || next.senderId);
    const closeInTime = Math.abs(new Date(next.timestamp) - new Date(cur.timestamp)) < 5 * 60 * 1000;
    return !(sameAuthor && closeInTime);
  };

  const isSameAuthorAsPrev = (i) => {
    if (i === 0) return false;
    const cur = ordered[i];
    const prev = ordered[i - 1];
    return (cur.senderId?.userId || cur.senderId) === (prev.senderId?.userId || prev.senderId);
  };

  return (
    <Box className="chat-container">
      <Box className="chat-header">
        <Box className="chat-header-left">
          <Box className="avatar-wrapper">
            <Avatar sx={{ width: 40, height: 40 }}>
              {(account?.nom || '?').charAt(0).toUpperCase()}
            </Avatar>
            <span className={`presence-dot ${account?.isOnline ? 'online' : 'offline'}`} />
          </Box>
          <Box sx={{ ml: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1 }}>
              {account?.nom || 'Chargement...'}
            </Typography>
            {unreadCount > 0 && (
              <Badge badgeContent={unreadCount} color="error" sx={{ mr: 1 }}>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Nouveaux messages
                </Typography>
              </Badge>
            )}
            {!!statusText && (
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {statusText}
              </Typography>
            )}
          </Box>
        </Box>
        <Box className="chat-header-actions">
          <Tooltip title="Appel vocal">
            <IconButton size="small" color="inherit">
              <CallIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Appel vidéo">
            <IconButton size="small" color="inherit">
              <VideocamIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Options">
            <IconButton size="small" color="inherit">
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box className="chat-messages">
        <AnimatePresence initial={false}>
          {ordered.map((msg, i) => {
            const isUser = (msg.senderId?.userId || msg.senderId) === userId;
            const readByUser = msg.readBy?.some?.(u => u.userId === userId);
            const lastOfGroup = isLastOfGroup(i);
            const continued = isSameAuthorAsPrev(i);

            return (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 8, scale: sendingRef.current && isUser ? 0.95 : 1 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22, mass: 0.6 }}
                className={[
                  'message',
                  isUser ? 'sent' : 'received',
                  lastOfGroup ? 'bubble-last' : 'bubble-mid',
                  continued ? 'bubble-continued' : 'bubble-first',
                ].join(' ')}
              >
                <Typography variant="body1" className="message-content">
                  {msg.content}
                </Typography>
                <span className="bubble-meta">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {isUser && (
                    <span className={`read-status ${readByUser ? 'read' : 'delivered'}`}>
                      {readByUser ? <DoneAllIcon fontSize="inherit" /> : <DoneIcon fontSize="inherit" />}
                    </span>
                  )}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </Box>

      <Box className="chat-input">
        <TextField
          fullWidth
          variant="outlined"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrivez un message…"
          size="small"
          disabled={!receiverId}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          InputProps={{
            className: 'input-rounded'
          }}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          startIcon={<SendIcon />}
          className="send-btn"
          disabled={!receiverId || !newMessage.trim()}
        >
          Envoyer
        </Button>
      </Box>
    </Box>
  );
}

export default MessageBox;