# EmailJS Setup Guide

This guide will help you set up EmailJS to receive form submissions via email instead of Google Forms.

## Prerequisites

- EmailJS account (sign up at https://www.emailjs.com/)
- Email service connected (Gmail, Outlook, etc.)

## Step 1: Get Your Credentials

You already have:
- **Service ID**: `service_77uejgm`
- **Public Key**: `T0pFpR16bzX1qUc5n`
- **Private Key**: `MMbZNRVR_9uVv6R-6IdLu` (keep this secret, not used in frontend)

## Step 2: Create Email Templates

You need to create 4 email templates in your EmailJS dashboard:

### 1. Contact Form Template

1. Go to EmailJS Dashboard → Email Templates
2. Click "Create New Template"
3. Name it: `Contact Form` (or any name)
4. Copy the Template ID (e.g., `template_xxxxxxx`)
5. Set up the email template with these variables:

```
Subject: New Contact Form Submission

Body:
Form Type: {{form_type}}
Timestamp: {{timestamp}}

Name: {{name}}
Email: {{email}}
Phone: {{phone}}
Subject: {{subject}}
Message: {{message}}
```

### 2. Volunteer Application Template

1. Create a new template
2. Name it: `Volunteer Application`
3. Copy the Template ID
4. Set up with these variables:

```
Subject: New Volunteer Application

Body:
Form Type: {{form_type}}
Timestamp: {{timestamp}}

Name: {{name}}
Email: {{email}}
Phone: {{phone}}
Position: {{position}}
Experience: {{experience}}
Availability: {{availability}}
```

### 3. Registration Form Template

1. Create a new template
2. Name it: `Registration Form`
3. Copy the Template ID
4. Set up with these variables:

```
Subject: New Registration - {{form_type}}

Body:
Form Type: {{form_type}}
Registration Type: {{registration_type}}
Timestamp: {{timestamp}}

Personal Information:
- First Name: {{firstName}}
- Last Name: {{lastName}}
- Email: {{email}}
- Phone: {{phone}}
- Date of Birth: {{dateOfBirth}}
- Gender: {{gender}}
- Marital Status: {{maritalStatus}}
- Number of Dependents: {{numberOfDependents}}

Contact Information:
- Address: {{address}}
- City: {{city}}
- Province: {{province}}
- Postal Code: {{postalCode}}

Additional Information:
- Situation: {{situation}}
- Needs Assistance: {{needsAssistance}}
- Arrival Date: {{arrivalDate}}
- Skills: {{skills}}
- Experience: {{experience}}
- Language: {{language}}
- Needs Interpreter: {{needsInterpreter}}
- Agreed to Terms: {{agreedToTerms}}
```

### 4. Donation Form Template

1. Create a new template
2. Name it: `Donation Inquiry`
3. Copy the Template ID
4. Set up with these variables:

```
Subject: New Donation Inquiry

Body:
Form Type: {{form_type}}
Timestamp: {{timestamp}}

Amount: {{amount}}
Custom Amount: {{custom_amount}}
Cause: {{cause}}
Frequency: {{frequency}}
```

## Step 3: Configure Environment Variables

Add these to your `.env.local` file:

```env
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_77uejgm
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=T0pFpR16bzX1qUc5n

# EmailJS Template IDs (replace with your actual template IDs)
NEXT_PUBLIC_EMAILJS_TEMPLATE_CONTACT=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_VOLUNTEER=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_REGISTER=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_DONATE=template_xxxxxxx
```

**Important**: Replace `template_xxxxxxx` with the actual Template IDs you copied from EmailJS dashboard.

## Step 4: Test Your Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Test each form:
   - Contact form: `/contact`
   - Volunteer form: Home page → "Be Volunteer" section
   - Registration form: `/register`
   - Donation form: Click "Donate Now" button

3. Check your email inbox for the submissions

## Troubleshooting

### Emails not being received?

1. **Check EmailJS Dashboard → Email History**
   - See if emails are being sent
   - Check for any error messages

2. **Verify Template IDs**
   - Make sure Template IDs in `.env.local` match your EmailJS dashboard
   - Template IDs should start with `template_`

3. **Check Email Service Connection**
   - Go to EmailJS Dashboard → Email Services
   - Ensure your email service is connected and active

4. **Check Browser Console**
   - Open browser DevTools (F12)
   - Check Console tab for any errors
   - Check Network tab for failed requests

5. **Verify Environment Variables**
   - Make sure `.env.local` is in the project root
   - Restart the dev server after changing `.env.local`
   - Variables must start with `NEXT_PUBLIC_` to be accessible in the browser

### Template Variables Not Showing?

- Make sure variable names in your EmailJS template match exactly (case-sensitive)
- Use double curly braces: `{{variable_name}}`
- Check the `formatFormDataForEmail` function in `lib/emailjs.ts` to see what variables are being sent

## Auto-Reply Setup (Optional)

You can set up auto-reply emails for each template:

1. Go to EmailJS Dashboard → Email Templates
2. Open your template
3. Go to "Auto-Reply" tab
4. Link an auto-reply template
5. Save

See: https://www.emailjs.com/docs/user-guide/auto-reply/

## Free Tier Limits

EmailJS free tier includes:
- 200 emails per month
- Basic email templates
- Email history (30 days)

For more emails, consider upgrading your plan.

