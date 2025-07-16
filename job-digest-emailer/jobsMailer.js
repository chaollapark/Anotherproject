require("dotenv").config();
const emailService = require("./services/emailService");
const userService = require("./services/userService");
const jobService = require("./services/jobService");

async function sendJobDigests() {
  try {
    console.log('📧 Starting daily job digest process...');
    
    // Get users who should receive digest today
    const users = await userService.getUsersForDigest();
    
    if (users.length === 0) {
      console.log('✅ No users to send digests to today');
      return;
    }

    console.log(`📬 Found ${users.length} users to send digests to`);

    let successCount = 0;
    let errorCount = 0;

    for (const user of users) {
      try {
        const { email, preferences } = user;
        const { level } = preferences;

        console.log(`📤 Sending digest to ${email} (${level} level)`);

        // Get jobs for this user
        const [latestJobs, featuredJobs] = await Promise.all([
          jobService.getJobsForUser(level, 5),
          jobService.getFeaturedJobs(3)
        ]);

        if (latestJobs.length === 0 && featuredJobs.length === 0) {
          console.log(`⚠️  No jobs available for ${email}, skipping`);
          continue;
        }

        // Send the digest email
        await emailService.sendJobDigest(email, featuredJobs, latestJobs, level);
        
        // Update user's last sent timestamp
        await userService.updateLastSent(email);
        
        successCount++;
        console.log(`✅ Digest sent successfully to ${email}`);
        
        // Add a small delay to avoid overwhelming the email service
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Failed to send digest to ${user.email}:`, error.message);
      }
    }

    console.log(`\n📊 Digest Summary:`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`📧 Total processed: ${users.length}`);

  } catch (error) {
    console.error('❌ Critical error in digest process:', error);
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'send':
    sendJobDigests().then(() => {
      console.log('🎉 Digest process completed');
      process.exit(0);
    }).catch((error) => {
      console.error('💥 Digest process failed:', error);
      process.exit(1);
    });
    break;
    
  case 'test':
    // Test mode - send to a specific email
    const testEmail = args[1];
    if (!testEmail) {
      console.error('❌ Test email required: npm run send-digest test user@example.com');
      process.exit(1);
    }
    
    console.log(`🧪 Testing digest for ${testEmail}`);
    
    // Create a test user
    userService.updateUserPreferences(testEmail, { level: 'junior' })
      .then(() => {
        // Get test jobs
        return Promise.all([
          jobService.getJobsForUser('junior', 3),
          jobService.getFeaturedJobs(2)
        ]);
      })
      .then(([latestJobs, featuredJobs]) => {
        return emailService.sendJobDigest(testEmail, featuredJobs, latestJobs, 'junior');
      })
      .then(() => {
        console.log('✅ Test digest sent successfully');
        process.exit(0);
      })
      .catch((error) => {
        console.error('❌ Test failed:', error);
        process.exit(1);
      });
    break;
    
  default:
    console.log('📧 Job Digest Mailer');
    console.log('');
    console.log('Usage:');
    console.log('  npm run send-digest send     - Send daily digests to all users');
    console.log('  npm run send-digest test <email> - Send test digest to specific email');
    console.log('');
    console.log('Examples:');
    console.log('  npm run send-digest send');
    console.log('  npm run send-digest test user@example.com');
    process.exit(0);
}
