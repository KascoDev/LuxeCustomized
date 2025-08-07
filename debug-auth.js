const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testAuth() {
  console.log('🔐 Testing Supabase Authentication...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables');
    return;
  }

  console.log('✅ Environment variables loaded');
  console.log('URL:', supabaseUrl);
  console.log('Anon Key:', supabaseAnonKey.substring(0, 20) + '...');

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    console.log('\n🔍 Testing login...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'admin@luxecustomized.com',
      password: 'admin123',
    });

    if (error) {
      console.error('❌ Login error:', error.message);
      return;
    }

    console.log('✅ Login successful!');
    console.log('User ID:', data.user?.id);
    console.log('Email:', data.user?.email);
    console.log('User metadata:', JSON.stringify(data.user?.user_metadata, null, 2));
    
    console.log('\n🔍 Testing session retrieval...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError.message);
      return;
    }

    if (sessionData.session) {
      console.log('✅ Session found!');
      console.log('Access token present:', !!sessionData.session.access_token);
      console.log('User in session:', !!sessionData.session.user);
      console.log('Role in session:', sessionData.session.user?.user_metadata?.role);
    } else {
      console.log('❌ No session found');
    }

    console.log('\n🚪 Signing out...');
    await supabase.auth.signOut();
    console.log('✅ Signed out successfully');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAuth().catch(console.error);