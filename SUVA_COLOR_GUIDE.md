# SUVA Design System - Component Color Usage Guide

This guide provides examples of how to properly use the SUVA Design System colors in React components.

## Color Hierarchy

### Primary Colors (Most Used)
- **Grey 100% (`#666666`)** - Body text, low-hierarchy titles
- **BG Grey (`#F2F2F2`)** - Background of modules/sections
- **Suva Orange 100% (`#FF8200`)** - H1-H3 headlines, illustrations, graphics
- **Suva Blue 100% (`#00B8CF`)** - Interactive elements (buttons, links, icons, tags)

## Component Examples

### Buttons

```tsx
// Primary Action Button (Interactive Blue)
<button className="bg-suva-blue-100 text-white hover:bg-suva-interaction-blue px-4 py-2">
  Primary Action
</button>

// Secondary Action Button (Orange)
<button className="bg-suva-orange-100 text-white hover:bg-suva-orange-75 px-4 py-2   ">
  Secondary Action
</button>

// Outline Button
<button className="border border-suva-blue-100 text-suva-blue-100 hover:bg-suva-blue-100 hover:text-white px-4 py-2   ">
  Outline Button
</button>

// Destructive Action (System Red)
<button className="bg-error text-white hover:bg-suva-red-accent px-4 py-2   ">
  Delete
</button>
```

### Typography

```tsx
// Main Headlines (Orange for hierarchy)
<h1 className="text-suva-orange-100 text-3xl font-bold">Main Headline</h1>
<h2 className="text-suva-orange-100 text-2xl font-semibold">Section Title</h2>
<h3 className="text-suva-orange-100 text-xl font-medium">Subsection</h3>

// Body Text (Grey 100%)
<p className="text-suva-grey-100">Main body text content</p>

// Secondary Text (Grey 75%)
<p className="text-suva-grey-75">Secondary information, descriptions</p>

// Muted Text (Grey 50%)
<p className="text-suva-grey-50">Placeholder text, inactive content</p>
```

### Backgrounds

```tsx
// Primary Background (White)
<div className="bg-white">Main content area</div>

// Module Background (BG Grey)
<div className="bg-suva-bg-grey">Card or module background</div>

// Subtle Background (Grey 25%)
<div className="bg-suva-grey-25">Subtle highlight area</div>
```

### Interactive Elements

```tsx
// Links
<a href="#" className="text-suva-blue-100 hover:text-suva-interaction-blue">
  Interactive Link
</a>

// Active/Selected States
<div className="bg-suva-blue-25 text-suva-blue-100">
  Selected item
</div>

// Navigation Active State
<nav className={`px-3 py-2   ${
  isActive 
    ? 'bg-suva-blue-25 text-suva-blue-100' 
    : 'text-suva-grey-100 hover:bg-suva-bg-grey'
}`}>
  Navigation Item
</nav>
```

### Status Indicators

```tsx
// Success (System Green)
<div className="bg-success/10 border border-success/20 text-success px-3 py-2  ">
  Success message
</div>

// Warning (System Yellow)
<div className="bg-warning/10 border border-warning/20 text-warning px-3 py-2  ">
  Warning message
</div>

// Error (System Red)
<div className="bg-error/10 border border-error/20 text-error px-3 py-2  ">
  Error message
</div>

// Information (System Blue)
<div className="bg-info/10 border border-info/20 text-info px-3 py-2  ">
  Information message
</div>
```

### Borders

```tsx
// Light borders (Grey 25%)
<div className="border border-suva-grey-25">Light border</div>

// Medium borders (Grey 50%)
<div className="border border-suva-grey-50">Medium border</div>

// Interactive borders
<input className="border border-suva-grey-25 focus:border-suva-blue-100" />
```

### Form Elements

```tsx
// Input Fields
<input 
  type="text"
  className="border border-suva-grey-25    px-3 py-2 
             placeholder-suva-grey-50 
             focus:border-suva-blue-100 
             focus:ring-suva-blue-100"
  placeholder="Enter text..."
/>

// Labels
<label className="text-suva-grey-100 font-medium">
  Field Label
</label>

// Help Text
<p className="text-suva-grey-75 text-sm">
  Additional information or validation
</p>
```

### Cards and Modules

```tsx
// Standard Card
<div className="bg-white border border-suva-grey-25    shadow-lg">
  <div className="px-6 py-4 border-b border-suva-grey-25">
    <h3 className="text-suva-orange-100 font-semibold">Card Title</h3>
  </div>
  <div className="p-6">
    <p className="text-suva-grey-100">Card content</p>
  </div>
</div>

// Highlighted Module
<div className="bg-suva-bg-grey border border-suva-grey-25   ">
  <div className="p-6">
    <h4 className="text-suva-grey-100 font-medium">Module Title</h4>
    <p className="text-suva-grey-75">Module description</p>
  </div>
</div>
```

## Design Guidelines

### Do's
- Use Orange for hierarchical headlines (H1-H3)
- Use Blue for all interactive elements
- Use Grey 100% for main body text
- Use BG Grey for module/section backgrounds
- Maintain whitespace dominance
- Use system colors only for status indication

### Don'ts
- Don't use secondary colors (green, red, yellow accents) for primary UI elements
- Don't use orange for interactive elements
- Don't mix old gray classes with new SUVA colors
- Don't use system colors for decoration
- Don't use high saturation colors as large background areas

### Color Accessibility
- Ensure sufficient contrast ratios
- Test with color blindness simulators
- Provide alternative indicators beyond color alone
- Use semantic naming for better understanding

## Migration from Old Colors

| Old Tailwind Class | New SUVA Class | Use Case |
|-------------------|----------------|----------|
| `text-gray-900` | `text-suva-grey-100` | Body text |
| `text-gray-500` | `text-suva-grey-75` | Secondary text |
| `text-blue-600` | `text-suva-blue-100` | Interactive elements |
| `bg-suva-blue-100` | `bg-suva-blue-100` | Primary buttons |
| `bg-gray-50` | `bg-suva-bg-grey` | Module backgrounds |
| `border-gray-200` | `border-suva-grey-25` | Light borders |
| `text-red-600` | `text-error` | Error states |
| `bg-red-600` | `bg-error` | Error buttons |

## CSS Custom Properties

You can also use CSS custom properties in your styles:

```css
.custom-component {
  color: var(--suva-grey-100);
  background-color: var(--suva-bg-grey);
  border-color: var(--suva-grey-25);
}

.interactive-element {
  color: var(--suva-blue-100);
}

.interactive-element:hover {
  color: var(--suva-interaction-blue);
}
```
