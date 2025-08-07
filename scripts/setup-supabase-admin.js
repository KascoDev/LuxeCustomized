const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function setupSupabaseAdmin() {
  console.log('🔐 Setting up Supabase Admin User...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Missing Supabase configuration');
    console.log('Please ensure you have the following in your .env.local file:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co');
    console.log('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const adminEmail = 'admin@luxecustomized.com';
  const adminPassword = 'admin123'; // Change this to your desired password

  console.log(`Creating admin user: ${adminEmail}`);

  try {
    // Create admin user
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        name: 'Admin'
      }
    });

    if (error) {
      if (error.message.includes('already registered') || error.message.includes('already been registered')) {
        console.log('✅ Admin user already exists, checking/updating role...');
        
        // Try to update the user's metadata to ensure they have admin role
        const { data: users, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) {
          console.error('❌ Error listing users:', listError.message);
          return;
        }

        const adminUser = users.users.find(user => user.email === adminEmail);
        if (adminUser) {
          console.log('Current user metadata:', JSON.stringify(adminUser.user_metadata, null, 2));
          
          const { error: updateError } = await supabase.auth.admin.updateUserById(adminUser.id, {
            user_metadata: {
              role: 'admin',
              name: 'Admin'
            }
          });

          if (updateError) {
            console.error('❌ Error updating admin user:', updateError.message);
          } else {
            console.log('✅ Admin user role updated successfully');
            
            // Verify the update
            const { data: updatedUser, error: fetchError } = await supabase.auth.admin.getUserById(adminUser.id);
            if (!fetchError && updatedUser) {
              console.log('✅ Updated user metadata:', JSON.stringify(updatedUser.user.user_metadata, null, 2));
            }
          }
        } else {
          console.error('❌ Admin user not found in user list');
        }
      } else {
        console.error('❌ Error creating admin user:', error.message);
        return;
      }
    } else {
      console.log('✅ Admin user created successfully');
      console.log('User ID:', data.user.id);
    }

    console.log('\n=====================================');
    console.log('Admin Login Credentials:');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('=====================================\n');
    console.log('⚠️  Important: Change the password in this script for production use!');
    console.log('🎉 Setup complete! You can now log in to the admin panel.');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

setupSupabaseAdmin().catch(console.error);