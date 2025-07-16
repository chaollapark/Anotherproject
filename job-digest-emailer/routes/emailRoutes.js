const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');
const userService = require('../services/userService');

// Send welcome email with preference buttons
router.get('/send-welcome', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ 
        error: 'Email is required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    const domainUrl = process.env.DOMAIN_URL || `http://localhost:${process.env.PORT || 3000}`;
    
    await emailService.sendWelcomeEmail(email, domainUrl);
    
    res.json({ 
      success: true, 
      message: 'Welcome email sent successfully' 
    });
    
  } catch (error) {
    console.error('Error sending welcome email:', error);
    res.status(500).json({ 
      error: 'Failed to send welcome email' 
    });
  }
});

// Handle preference selection
router.get('/preferences', async (req, res) => {
  try {
    const { email, level } = req.query;
    
    if (!email || !level) {
      return res.status(400).json({ 
        error: 'Email and level are required' 
      });
    }

    const validLevels = ['junior', 'middle', 'senior'];
    if (!validLevels.includes(level)) {
      return res.status(400).json({ 
        error: 'Invalid level. Must be junior, middle, or senior' 
      });
    }

    // Update user preferences
    await userService.updateUserPreferences(email, { level });
    
    // Send confirmation email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Preferences Updated! ✅</h2>
        <p style="color: #666; line-height: 1.6;">
          Great! We've updated your preferences to show you <strong>${level}</strong> level jobs.
        </p>
        <p style="color: #666;">
          You'll start receiving daily job digests tomorrow with the latest opportunities matching your preferences.
        </p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">What to expect:</h3>
          <ul style="color: #666;">
            <li>Daily emails with featured and latest ${level} jobs</li>
            <li>Direct links to apply for positions</li>
            <li>Job details including company, location, and salary</li>
          </ul>
        </div>
        <p style="color: #999; font-size: 14px;">
          <a href="${process.env.DOMAIN_URL}/unsubscribe?email=${encodeURIComponent(email)}" 
             style="color: #dc3545; text-decoration: none;">
            Unsubscribe anytime
          </a>
        </p>
      </div>
    `;

    await emailService.sendEmail(email, 'Preferences Updated - EU Jobs', htmlContent);
    
    res.json({ 
      success: true, 
      message: 'Preferences updated successfully' 
    });
    
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ 
      error: 'Failed to update preferences' 
    });
  }
});

// Unsubscribe endpoint
router.get('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ 
        error: 'Email is required' 
      });
    }

    await userService.unsubscribeUser(email);
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Unsubscribed Successfully</h2>
        <p style="color: #666; line-height: 1.6;">
          You've been successfully unsubscribed from EU Jobs daily digest.
        </p>
        <p style="color: #666;">
          We're sorry to see you go! If you change your mind, you can always 
          <a href="${process.env.DOMAIN_URL}/send-welcome?email=${encodeURIComponent(email)}" 
             style="color: #007bff; text-decoration: none;">
            resubscribe here
          </a>.
        </p>
      </div>
    `;

    await emailService.sendEmail(email, 'Unsubscribed - EU Jobs', htmlContent);
    
    res.json({ 
      success: true, 
      message: 'Unsubscribed successfully' 
    });
    
  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).json({ 
      error: 'Failed to unsubscribe' 
    });
  }
});

module.exports = router; 