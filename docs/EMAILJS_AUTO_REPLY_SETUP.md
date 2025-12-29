# EmailJS Auto-Reply Setup Guide

## How It Works

When a user submits a form:
1. **Admin receives** an email with all form details (formatted message)
2. **Sender receives** an auto-reply confirmation email

## EmailJS Template Configuration

### For Admin Notification (Main Template)

Your main template should send TO your admin email (configured in EmailJS service settings).

**Subject:**
```
New Form Submission - {{form_type}}
```

**Body:**
```
{{formatted_message}}
```

**Recipient:** Your admin email (set in EmailJS service)

---

### For Auto-Reply to Sender

You have two options:

#### Option 1: Use the Same Template with Dynamic Recipient (Recommended)

Update your template to support both admin notifications and auto-replies:

**Subject:**
```
{{subject}}
```

**Body:**
```
{{formatted_message}}
```

**Important EmailJS Template Settings:**
- In your EmailJS template, set the "To Email" field to: `{{to_email}}`
- This allows the template to send to different recipients based on the `to_email` parameter

**How it works:**
- Admin notification: `to_email` = your admin email (or leave empty to use service default)
- Auto-reply: `to_email` = sender's email address

#### Option 2: Create a Separate Auto-Reply Template

1. Create a new template in EmailJS Dashboard
2. Name it: "Auto-Reply"
3. Copy the Template ID
4. Update `lib/emailjs.ts` to use this template for auto-replies

**Auto-Reply Template Subject:**
```
Thank You for Your {{form_type}} - TOMCARE Foundation
```

**Auto-Reply Template Body:**
```
Dear {{to_name}},

Thank you for contacting TOMCARE Foundation. We have received your {{form_type}} and will get back to you as soon as possible.

Our team is committed to supporting newcomers and individuals in need. We appreciate your interest and will review your submission promptly.

If you have any urgent questions, please contact us at:
- Phone: 4387733653
- Email: tomntambara@gmail.com

Best regards,
TOMCARE Foundation Team
```

**Template Settings:**
- To Email: `{{to_email}}` (this sends to the form submitter)
- From Name: TOMCARE Foundation
- Reply To: tomntambara@gmail.com

## EmailJS Service Configuration

### Enable Dynamic Recipients

1. Go to EmailJS Dashboard → Email Services
2. Click on your service (service_77uejgm)
3. Make sure "Allow dynamic recipients" or similar option is enabled
4. This allows using `{{to_email}}` to send to different email addresses

### Service Settings

- **Default To Email:** Your admin email (tomntambara@gmail.com)
- **From Name:** TOMCARE Foundation
- **Reply To:** tomntambara@gmail.com

## Testing

1. Submit a test form with your email address
2. Check **your inbox** (admin) - should receive formatted submission
3. Check **sender's inbox** - should receive auto-reply confirmation

## Troubleshooting

### Auto-reply not sending to sender?

1. **Check EmailJS Service Settings:**
   - Ensure "Allow dynamic recipients" is enabled
   - Some email services (like Gmail) may require additional setup

2. **Check Template Configuration:**
   - Make sure `{{to_email}}` is set in the "To Email" field
   - Verify the template is using the correct field

3. **Check Browser Console:**
   - Look for "📧 Sending auto-reply to sender:" log
   - Check for any error messages

4. **Check EmailJS Dashboard:**
   - Go to Email History
   - See if auto-reply emails are being sent
   - Check for any error messages

### Auto-reply going to wrong email?

- Verify `to_email` parameter is being set correctly
- Check that the template's "To Email" field uses `{{to_email}}`
- Some email services may override the recipient - check service settings

## Current Implementation

The system automatically:
- Sends admin notification with `formatted_message` containing all fields
- Sends auto-reply to sender using `to_email` parameter
- Auto-reply only sends if form includes an email field
- Auto-reply failures don't prevent main email from being sent

## Notes

- Auto-reply uses the same template as contact form (can be customized)
- Auto-reply is sent asynchronously (doesn't block main email)
- Donation forms don't send auto-reply (no email field)
- All other forms (Contact, Volunteer, Register) send auto-reply

