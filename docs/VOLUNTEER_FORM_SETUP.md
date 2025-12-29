# Volunteer Form Google Forms Setup

Your volunteer application form is ready to be connected to Google Forms!

## Your Form Details

**Form URL:** https://docs.google.com/forms/d/e/1FAIpQLScUfpz7Ra8OiWuek6v-UBzNsvex3Q5PtBkOkpwv9mhZboznoA/viewform

**Form Response URL:** https://docs.google.com/forms/d/e/1FAIpQLScUfpz7Ra8OiWuek6v-UBzNsvex3Q5PtBkOkpwv9mhZboznoA/formResponse

**Form ID:** `1FAIpQLScUfpz7Ra8OiWuek6v-UBzNsvex3Q5PtBkOkpwv9mhZboznoA`

## Quick Setup Steps

### Method 1: Use JavaScript Helper (Easiest) ⭐

1. Open your form: https://docs.google.com/forms/d/e/1FAIpQLScUfpz7Ra8OiWuek6v-UBzNsvex3Q5PtBkOkpwv9mhZboznoA/viewform
2. Open browser console: Press `F12` or right-click → Inspect → Console tab
3. Copy and paste the code from `scripts/extract-entry-ids.js` into the console
4. Press Enter - it will automatically find and display all entry IDs!
5. Copy the generated configuration to your `.env.local` file

### Method 2: Inspect Form HTML (Manual)

1. Open your form: https://docs.google.com/forms/d/e/1FAIpQLScUfpz7Ra8OiWuek6v-UBzNsvex3Q5PtBkOkpwv9mhZboznoA/viewform
2. Right-click anywhere on the form and select **"Inspect"** (or press `F12`)
3. In the Developer Tools, press `Ctrl+F` (or `Cmd+F` on Mac) to search
4. Search for `entry.` - you'll find entries like:
   ```html
   <input name="entry.123456789" ...>
   ```
5. Note down the entry IDs in order:
   - First field (Full Name) = first entry ID
   - Second field (Email) = second entry ID
   - And so on...

### Method 3: Submit Test Response

1. Submit a test response to your form
2. Go to the **Responses** tab in Google Forms
3. Click the **Google Sheets** icon (📊) to view responses in a spreadsheet
4. The column headers will show the entry IDs (e.g., `entry.123456789`)

### Method 4: Use HTML Helper

1. Open `scripts/get-google-form-entries.html` in your browser
2. Enter your form URL and entry IDs
3. Click "Generate Configuration"
4. Copy the generated configuration

## Configuration

Once you have the entry IDs, add them to your `.env.local` file:

```env
# Volunteer Application Form Configuration
NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_URL=https://docs.google.com/forms/d/e/1FAIpQLScUfpz7Ra8OiWuek6v-UBzNsvex3Q5PtBkOkpwv9mhZboznoA/formResponse
NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_NAME=entry.XXXXXXX
NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_EMAIL=entry.XXXXXXX
NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_PHONE=entry.XXXXXXX
NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_POSITION=entry.XXXXXXX
NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_EXPERIENCE=entry.XXXXXXX
NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_AVAILABILITY=entry.XXXXXXX
```

**Replace `entry.XXXXXXX` with your actual entry IDs!**

## Form Fields Mapping

Based on your form structure, the mapping should be:

1. **Full Name** → `NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_NAME`
2. **Email** → `NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_EMAIL`
3. **Phone** → `NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_PHONE`
4. **Position** → `NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_POSITION`
5. **Relevant Experience** → `NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_EXPERIENCE`
6. **Availability** → `NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_AVAILABILITY`

## Testing

After adding the environment variables:

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Test the form:
   - Go to `/volunteer` page
   - Click "Apply Now" on any volunteer position
   - Fill out and submit the form
   - Check your Google Form responses to verify the submission

## Troubleshooting

- **No data appearing in Google Forms?** Double-check your entry IDs match the field order
- **Form not submitting?** Check browser console for errors
- **Entry IDs not working?** Make sure you're using the exact format: `entry.123456789` (with the dot)

## Need Help?

If you're having trouble finding entry IDs, you can:
1. Submit a test response and check the Google Sheets export
2. Use browser developer tools to inspect the form HTML
3. Contact support with your form URL for assistance

