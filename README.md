# TOMCARE Foundation Website

A comprehensive charity website for TOMCARE Foundation, supporting newcomers to Canada and people in need.

## Features

### For Visitors
- **Homepage**: Hero section, mission overview, and key statistics
- **About Section**: Foundation vision, mission, and core values
- **Programs Directory**: Browse and search 8+ support programs
- **Donation System**: Multiple donation options (general, vehicle donations, custom amounts)
- **Volunteer Portal**: Apply for volunteer positions with detailed descriptions
- **Testimonials**: Success stories from people helped, healthcare providers, and volunteers
- **Contact Form**: Get in touch with the foundation
- **User Registration**: Apply for assistance or volunteer opportunities

### For Recipients/Beneficiaries
- **Multi-step Registration**: Easy registration process to access services
- **Needs Assessment**: Identify specific assistance needed
- **Program Search**: Find relevant services

### For Volunteers
- **Application System**: Apply for volunteer positions
- **Position Details**: Clear descriptions of volunteer roles and time commitments
- **Impact Tracking**: See the difference you're making

### For Administrators (Future)
- **Dashboard**: Manage volunteers, recipients, donations, and contact inquiries
- **Form Submissions**: Track and respond to applications
- **Reporting**: Generate impact reports and statistics

## Tech Stack

- **Frontend**: Next.js 16 with React 19
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Fonts**: Poppins (sans-serif) and Lora (serif)
- **Database**: Ready for Supabase integration
- **Authentication**: Ready for Supabase Auth integration
- **Payments**: Ready for Stripe integration

## Project Structure

```
app/
├── page.tsx                 # Homepage
├── layout.tsx              # Root layout
├── register/               # Registration page
├── search/                 # Program search page
├── contact/                # Contact page
├── api/                    # API routes
│   ├── recipients/         # Recipient registration API
│   ├── volunteers/         # Volunteer application API
│   ├── donations/          # Donation processing API
│   └── contact/            # Contact form API
└── globals.css             # Global styles and design tokens

components/
├── navigation.tsx          # Main navigation with mobile menu
├── hero-section.tsx        # Hero section with CTA
├── about-section.tsx       # About/mission section
├── programs-section.tsx    # Programs directory with schedule
├── donations-section.tsx   # Donation options
├── volunteer-section.tsx   # Volunteer positions
├── testimonials-section.tsx # Testimonials by category
└── footer.tsx              # Footer with links and contact

Design System
- Primary Color: Compassionate Teal (oklch(0.45 0.18 220))
- Secondary: Warm Orange (oklch(0.85 0.15 40))
- Accent: Bright Green (oklch(0.65 0.15 165))
- Neutrals: White, grays, and dark backgrounds
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

## Future Enhancements

### Database Integration
- Set up Supabase for data persistence
- Migrate mock data to PostgreSQL
- Implement Row Level Security (RLS)

### Authentication
- Implement Supabase Auth for user login
- Create admin dashboard for staff
- Role-based access control

### Payments
- Integrate Stripe for secure donations
- Support recurring donations
- Email receipts and tax documentation

### Email Notifications
- Confirmation emails for registrations
- Admin notifications for new applications
- Weekly digest of new submissions

### Advanced Features
- Impact metrics and dashboard
- Donor recognition program
- Event management system
- Blog/news section
- Volunteer shift scheduling

## Forms & Data Collection

The website collects data through:
1. **Recipient Registration**: Personal info, situation, assistance needs
2. **Volunteer Applications**: Experience, availability, skills
3. **Donations**: Amount, donor info (optional for anonymous)
4. **Contact Inquiries**: General inquiries and feedback

All data is handled securely and stored for the foundation's use.

## Support

For questions or support, contact:
- Phone: (438) 773-3653
- Email: tomntambara@gmail.com
- Address: Quebec, Canada

## License

© 2025 TOMCARE Foundation. All rights reserved.
```

```tsx file="" isHidden
# tomcare
