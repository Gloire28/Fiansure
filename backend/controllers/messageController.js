const Message = require('../models/Message');
const Account = require('../models/Account');
const mongoose = require('mongoose');
const User = require('../models/User'); // Ajoute l'importation du modèle User

const sendMessage = async (req, res, next) => {
  console.log('sendMessage function called');
  try {
    const { receiverId, accountId, content } = req.body;
    const senderId = req.user.userId;
    if (!mongoose.isValidObjectId(accountId)) {
      console.log('Invalid IDs for message:', { accountId, receiverId });
      return res.status(400).json({ message: 'ID de compte invalide' });
    }
    if (!isValidCustomUserId(receiverId) || !isValidCustomUserId(senderId)) {
      console.log('Invalid user IDs for message:', { senderId, receiverId });
      return res.status(400).json({ message: 'IDs d\'utilisateur invalides' });
    }
    const account = await Account.findById(accountId);
    if (!account) {
      console.log('Account not found for message:', accountId);
      return res.status(404).json({ message: 'Compte non trouvé' });
    }
    // Vérifier que senderId et receiverId sont le créateur ou l'utilisateur assigné
    const isSenderCreator = account.userId === senderId;
    const isSenderAssigned = account.assignedUserId === senderId;
    const isReceiverCreator = account.userId === receiverId;
    const isReceiverAssigned = account.assignedUserId === receiverId;
    if (!((isSenderCreator || isSenderAssigned) && (isReceiverCreator || isReceiverAssigned) && 
          (account.assignedUserId || account.userId === receiverId))) {
      console.log('Unauthorized message attempt:', { senderId, receiverId, accountId });
      return res.status(403).json({ message: 'Seul le créateur ou l\'utilisateur assigné peut envoyer un message à l\'autre' });
    }
    const sender = await User.findOne({ userId: senderId });
    const receiver = await User.findOne({ userId: receiverId });
    if (!sender || !receiver) throw new Error('Utilisateur non trouvé');
    const message = new Message({
      senderId: sender._id,
      receiverId: receiver._id,
      accountId: account._id,
      content,
      discussionName: account.nom,
      readBy: [sender._id], // Expéditeur a lu par défaut
      delivered: true // Message considéré comme envoyé
    });
    await message.save();
    console.log('Message sent:', message._id, { senderId, receiverId, accountId });
    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  console.log('getMessages function called');
  try {
    const accountId = req.params.accountId;
    if (!mongoose.isValidObjectId(accountId)) {
      console.log('Invalid account ID for messages:', accountId);
      return res.status(400).json({ message: 'ID de compte invalide' });
    }
    const account = await Account.findById(accountId);
    if (!account) {
      console.log('Account not found for messages:', accountId);
      return res.status(404).json({ message: 'Compte non trouvé' });
    }
    const userId = req.user.userId;
    const isCreator = account.userId === userId;
    const isAssigned = account.assignedUserId === userId;
    if (!isCreator && !isAssigned) {
      console.log('Unauthorized access to messages:', userId, accountId);
      return res.status(403).json({ message: 'Accès non autorisé aux messages' });
    }
    const messages = await Message.find({ accountId })
      .populate('senderId', 'userId nom prenom')
      .populate('receiverId', 'userId nom prenom')
      .populate('readBy', 'userId');
    console.log('Fetched messages for account:', accountId, messages.length);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    next(error);
  }
};

const getDiscussions = async (req, res, next) => {
  console.log('getDiscussions function called');
  try {
    const userId = req.user.userId;
    const user = await User.findOne({ userId });
    if (!user) throw new Error('Utilisateur non trouvé');

    const accounts = await Account.find({ $or: [{ userId }, { assignedUserId: userId }], statut: 'actif' });
    const discussions = await Promise.all(accounts.map(async (account) => {
      const messages = await Message.find({ accountId: account._id })
        .populate('senderId', 'userId nom prenom')
        .populate('receiverId', 'userId nom prenom')
        .populate('readBy', 'userId');
      // Filtrer les messages pour ne garder que ceux entre le créateur et l'assigné
      const relevantMessages = messages.filter(m => 
        (m.senderId.userId === account.userId || m.senderId.userId === account.assignedUserId) &&
        (m.receiverId.userId === account.userId || m.receiverId.userId === account.assignedUserId)
      );
      const unreadCount = relevantMessages.filter(m => 
        m.receiverId.userId === userId && !m.readBy.some(r => r.userId === userId)
      ).length;
      return {
        accountId: account._id,
        discussionName: account.nom,
        unreadCount,
        lastMessage: relevantMessages.length > 0 ? relevantMessages[relevantMessages.length - 1] : null,
      };
    }));
    res.json(discussions);
  } catch (error) {
    console.error('Error fetching discussions:', error);
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  console.log('markAsRead function called');
  try {
    const messageId = req.params.messageId;
    if (!mongoose.isValidObjectId(messageId)) {
      console.log('Invalid message ID:', messageId);
      return res.status(400).json({ message: 'ID de message invalide' });
    }
    const message = await Message.findById(messageId).populate('readBy').populate('accountId').populate('receiverId');
    if (!message) {
      console.log('Message not found:', messageId);
      return res.status(404).json({ message: 'Message non trouvé' });
    }
    const userId = req.user.userId;
    const account = await Account.findById(message.accountId);
    if (!account) throw new Error('Compte associé non trouvé');
    const isCreator = account.userId === userId;
    const isAssigned = account.assignedUserId === userId;
    if (!isCreator && !isAssigned) {
      console.log('Unauthorized read attempt:', userId, 'for message:', messageId);
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    if (message.receiverId.userId !== userId) {
      console.log('Unauthorized read attempt by non-receiver:', userId, 'for message:', messageId);
      return res.status(403).json({ message: 'Seul le destinataire peut marquer comme lu' });
    }
    if (!message.readBy.some(readUser => readUser._id.toString() === user._id.toString())) {
      message.readBy.push(user._id);
      await message.save();
    }
    console.log('Message marked as read:', messageId);
    res.json({ message: 'Message marqué comme lu', message });
  } catch (error) {
    console.error('Error marking message as read:', error);
    next(error);
  }
};

// Validation personnalisée pour userId
const isValidCustomUserId = (userId) => {
  const customUserIdRegex = /^[A-Z]{2}\d{4}$/;
  return customUserIdRegex.test(userId);
};

module.exports = { sendMessage, getMessages, getDiscussions, markAsRead };