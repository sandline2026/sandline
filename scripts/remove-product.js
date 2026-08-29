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
  console.log('Searching for Riviera Pinstripe Ruched Midi Dress in database...');
  const { data, error } = await sb
    .from('products')
    .select('id, name, slug, is_active')
    .ilike('name', '%Riviera Pinstripe%');

  if (error) {
    console.error('Error querying product:', error);
    return;
  }

  console.log('Found matching products:', data);

  if (data && data.length > 0) {
    for (const p of data) {
      console.log(`Deactivating product [${p.id}] ${p.name}...`);
      const { error: updateError } = await sb
        .from('products')
        .update({ is_active: false })
        .eq('id', p.id);

      if (updateError) {
        console.error('Failed to deactivate:', updateError);
      } else {
        console.log(`Successfully deactivated [${p.id}] ${p.name}`);
      }
    }
  } else {
    // Check by slug
    const { data: bySlug } = await sb
      .from('products')
      .select('id, name, slug')
      .ilike('slug', '%riviera-pinstripe%');
    console.log('Found by slug:', bySlug);
    if (bySlug && bySlug.length > 0) {
      for (const p of bySlug) {
        await sb.from('products').update({ is_active: false }).eq('id', p.id);
        console.log(`Deactivated by slug: ${p.name}`);
      }
    }
  }
}

main();
