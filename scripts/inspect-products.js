const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

async function main() {
  const { data, error } = await sb.from('products').select('*');
  if (error) {
    console.error(error);
    return;
  }
  console.log('Total products in database:', data.length);
  
  // Group by item types / names
  data.forEach(p => {
    console.log(`[${p.id}] ${p.name} | Collection: ${p.collection} | Fabric: ${p.fabric} | Image: ${p.images?.[0]}`);
  });
}

main();
