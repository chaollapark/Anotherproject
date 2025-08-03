/**
 * Email Tests Runner
 * This script runs both email test scripts to verify Brevo integration
 * Run with: pnpm tsx src/tests/run-email-tests.ts
 */

import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

// Configuration
const TEST_FILES = [
  'test-email-job.ts',
  'test-cv-upload-email.ts'
];

async function runTests() {
  console.log('🚀 Starting Brevo Email Tests');
  console.log('================================');
  
  for (const testFile of TEST_FILES) {
    const testPath = path.join(__dirname, testFile);
    console.log(`\n🧪 Running test: ${testFile}`);
    console.log('-----------------------------------');
    
    try {
      const { stdout, stderr } = await execPromise(`pnpm tsx ${testPath}`);
      
      if (stderr) {
        console.error(`❌ Error output: ${stderr}`);
      }
      
      console.log(stdout);
      console.log('✅ Test completed successfully');
    } catch (error) {
      const err = error as { stderr?: string };
      console.error('❌ Test failed:', err.stderr || error);
    }
    
    console.log('-----------------------------------');
  }
  
  console.log('\n📝 Test Summary');
  console.log('===================================');
  console.log('⚠️ Important: Before running these tests, make sure to:');
  console.log('1. Add your BREVO_API_KEY to the .env file');
  console.log('2. Set up a verified sender domain in Brevo (eujobs.online)');
  console.log('3. Update the TEST_EMAIL variable in both test files with your test email');
  console.log('4. Update the TEST_JOB_SLUG in the job test with a valid job slug');
}

runTests();
