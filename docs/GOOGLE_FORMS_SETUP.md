# Google Forms Integration Setup

This guide explains how to connect the Contact Us and Volunteer Application forms to Google Forms.

## Prerequisites

1. A Google account
2. Access to create Google Forms

## Step 1: Create Google Forms

### Contact Form

1. Go to [Google Forms](https://forms.google.com)
2. Create a new form titled "Contact Us" or "TOMCARE Contact Form"
3. Add the following fields (in order):
   - **Name** (Short answer)
   - **Email** (Short answer)
   - **Phone** (Short answer) - Optional
   - **Subject** (Dropdown or Short answer)
   - **Message** (Paragraph)

### Volunteer Application Form

1. Create another form titled "Volunteer Application" or "TOMCARE Volunteer Form"
2. Add the following fields (in order):
   - **Full Name** (Short answer)
   - **Email** (Short answer)
   - **Phone** (Short answer) - Optional
   - **Position** (Short answer or Dropdown)
   - **Relevant Experience** (Paragraph)
   - **Availability** (Paragraph)

## Step 2: Get Form URLs and Entry IDs

1. Open your Google Form
2. Click "Send" button (top right)
3. Click the link icon to get the form URL
4. Copy the URL - it should look like:
   ```
   https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform
   ```

5. To get entry IDs:
   - Right-click on the form page and select "Inspect" or "View Page Source"
   - Press `Ctrl+F` (or `Cmd+F` on Mac) to search
   - Search for `entry.` - you'll find entries like `entry.123456789`
   - Note down the entry IDs for each field in order

   **Alternative method:**
   - Fill out the form once and submit
   - View the form responses in Google Sheets
   - The column headers will show the entry IDs

## Step 3: Configure Environment Variables

Create a `.env.local` file in the root of your project (or add to your existing `.env.local`):

```env
# Contact Form Configuration
NEXT_PUBLIC_GOOGLE_FORM_CONTACT_URL=https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse
NEXT_PUBLIC_GOOGLE_FORM_CONTACT_ENTRY_NAME=entry.123456789
NEXT_PUBLIC_GOOGLE_FORM_CONTACT_ENTRY_EMAIL=entry.987654321
NEXT_PUBLIC_GOOGLE_FORM_CONTACT_ENTRY_PHONE=entry.111222333
NEXT_PUBLIC_GOOGLE_FORM_CONTACT_ENTRY_SUBJECT=entry.444555666
NEXT_PUBLIC_GOOGLE_FORM_CONTACT_ENTRY_MESSAGE=entry.777888999

# Volunteer Application Form Configuration
NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_URL=https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse
NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_NAME=entry.123456789
NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_EMAIL=entry.987654321
NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_PHONE=entry.111222333
NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_POSITION=entry.444555666
NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_EXPERIENCE=entry.777888999
NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEER_ENTRY_AVAILABILITY=entry.101112131
```

**Important Notes:**
- Replace `YOUR_FORM_ID` with your actual form ID from the URL
- Replace all `entry.XXXXXXX` values with your actual entry IDs
- The form URL must end with `/formResponse` (not `/viewform`)
- All environment variables must start with `NEXT_PUBLIC_` to be accessible in the browser

## Step 4: Test the Integration

1. Restart your development server after adding environment variables:
   ```bash
   npm run dev
   ```

2. Test the Contact Form:
   - Go to `/contact` page
   - Fill out and submit the form
   - Check your Google Form responses to verify the submission

3. Test the Volunteer Application:
   - Go to `/volunteer` page or homepage
   - Click "Apply Now" on any volunteer position
   - Fill out and submit the form
   - Check your Google Form responses to verify the submission

## Troubleshooting

### Forms not submitting to Google Forms

1. **Check environment variables:**
   - Ensure all variables are set correctly
   - Restart the development server after changes
   - Check browser console for warnings

2. **Verify form URLs:**
   - Make sure URLs end with `/formResponse`
   - Verify the form ID is correct

3. **Check entry IDs:**
   - Ensure entry IDs match the field order in your Google Form
   - Entry IDs are case-sensitive

4. **CORS issues:**
   - Google Forms uses `no-cors` mode, so you won't see response details
   - If submission appears successful but no data appears, check entry IDs

### Fallback Behavior

If Google Forms is not configured, the forms will:
- **Contact Form:** Fall back to the API route (`/api/contact`)
- **Volunteer Form:** Show success message (data logged to console)

## Viewing Form Responses

1. Open your Google Form
2. Click "Responses" tab
3. View responses in the form or click the Google Sheets icon to view in a spreadsheet

## Security Notes

- Google Forms URLs and entry IDs are public (they're in the frontend code)
- This is normal and expected - Google Forms are designed to accept public submissions
- Do not store sensitive information in form responses
- Consider adding CAPTCHA to your Google Forms for spam protection

