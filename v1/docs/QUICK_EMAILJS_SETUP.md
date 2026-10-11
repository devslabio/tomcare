# Quick EmailJS Setup Guide

## Step 1: Create Your First Email Template

1. **Go to EmailJS Dashboard**: https://dashboard.emailjs.com/admin/template
2. **Click "Create New Template"**
3. **Name it**: `All Forms` (or any name you like)
4. **Set up the email template**:

### Email Subject:
```
New Form Submission - {{form_type}}
```

### Email Body:
```
Form Type: {{form_type}}
Timestamp: {{timestamp}}

{{name}}
{{email}}
{{phone}}
{{subject}}
{{message}}
{{position}}
{{experience}}
{{availability}}
{{firstName}}
{{lastName}}
{{dateOfBirth}}
{{gender}}
{{maritalStatus}}
{{address}}
{{city}}
{{province}}
{{postalCode}}
{{situation}}
{{needsAssistance}}
{{arrivalDate}}
{{skills}}
{{language}}
{{amount}}
{{cause}}
{{frequency}}
{{custom_amount}}
{{registration_type}}
{{needsInterpreter}}
{{agreedToTerms}}
```

5. **Click "Save"**
6. **Copy the Template ID** - it will look like `template_abc123xyz`

## Step 2: Update .env.local

Open your `.env.local` file and replace ALL template IDs with your single template ID:

```env
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_77uejgm
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=T0pFpR16bzX1qUc5n

# Use the same template for all forms (replace template_xxxxxxx with your actual template ID)
NEXT_PUBLIC_EMAILJS_TEMPLATE_CONTACT=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_VOLUNTEER=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_REGISTER=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_DONATE=template_xxxxxxx
```

**Example** (if your template ID is `template_abc123xyz`):
```env
NEXT_PUBLIC_EMAILJS_TEMPLATE_CONTACT=template_abc123xyz
NEXT_PUBLIC_EMAILJS_TEMPLATE_VOLUNTEER=template_abc123xyz
NEXT_PUBLIC_EMAILJS_TEMPLATE_REGISTER=template_abc123xyz
NEXT_PUBLIC_EMAILJS_TEMPLATE_DONATE=template_abc123xyz
```

## Step 3: Restart Your Server

After updating `.env.local`, restart your development server:

```bash
# Stop the server (Ctrl+C) then:
npm run dev
```

## Step 4: Test

1. Visit: http://localhost:3000/test-emailjs
2. Click "Test Contact Template"
3. Check your email inbox!

## Troubleshooting

### Where to find Template ID?
- Go to EmailJS Dashboard → Email Templates
- Click on your template
- The Template ID is shown at the top (starts with `template_`)

### Template ID not working?
- Make sure you copied the ENTIRE template ID (including `template_`)
- No spaces before or after
- Restart your dev server after updating `.env.local`

### Still getting errors?
- Check browser console (F12) for detailed error messages
- Visit `/test-emailjs` page to see your configuration
- Verify your Service ID and Public Key are correct

## Optional: Create Separate Templates

If you want different email formats for each form type, create 4 separate templates and use different template IDs for each form in `.env.local`.

