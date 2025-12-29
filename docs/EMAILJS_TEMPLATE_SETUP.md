# EmailJS Template Setup with Formatted Message & Auto-Reply

## Email Template Configuration

Your EmailJS template should include the `formatted_message` variable which contains all form fields in a well-formatted, readable format.

### Email Template Subject:
```
New Form Submission - {{form_type}}
```

### Email Template Body (Recommended):
```
{{formatted_message}}
```

**OR** if you want to customize the format, you can use individual fields:

```
Form Type: {{form_type}}
Timestamp: {{timestamp}}

{{formatted_message}}

---
Individual Fields (if needed):
Name: {{name}}
Email: {{email}}
Phone: {{phone}}
Subject: {{subject}}
Message: {{message}}
```

## Auto-Reply Setup

Auto-reply emails are automatically sent to users who submit forms with an email address. To set up auto-reply:

### Option 1: Use the Same Template (Quick Setup)

The system will use your main template for auto-replies. Make sure your template includes:
- `to_email` - recipient email
- `to_name` - recipient name
- `reply_message` - the auto-reply message

### Option 2: Create a Dedicated Auto-Reply Template (Recommended)

1. Go to EmailJS Dashboard → Email Templates
2. Create a new template named "Auto-Reply"
3. Copy the Template ID
4. Update `lib/emailjs.ts` to use this template for auto-replies

**Auto-Reply Template Subject:**
```
Thank You for Contacting TOMCARE Foundation
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

## What Fields Are Included in formatted_message?

The `formatted_message` automatically includes:

### Contact Form:
- Personal Information (Name, Email, Phone)
- Subject
- Message

### Volunteer Form:
- Personal Information (Name, Email, Phone)
- Position
- Experience
- Availability

### Registration Form:
- Personal Information (First Name, Last Name, Email, Phone, Date of Birth, Gender, Marital Status, Dependents)
- Contact Information (Address, City, Province, Postal Code)
- Registration Details (Type, Situation, Needs Assistance, Arrival Date, Skills, Experience, Language, Interpreter Needs)

### Donation Form:
- Amount/Custom Amount
- Cause
- Frequency

## Testing

1. Submit a test form
2. Check your email inbox for the formatted submission
3. Check the sender's email inbox for the auto-reply (if email was provided)

## Notes

- Auto-reply is only sent if the form includes an email field
- Auto-reply failures won't prevent the main email from being sent
- The formatted message is automatically generated from all form fields
- Empty fields are excluded from the formatted message

