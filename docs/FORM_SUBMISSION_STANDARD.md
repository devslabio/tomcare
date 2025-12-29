# Form Submission Standard

## Overview

This document defines the standard approach for form submissions in the TOMCARE Foundation website.

## Standard Method: EmailJS

**All forms use EmailJS for submission.** This ensures:
- Consistent data flow
- Reliable email delivery
- Auto-reply functionality
- No backend server required

## Implementation

### Forms Using EmailJS

1. **Contact Form** (`app/contact/page.tsx`)
   - Template: `contact`
   - Sends to admin email configured in EmailJS service

2. **Volunteer Application** (`components/volunteer-section.tsx`)
   - Template: `volunteer`
   - Sends to admin email configured in EmailJS service

3. **Registration Form** (`app/register/page.tsx`)
   - Template: `register`
   - Handles both recipient and applicant registrations
   - Sends to admin email configured in EmailJS service

4. **Donation Form** (via `components/donate-button.tsx`)
   - Template: `donate`
   - Sends to admin email configured in EmailJS service

### EmailJS Configuration

All EmailJS settings are configured in `.env.local`:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_77uejgm
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=T0pFpR16bzX1qUc5n
NEXT_PUBLIC_EMAILJS_TEMPLATE_CONTACT=bwanakweli4ever
NEXT_PUBLIC_EMAILJS_TEMPLATE_VOLUNTEER=bwanakweli4ever
NEXT_PUBLIC_EMAILJS_TEMPLATE_REGISTER=bwanakweli4ever
NEXT_PUBLIC_EMAILJS_TEMPLATE_DONATE=bwanakweli4ever
```

### Code Pattern

All forms follow this pattern:

```typescript
import { sendEmail, formatFormDataForEmail, createFormattedMessage } from "@/lib/emailjs"

// In form submission handler:
const emailParams = formatFormDataForEmail({
  ...formData,
  form_type: "Form Type Name",
  timestamp: new Date().toLocaleString(),
  formatted_message: createFormattedMessage(formData, "Form Type Name"),
})

const result = await sendEmail("template-key", emailParams)

if (result.success) {
  // Handle success
} else {
  // Handle error
}
```

## Unused Code

The following are **not currently used** and can be removed or kept for future use:

### API Routes (`app/api/*/route.ts`)
- `app/api/contact/route.ts` - Mock in-memory storage
- `app/api/volunteers/route.ts` - Mock in-memory storage
- `app/api/recipients/route.ts` - Not examined
- `app/api/donations/route.ts` - Not examined

**Status:** These routes are not called by any frontend forms. They can be:
- Removed if not needed
- Kept for future API integration
- Documented as deprecated

### Google Forms Integration (`lib/google-forms.ts`)
- Configured in `.env.local` with form URLs and entry IDs
- Not actively used by any forms
- Can be removed or implemented if needed

**Status:** Configured but unused. Consider:
- Removing if EmailJS is sufficient
- Implementing if dual submission is desired
- Documenting as alternative option

## Future Considerations

1. **Database Integration**: When moving to Supabase, forms can:
   - Continue using EmailJS for notifications
   - Also store submissions in database
   - Use API routes for database operations

2. **Form Validation**: Consider adding:
   - Client-side validation with Zod
   - Server-side validation in API routes
   - Better error messages

3. **Analytics**: Track form submissions:
   - Success/failure rates
   - Submission times
   - Form completion rates

## References

- EmailJS Setup: `docs/QUICK_EMAILJS_SETUP.md`
- EmailJS Library: `lib/emailjs.ts`
- Google Forms Setup: `docs/GOOGLE_FORMS_SETUP.md` (if needed)

---

*Last Updated: 2025-01-27*
*Part of Consistency Improvement Phase 1*

