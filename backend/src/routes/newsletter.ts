import express from 'express';
import authenticateToken from '../middleware/auth';

const router = express.Router();

// Simple in-memory storage for newsletter subscriptions
// In a real application, you would use a database
interface Subscriber {
  email: string;
  subscribedAt: Date;
  notified: boolean;
}

const subscribers: Subscriber[] = [];

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    // Check if email already exists
    if (subscribers.some(sub => sub.email === email.toLowerCase())) {
      return res.status(409).json({ message: 'This email is already subscribed to our newsletter' });
    }

    // Add email to subscribers list with timestamp
    const newSubscriber: Subscriber = {
      email: email.toLowerCase(),
      subscribedAt: new Date(),
      notified: false
    };
    subscribers.push(newSubscriber);
    
    console.log(`New newsletter subscription: ${email}`);
    console.log(`Total subscribers: ${subscribers.length}`);

    res.json({ 
      message: 'Successfully subscribed to newsletter',
      email: email
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ message: 'Error subscribing to newsletter' });
  }
});

// Get recent subscriptions for notifications (requires authentication)
router.get('/notifications', authenticateToken, (req, res) => {
  try {
    // Get unnotified subscriptions (last 20)
    const recentSubscriptions = subscribers
      .filter(sub => !sub.notified)
      .slice(-20)
      .reverse()
      .map(sub => ({
        email: sub.email,
        subscribedAt: sub.subscribedAt,
        message: `New subscriber: ${sub.email} joined the newsletter`
      }));

    res.json({
      notifications: recentSubscriptions,
      count: recentSubscriptions.length,
      message: 'Notifications retrieved successfully'
    });
  } catch (error) {
    console.error('Newsletter notifications error:', error);
    res.status(500).json({ message: 'Error retrieving notifications' });
  }
});

// Mark notifications as read
router.post('/notifications/mark-read', authenticateToken, (req, res) => {
  try {
    // Mark all as notified
    subscribers.forEach(sub => {
      sub.notified = true;
    });

    res.json({ 
      message: 'All notifications marked as read',
      count: subscribers.length
    });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ message: 'Error marking notifications as read' });
  }
});

// Get subscriber count (optional endpoint for admin purposes)
router.get('/stats', (req, res) => {
  try {
    res.json({
      totalSubscribers: subscribers.length,
      message: 'Newsletter statistics retrieved successfully'
    });
  } catch (error) {
    console.error('Newsletter stats error:', error);
    res.status(500).json({ message: 'Error retrieving newsletter statistics' });
  }
});

// Unsubscribe from newsletter (optional)
router.post('/unsubscribe', (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const index = subscribers.findIndex(sub => sub.email === email.toLowerCase());
    if (index > -1) {
      subscribers.splice(index, 1);
      console.log(`Unsubscribed: ${email}`);
      res.json({ message: 'Successfully unsubscribed from newsletter' });
    } else {
      res.status(404).json({ message: 'Email not found in subscriber list' });
    }

  } catch (error) {
    console.error('Newsletter unsubscription error:', error);
    res.status(500).json({ message: 'Error unsubscribing from newsletter' });
  }
});

export default router;