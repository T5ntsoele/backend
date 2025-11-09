const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

// Get user notifications
router.get('/', async (req, res) => {
  try {
    const notificationsSnapshot = await db.collection('notifications')
      .where('userId', '==', req.user.userType === 'student' ? req.user.studentId : 
            req.user.userType === 'institute' ? req.user.institutionId :
            req.user.userType === 'company' ? req.user.companyId : req.user.email)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();
    
    const notifications = [];
    notificationsSnapshot.forEach(doc => {
      notifications.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark notification as read
router.put('/:notificationId/read', async (req, res) => {
  try {
    await db.collection('notifications').doc(req.params.notificationId).update({
      isRead: true,
      readAt: new Date()
    });
    
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;