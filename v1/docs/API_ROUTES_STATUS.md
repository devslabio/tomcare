# API Routes Status

## Current Status: **UNUSED** ⚠️

All API routes in `app/api/` are currently **not being used** by the frontend. All forms submit directly to EmailJS using client-side JavaScript.

---

## API Routes Overview

### 1. `/api/contact/route.ts`
- **Status**: Unused
- **Purpose**: Mock in-memory storage for contact form submissions
- **Methods**: `POST`, `GET`
- **Current Usage**: None - Contact form uses EmailJS directly
- **Data Storage**: In-memory array (lost on server restart)

### 2. `/api/volunteers/route.ts`
- **Status**: Unused
- **Purpose**: Mock in-memory storage for volunteer applications
- **Methods**: `POST`, `GET`
- **Current Usage**: None - Volunteer form uses EmailJS directly
- **Data Storage**: In-memory array (lost on server restart)

### 3. `/api/donations/route.ts`
- **Status**: Unused
- **Purpose**: Mock in-memory storage for donation submissions
- **Methods**: `POST`, `GET`
- **Current Usage**: None - Donation forms use EmailJS directly
- **Data Storage**: In-memory array (lost on server restart)

### 4. `/api/recipients/route.ts`
- **Status**: Unused
- **Purpose**: Mock in-memory storage for recipient registrations
- **Methods**: `POST`, `GET`
- **Current Usage**: None - No frontend form currently uses this
- **Data Storage**: In-memory array (lost on server restart)

---

## Current Form Submission Method

All forms currently use **EmailJS** for submissions:

- ✅ Contact Form (`app/contact/page.tsx`) → EmailJS
- ✅ Volunteer Form (`components/volunteer-section.tsx`) → EmailJS
- ✅ Registration Form (`app/register/page.tsx`) → EmailJS
- ✅ Donation Forms (`components/donate-button.tsx`, `components/donations-section.tsx`) → EmailJS

See `docs/FORM_SUBMISSION_STANDARD.md` for details.

---

## Future Use Cases

These API routes can be used when:

1. **Database Integration**: When Supabase is integrated, these routes can:
   - Store submissions in PostgreSQL
   - Provide data persistence
   - Enable admin dashboard access

2. **Dual Submission**: Forms can submit to both:
   - EmailJS (for immediate email notifications)
   - API routes (for database storage)

3. **Admin Dashboard**: API routes can provide:
   - GET endpoints for viewing submissions
   - Filtering and search capabilities
   - Export functionality

---

## Recommendations

### Option 1: Keep for Future Use (Recommended)
- ✅ Keep routes as-is for future Supabase integration
- ✅ Document as "reserved for database integration"
- ✅ Add comments explaining they're not currently used

### Option 2: Remove
- ⚠️ Delete routes if not planning to use them
- ⚠️ Can be recreated later if needed
- ⚠️ Cleaner codebase but less flexibility

### Option 3: Implement Now
- 🔄 Connect routes to Supabase immediately
- 🔄 Update forms to use API routes
- 🔄 Maintain EmailJS for notifications

---

## Migration Path (When Ready)

When integrating Supabase:

1. **Install Supabase client**:
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Create database tables**:
   - `contact_messages`
   - `volunteer_applications`
   - `donations`
   - `recipients`

3. **Update API routes**:
   - Replace in-memory arrays with Supabase queries
   - Add proper error handling
   - Add validation with Zod

4. **Update forms** (optional):
   - Keep EmailJS for notifications
   - Add API route calls for database storage
   - Or replace EmailJS with API routes entirely

---

## Files to Update (When Migrating)

- `app/api/contact/route.ts` - Connect to Supabase `contact_messages` table
- `app/api/volunteers/route.ts` - Connect to Supabase `volunteer_applications` table
- `app/api/donations/route.ts` - Connect to Supabase `donations` table
- `app/api/recipients/route.ts` - Connect to Supabase `recipients` table

---

*Last Updated: 2025-01-27*
*Status: Unused - Reserved for future database integration*

