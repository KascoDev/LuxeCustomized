const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Generate password hash
async function generateAdminCredentials() {
  const password = 'admin123'; // Change this to your desired admin password
  const saltRounds = 12;
  
  console.log('🔐 Generating Admin Credentials...\n');
  
  // Generate password hash
  const passwordHash = await bcrypt.hash(password, saltRounds);
  
  // Generate NextAuth secret
  const nextAuthSecret = crypto.randomBytes(32).toString('hex');
  
  console.log('Copy these to your .env.local file:');
  console.log('=====================================');
  console.log(`ADMIN_EMAIL=admin@luxecustomized.com`);
  console.log(`ADMIN_PASSWORD_HASH=${passwordHash}`);
  console.log(`NEXTAUTH_SECRET=${nextAuthSecret}`);
  console.log(`NEXTAUTH_URL=http://localhost:3000`);
  console.log('=====================================\n');
  
  console.log('Admin Login Credentials:');
  console.log('Email: admin@luxecustomized.com');
  console.log(`Password: ${password}`);
  console.log('\n⚠️  Remember to change the password in this script before running!');
}

generateAdminCredentials().catch(console.error);