// Complete Environment Setup Script
// Run with: node scripts/setup-env.js

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function setupEnvironment() {
  console.log('🚀 LuxeCustomized Environment Setup');
  console.log('=====================================\n');

  // Get admin email
  const adminEmail = await new Promise((resolve) => {
    rl.question('Enter your admin email (default: admin@luxecustomized.com): ', (answer) => {
      resolve(answer || 'admin@luxecustomized.com');
    });
  });

  // Get admin password
  const adminPassword = await new Promise((resolve) => {
    rl.question('Enter your admin password (default: admin123): ', (answer) => {
      resolve(answer || 'admin123');
    });
  });

  // Generate values
  console.log('\n⏳ Generating secure values...\n');
  
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const nextAuthSecret = crypto.randomBytes(32).toString('hex');

  console.log('✅ Environment Configuration:');
  console.log('=====================================');
  console.log(`ADMIN_EMAIL=${adminEmail}`);
  console.log(`ADMIN_PASSWORD_HASH=${passwordHash}`);
  console.log(`NEXTAUTH_SECRET=${nextAuthSecret}`);
  console.log('NEXTAUTH_URL=http://localhost:3000');
  console.log('=====================================\n');
  
  console.log('📋 Next Steps:');
  console.log('1. Copy the values above to your .env.local file');
  console.log('2. Set up your database URL');
  console.log('3. Add your Stripe keys');
  console.log('4. Add your Resend API key');
  console.log('\n🎉 Setup complete! You can now login with:');
  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);

  rl.close();
}

setupEnvironment().catch(console.error);