// Generate Admin Password Hash
// Run with: node scripts/generate-password.js

const bcrypt = require('bcryptjs');

async function generatePasswordHash() {
  // Change this to your desired password
  const password = 'YourSecurePassword123!';
  
  const saltRounds = 12;
  const hash = await bcrypt.hash(password, saltRounds);
  
  console.log('=================================');
  console.log('🔑 ADMIN PASSWORD SETUP');
  console.log('=================================');
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('');
  console.log('Copy this hash to your .env.local:');
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
  console.log('=================================');
}

generatePasswordHash().catch(console.error);