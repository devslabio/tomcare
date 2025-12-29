# Alignment Analysis & Standardization

## Current Issues Found

### 1. Container Structure Inconsistencies
- **Standard**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Issues**: Some sections missing responsive padding or using different max-widths

### 2. Section Header Alignment
- **Inconsistent**: Mix of `text-center` and `text-left`
- **Standard**: Section headers should be `text-center` for consistency

### 3. Grid/Flex Alignment
- **Issues**: 
  - Some grids missing `items-center` or `items-start`
  - Inconsistent `justify-center` vs `justify-between`
  - Card content alignment varies (text-center vs text-left)

### 4. Card/Widget Content Alignment
- **Issues**:
  - Some cards use `text-center`, others `text-left`
  - Icon alignment inconsistent (flex justify-center vs flex justify-start)
  - Button alignment varies

### 5. Spacing Inconsistencies
- **Issues**:
  - Section padding varies (py-16 md:py-24 vs custom values)
  - Gap sizes inconsistent (gap-6, gap-8, gap-12)
  - Margin-bottom values vary (mb-4, mb-6, mb-8, mb-12)

## Standardization Rules

### Container Structure
```tsx
// ✅ Standard
<section className="section-padding bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* content */}
  </div>
</section>
```

### Section Headers
```tsx
// ✅ Standard - Centered headers
<div className="text-center mb-12">
  <h2>Section Title</h2>
  <p className="max-w-2xl mx-auto">Description</p>
</div>
```

### Grid Alignment
```tsx
// ✅ Standard - Items aligned
<div className="grid md:grid-cols-3 gap-8 items-stretch">
  {/* cards */}
</div>
```

### Card Content
```tsx
// ✅ Standard - Centered card content
<div className="text-center">
  <div className="flex justify-center mb-4">{icon}</div>
  <h3>Title</h3>
  <p>Description</p>
</div>
```

### Spacing Standards
- **Section padding**: `py-16 md:py-24` (use `section-padding` class)
- **Header margin**: `mb-12` (consistent)
- **Grid gaps**: `gap-8` (standard), `gap-6` (tight), `gap-12` (spacious)
- **Card padding**: `p-6` or `p-8` (consistent within section)

## Files to Fix

1. **components/features-section.tsx** - ✅ Already good
2. **components/causes-section.tsx** - Check alignment
3. **components/programs-section.tsx** - Check alignment
4. **components/fact-counter-section.tsx** - Check grid alignment
5. **components/donations-section.tsx** - Check alignment
6. **components/volunteer-section.tsx** - Check card alignment
7. **components/testimonials-section.tsx** - Check text alignment
8. **components/team-section.tsx** - ✅ Already good
9. **components/events-section.tsx** - Check alignment
10. **components/blog-section.tsx** - Check alignment

## Priority Fixes

### High Priority
1. Standardize all section containers to `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
2. Standardize section headers to `text-center mb-12`
3. Ensure grid items use `items-stretch` or `items-center` consistently
4. Standardize card content alignment within each section

### Medium Priority
1. Standardize gap sizes (use `gap-8` as default)
2. Standardize section padding (use `section-padding` class)
3. Ensure consistent icon alignment in cards

### Low Priority
1. Review and standardize button alignment
2. Ensure consistent spacing between elements

