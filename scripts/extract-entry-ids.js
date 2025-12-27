/**
 * Helper script to extract Google Form entry IDs
 * 
 * Usage:
 * 1. Open your Google Form in a browser
 * 2. Open browser console (F12)
 * 3. Paste this script and run it
 * 4. It will output all entry IDs found in the form
 */

(function() {
  console.log('🔍 Searching for Google Form entry IDs...\n');
  
  // Find all input, textarea, and select elements with entry IDs
  const inputs = document.querySelectorAll('input[name^="entry."], textarea[name^="entry."], select[name^="entry."]');
  
  if (inputs.length === 0) {
    console.log('❌ No entry IDs found. Make sure you are on the Google Form page.');
    console.log('💡 Try: Right-click on the form → Inspect → Look for name="entry.XXXXXXX"');
    return;
  }
  
  console.log(`✅ Found ${inputs.length} form fields:\n`);
  
  const entries = [];
  inputs.forEach((input, index) => {
    const entryId = input.name;
    const label = input.closest('.freebirdFormviewerViewItemsItemItem')?.querySelector('.freebirdFormviewerViewItemsItemItemTitle')?.textContent?.trim() || 
                  input.closest('[role="listitem"]')?.querySelector('[role="heading"]')?.textContent?.trim() ||
                  `Field ${index + 1}`;
    
    entries.push({ entryId, label });
    console.log(`${index + 1}. ${label}`);
    console.log(`   Entry ID: ${entryId}\n`);
  });
  
  console.log('\n📋 Configuration for .env.local:\n');
  console.log('NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_URL=https://docs.google.com/forms/d/e/1FAIpQLScUfpz7Ra8OiWuek6v-UBzNsvex3Q5PtBkOkpwv9mhZboznoA/formResponse');
  console.log(`NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_NAME=${entries[0]?.entryId || 'entry.0'}`);
  console.log(`NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_EMAIL=${entries[1]?.entryId || 'entry.1'}`);
  console.log(`NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_PHONE=${entries[2]?.entryId || 'entry.2'}`);
  console.log(`NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_POSITION=${entries[3]?.entryId || 'entry.3'}`);
  console.log(`NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_EXPERIENCE=${entries[4]?.entryId || 'entry.4'}`);
  console.log(`NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_AVAILABILITY=${entries[5]?.entryId || 'entry.5'}`);
  
  console.log('\n✅ Copy the configuration above to your .env.local file!');
})();

