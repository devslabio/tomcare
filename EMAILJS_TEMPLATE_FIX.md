# Fix for Empty Email Messages

## Problem
Emails showing "You got a new message from :" with no content.

## Solution

Your EmailJS template needs to use `{{formatted_message}}` to display all form data.

### Update Your EmailJS Template

1. Go to: https://dashboard.emailjs.com/admin/template
2. Open your template (bwanakweli4ever)
3. Update the template as follows:

**Subject:**
```
New {{form_type}} - TOMCARE Foundation
```

**Body (use this EXACT format):**
```
{{formatted_message}}
```

**OR if you want a custom format:**

```
You received a new {{form_type}} submission:

{{formatted_message}}

---
Submitted: {{timestamp}}
```

### Important: Template Field Configuration

Make sure your template uses:
- **To Email:** Leave empty (uses admin email from service settings) OR set to your admin email
- **From Name:** TOMCARE Foundation
- **Reply To:** tomntambara@gmail.com

### What `formatted_message` Contains

The `formatted_message` automatically includes ALL form fields in a readable format:

**For Volunteer Form:**
```
=== Volunteer Application ===
Submitted: [timestamp]

--- Personal Information ---
Name: [name]
Email: [email]
Phone: [phone]

--- Volunteer Application Details ---
Position: [position]
Experience: [experience]
Availability: [availability]

---
This is an automated message from TOMCARE Foundation website.
```

### Testing

After updating your template:
1. Submit a test volunteer form
2. Check your email - you should see the full formatted message
3. Check browser console (F12) - you'll see logs showing what data is being sent

### Alternative: Use Individual Fields

If your template doesn't support `formatted_message`, you can use individual fields:

**Subject:**
```
New Volunteer Application - {{name}}
```

**Body:**
```
Name: {{name}}
Email: {{email}}
Phone: {{phone}}
Position: {{position}}
Experience: {{experience}}
Availability: {{availability}}

Submitted: {{timestamp}}
```

But `formatted_message` is recommended as it includes ALL fields automatically.

