#!/usr/bin/env node

/**
 * Helper script to update EmailJS template IDs in .env.local
 * 
 * Usage:
 *   node scripts/update-emailjs-template.js <template_id>
 * 
 * Example:
 *   node scripts/update-emailjs-template.js template_abc123xyz
 */

const fs = require('fs');
const path = require('path');

const templateId = process.argv[2];

if (!templateId) {
  console.error('❌ Error: Template ID is required');
  console.log('\nUsage: node scripts/update-emailjs-template.js <template_id>');
  console.log('Example: node scripts/update-emailjs-template.js template_abc123xyz');
  process.exit(1);
}

if (!templateId.startsWith('template_')) {
  console.error('❌ Error: Template ID must start with "template_"');
  console.log('Example: template_abc123xyz');
  process.exit(1);
}

const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  console.error('❌ Error: .env.local file not found');
  process.exit(1);
}

// Read .env.local
let envContent = fs.readFileSync(envPath, 'utf8');

// Update all template IDs
const updates = {
  'NEXT_PUBLIC_EMAILJS_TEMPLATE_CONTACT': templateId,
  'NEXT_PUBLIC_EMAILJS_TEMPLATE_VOLUNTEER': templateId,
  'NEXT_PUBLIC_EMAILJS_TEMPLATE_REGISTER': templateId,
  'NEXT_PUBLIC_EMAILJS_TEMPLATE_DONATE': templateId,
};

let updated = false;

for (const [key, value] of Object.entries(updates)) {
  // Check if the key exists
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(envContent)) {
    envContent = envContent.replace(regex, `${key}=${value}`);
    updated = true;
    console.log(`✅ Updated ${key} = ${value}`);
  } else {
    // Add if it doesn't exist
    envContent += `\n${key}=${value}\n`;
    console.log(`✅ Added ${key} = ${value}`);
    updated = true;
  }
}

if (updated) {
  // Write back to .env.local
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('\n✅ Successfully updated .env.local');
  console.log('\n📝 Next steps:');
  console.log('   1. Restart your dev server: npm run dev');
  console.log('   2. Test at: http://localhost:3000/test-emailjs');
} else {
  console.log('⚠️  No changes made. Template IDs may already be set.');
}

