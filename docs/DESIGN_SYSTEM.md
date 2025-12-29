# Design System Documentation

## Overview

This document outlines the design system standards for the TOMCARE Foundation website, ensuring consistency across typography, spacing, colors, animations, and border radiuses.

## Typography

### Font Families
- **Sans-serif**: Inter (for body text, UI elements)
- **Serif**: Lora (for headings)

### Heading Scale
All headings use `font-serif` and `font-bold` by default:

- **h1**: `text-4xl md:text-5xl lg:text-6xl` - Page titles
- **h2**: `text-3xl md:text-4xl` - Section titles
- **h3**: `text-2xl md:text-3xl` - Subsection titles
- **h4**: `text-xl md:text-2xl` - Card titles
- **h5**: `text-lg md:text-xl` - Small headings
- **h6**: `text-base md:text-lg` - Smallest headings

### Body Text
- **Base**: `text-base` with `leading-relaxed`
- **Large**: `text-lg` for emphasis
- **Small**: `text-sm` for captions

### Usage
```tsx
// ✅ Correct - Use semantic headings
<h2>Section Title</h2>

// ❌ Avoid - Don't add redundant classes
<h2 className="font-serif font-bold text-3xl">Section Title</h2>
```

## Spacing

### Spacing Scale
Consistent spacing tokens defined in CSS variables:

- `--spacing-xs`: 0.5rem (8px)
- `--spacing-sm`: 0.75rem (12px)
- `--spacing-md`: 1rem (16px)
- `--spacing-lg`: 1.5rem (24px)
- `--spacing-xl`: 2rem (32px)
- `--spacing-2xl`: 3rem (48px)
- `--spacing-3xl`: 4rem (64px)

### Section Spacing
- **Standard sections**: Use `section-padding` class (py-16 md:py-24)
- **Content spacing**: Use `content-spacing` (space-y-6) or `content-spacing-lg` (space-y-8)

### Usage
```tsx
// ✅ Correct - Use utility classes
<section className="section-padding bg-white">
  <div className="content-spacing">
    {/* content */}
  </div>
</section>

// ❌ Avoid - Inconsistent spacing
<section className="py-20 md:py-32 bg-white">
  <div className="space-y-4">
    {/* content */}
  </div>
</section>
```

## Border Radius

### Standard Radius Values
- **Small**: `rounded-sm` (0.25rem) - Small elements
- **Medium**: `rounded-md` (0.5rem) - Inputs, buttons
- **Large**: `rounded-lg` (0.75rem) - Cards, containers
- **Extra Large**: `rounded-xl` (1rem) - Large cards, modals
- **Full**: `rounded-full` - Pills, avatars, decorative circles

### Usage Guidelines
- **Cards/Containers**: `rounded-lg` or `rounded-xl`
- **Inputs/Buttons**: `rounded-md`
- **Modals**: `rounded-lg`
- **Decorative elements**: `rounded-full` (blur effects, icons)

### Usage
```tsx
// ✅ Correct - Consistent radius
<div className="bg-white rounded-lg p-8">
  <input className="rounded-md" />
</div>

// ❌ Avoid - Inconsistent radius
<div className="bg-white rounded-2xl p-8">
  <input className="rounded-lg" />
</div>
```

## Animations

### Animation Speeds
Reduced animation speeds for better UX:

- **Fast**: `duration-150` (150ms) - Quick interactions
- **Base**: `duration-200` (200ms) - Standard transitions (default)
- **Slow**: `duration-300` (300ms) - Complex animations (use sparingly)

### Transition Types
- **Colors**: `transition-colors duration-200`
- **All properties**: `transition-all duration-200`
- **Transform**: `transition-transform duration-200`

### Usage
```tsx
// ✅ Correct - Fast, consistent animations
<button className="hover:bg-primary transition-colors duration-200">
  Click me
</button>

// ❌ Avoid - Slow animations
<button className="hover:bg-primary transition-all duration-300">
  Click me
</button>
```

## Colors

### Color Palette
All colors use design tokens defined in `globals.css`:

- **Primary**: LinkedIn Blue - Main brand color
- **Secondary**: Warm accent - Supporting color
- **Accent**: Gold/Yellow - Call-to-action color
- **Muted**: Subtle backgrounds and borders
- **Destructive**: Error states

### Usage
```tsx
// ✅ Correct - Use design tokens
<div className="bg-primary text-primary-foreground">
<div className="text-accent">
<div className="bg-muted">

// ❌ Avoid - Hardcoded colors
<div className="bg-blue-500 text-white">
```

## Component Patterns

### Buttons
- Use `LoadingButton` for buttons with loading states
- Use shadcn/ui `Button` component with variants
- Consistent `rounded-lg` for buttons

### Forms
- Use shadcn/ui `Input`, `Textarea`, `Label` components
- Consistent `rounded-md` for form inputs
- Use `ErrorMessage` and `SuccessMessage` components

### Cards
- Use `rounded-lg` for standard cards
- Use `rounded-xl` for prominent cards
- Consistent padding: `p-6` or `p-8`

### Sections
- Use `section-padding` for vertical spacing
- Consistent max-width: `max-w-7xl mx-auto`
- Consistent horizontal padding: `px-4 sm:px-6 lg:px-8`

## Best Practices

1. **Consistency First**: Always use design tokens and utility classes
2. **Semantic HTML**: Use proper heading hierarchy (h1-h6)
3. **Accessibility**: Ensure sufficient color contrast
4. **Performance**: Keep animations fast (200ms max)
5. **Responsive**: Use responsive spacing and typography classes

## Migration Guide

When updating existing components:

1. Replace `rounded-2xl` with `rounded-xl`
2. Replace `duration-300` with `duration-200`
3. Remove redundant typography classes from headings
4. Replace custom spacing with `section-padding` or `content-spacing`
5. Use design token colors instead of hardcoded values

---

*Last Updated: 2025-01-27*
*Part of Consistency Improvement Phase 4*

