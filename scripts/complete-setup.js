// Complete LuxeCustomized Environment Setup
// Run with: node scripts/complete-setup.js

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function ask(question, defaultValue = '') {
  return new Promise((resolve) => {
    const prompt = defaultValue ? `${question} (default: ${defaultValue}): ` : `${question}: `;
    rl.question(prompt, (answer) => {
      resolve(answer || defaultValue);
    });
  });
}

async function completeSetup() {
  console.log('🚀 LuxeCustomized Complete Environment Setup');
  console.log('=============================================\n');

  // Admin Setup
  console.log('👤 Admin Account Setup');
  console.log('----------------------');
  const adminEmail = await ask('Admin email', 'admin@luxecustomized.com');
  const adminPassword = await ask('Admin password', 'admin123');
  
  console.log('\n⏳ Generating admin credentials...');
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const nextAuthSecret = crypto.randomBytes(32).toString('hex');

  // Database Setup
  console.log('\n🗄️ Database Setup');
  console.log('----------------');
  console.log('Choose your database provider:');
  console.log('1. Supabase (FREE - Recommended for starting)');
  console.log('2. Vercel Postgres (Paid - Production ready)');
  console.log('3. Other PostgreSQL');
  
  const dbChoice = await ask('Enter choice (1-3)', '1');
  let databaseUrl = '';
  
  if (dbChoice === '1') {
    console.log('\n📋 Supabase Setup Instructions:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Create new project');
    console.log('3. Go to Settings → Database');
    console.log('4. Copy the connection string');
    databaseUrl = await ask('Paste your Supabase DATABASE_URL');
  } else if (dbChoice === '2') {
    console.log('\n📋 Vercel Postgres Setup Instructions:');
    console.log('1. Go to https://vercel.com/dashboard');
    console.log('2. Create/select project → Storage → Create Database');
    console.log('3. Copy connection string from .env.local tab');
    databaseUrl = await ask('Paste your Vercel Postgres DATABASE_URL');
  } else {
    databaseUrl = await ask('Enter your PostgreSQL DATABASE_URL');
  }

  // Stripe Setup
  console.log('\n💳 Stripe Setup');
  console.log('---------------');
  console.log('📋 Setup Instructions:');
  console.log('1. Go to https://stripe.com and create account');
  console.log('2. Go to Developers → API Keys');
  console.log('3. Copy your keys (use test keys for development)');
  
  const stripeSecret = await ask('Stripe SECRET key (sk_test_...)');
  const stripePublic = await ask('Stripe PUBLISHABLE key (pk_test_...)');
  const stripeWebhook = await ask('Stripe WEBHOOK secret (whsec_...) - optional for now', 'whsec_placeholder');

  // Email Setup
  console.log('\n📧 Email Setup (Resend)');
  console.log('----------------------');
  console.log('📋 Setup Instructions:');
  console.log('1. Go to https://resend.com and create account');
  console.log('2. Go to API Keys → Create API Key');
  console.log('3. Copy your API key');
  
  const resendKey = await ask('Resend API key (re_...)');

  // Storage Setup
  console.log('\n📁 Storage Setup');
  console.log('----------------');
  console.log('Choose your storage provider:');
  console.log('1. Supabase Storage (FREE - 1GB)');
  console.log('2. Vercel Blob (Automatic with Vercel)');
  
  const storageChoice = await ask('Enter choice (1-2)', '1');
  let storageConfig = '';
  
  if (storageChoice === '1') {
    console.log('\n📋 Supabase Storage Setup:');
    console.log('1. In your Supabase project, go to Settings → API');
    console.log('2. Copy the Project URL and API keys');
    
    const supabaseUrl = await ask('Supabase Project URL (https://xxx.supabase.co)');
    const supabaseAnonKey = await ask('Supabase anon public key');
    const supabaseServiceKey = await ask('Supabase service_role secret key');
    
    storageConfig = `
# Supabase Storage Configuration
NEXT_PUBLIC_SUPABASE_URL="${supabaseUrl}"
NEXT_PUBLIC_SUPABASE_ANON_KEY="${supabaseAnonKey}"
SUPABASE_SERVICE_ROLE_KEY="${supabaseServiceKey}"`;
  } else {
    storageConfig = `
# Vercel Blob Storage (automatic with Vercel deployment)
# No additional configuration needed`;
  }

  // Generate .env.local content
  const envContent = `# LuxeCustomized Environment Configuration
# Generated on ${new Date().toISOString()}

# Admin Credentials
ADMIN_EMAIL=${adminEmail}
ADMIN_PASSWORD_HASH=${passwordHash}

# NextAuth Configuration
NEXTAUTH_SECRET=${nextAuthSecret}
NEXTAUTH_URL=http://localhost:3000

# Database Configuration
DATABASE_URL="${databaseUrl}"

# Stripe Configuration
STRIPE_SECRET_KEY="${stripeSecret}"
STRIPE_PUBLISHABLE_KEY="${stripePublic}"
STRIPE_WEBHOOK_SECRET="${stripeWebhook}"

# Email Service Configuration
RESEND_API_KEY="${resendKey}"
${storageConfig}

# Optional: Analytics & Monitoring
# GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
# SENTRY_DSN="your_sentry_dsn"
`;

  // Write to file
  fs.writeFileSync('.env.local', envContent);

  console.log('\n✅ Setup Complete!');
  console.log('==================');
  console.log('📁 Configuration saved to .env.local');
  console.log('\n🔑 Your Admin Login:');
  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
  
  console.log('\n🚀 Next Steps:');
  console.log('1. Run: npm run db:push (to setup database)');
  console.log('2. Run: npm run dev (to start development server)');
  console.log('3. Visit: http://localhost:3000/admin/login');
  console.log('4. Start adding your products!');
  
  console.log('\n📝 Important Notes:');
  console.log('- Never commit .env.local to git');
  console.log('- Use different values for production');
  console.log('- Test your Stripe webhook after deployment');

  rl.close();
}

completeSetup().catch(console.error);