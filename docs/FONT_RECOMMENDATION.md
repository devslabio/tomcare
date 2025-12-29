# Font Recommendation & Implementation

## Current Font: **Poppins**

We've selected **Poppins** as the primary font for the TOMCARE Foundation website.

---

## Why Poppins?

### ✅ Perfect for Charity Websites
- **Friendly & Approachable**: Rounded geometric design feels warm and welcoming
- **Highly Readable**: Excellent legibility at all sizes and weights
- **Professional**: Modern and trustworthy appearance
- **Versatile**: Works beautifully for both headings and body text
- **Accessible**: Great contrast and readability for all users

### Design Characteristics
- **Style**: Geometric sans-serif
- **Personality**: Friendly, modern, approachable
- **Best For**: Headings, body text, UI elements
- **Weights Available**: 300, 400, 500, 600, 700, 800

---

## Implementation

### Font Loading (Next.js)
Located in `app/layout.tsx`:

```typescript
import { Poppins, Lora } from "next/font/google"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap", // Better performance
})
```

### CSS Variables
Located in `app/globals.css`:

```css
--font-sans: "Poppins", sans-serif;
--font-serif: "Lora", serif; /* For special cases if needed */
```

---

## Alternative Options

If you want to experiment with other fonts, here are excellent alternatives:

### 1. **Nunito** (Warmer Alternative)
- Even more rounded and friendly
- Great for very approachable, community-focused designs
- Similar to Poppins but with softer edges

**Implementation:**
```typescript
import { Nunito } from "next/font/google"

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
})
```

### 2. **Inter** (Previous Choice)
- More technical/corporate feel
- Excellent readability
- Very popular for modern web apps
- Less warm than Poppins

### 3. **Work Sans** (Balanced)
- Clean and professional
- Slightly warmer than Inter
- Great middle ground

### 4. **Lato** (Warm & Professional)
- Humanist sans-serif
- Warm but still professional
- Excellent for body text

---

## Font Usage Guidelines

### Headings
- **H1**: Weight 700-800 (Bold)
- **H2**: Weight 600-700 (Semi-bold)
- **H3**: Weight 500-600 (Medium)
- **H4-H6**: Weight 500 (Medium)

### Body Text
- **Default**: Weight 400 (Regular)
- **Emphasis**: Weight 500 (Medium)
- **Small Text**: Weight 400 (Regular)

### Buttons & CTAs
- **Primary**: Weight 600 (Semi-bold)
- **Secondary**: Weight 500 (Medium)

---

## Performance

- **Font Loading**: Optimized with Next.js font optimization
- **Display Swap**: Prevents invisible text during font load
- **Subset**: Latin only (reduces file size)
- **Weights**: Only loaded weights are included

---

## Resources

- **Google Fonts**: [Poppins on Google Fonts](https://fonts.google.com/specimen/Poppins)
- **Font Pairing**: Poppins pairs well with Lora (serif) for special cases
- **Documentation**: See Next.js [Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)

---

*Last Updated: 2025-01-27*
*Current Font: Poppins*

