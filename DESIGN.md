# Design System: Cashflow Finance App
**Project ID:** 11073895723520506312

## 1. Visual Theme & Atmosphere
The design system follows the philosophy of **"The Financial Architect"**. It treats personal finance as a high-end editorial experience rather than a series of spreadsheets. The aesthetic is characterized by:
- **Intentional Asymmetry**: Breaking rigid grids for a more dynamic, designed feel.
- **Breathable White Space**: Avoiding clutter to create authoritative calm.
- **Tonal Layering**: Defining boundaries through shifts in lightness rather than 1px borders (The "No-Line" Rule).
- **Glassmorphism**: Using 80% opacity with 20px backdrop blur for floating navigation and modals.

## 2. Color Palette & Roles
The palette is a "monochrome plus one" approach, ensuring the primary blue feels deliberate and functional.

| Color | Hex | Functional Role |
|:--- |:--- |:--- |
| **The Canvas** | `#faf8ff` | Global background / Surface. |
| **Action & Authority** | `#0054cc` | Primary color for CTAs and focus points. |
| **Primary Text** | `#191b23` | Headlines and high-emphasis labels. |
| **Secondary Text** | `#424655` | Supporting text and secondary metadata. |
| **Card Surface** | `#ffffff` | Elevated containers and interactive cards. |
| **Accent Action** | `#226cf4` | Used for gradients and hover states. |

## 3. Typography Rules
Uses **Inter** to bridge technical precision with editorial elegance, leveraging extreme scale for hierarchy.

- **Display (Lg/Md)**: `3.5rem` / `2.75rem`. Reserved for main balances. Letter-spacing: `-0.02em`.
- **Headline (Lg-Sm)**: `2rem` to `1.5rem`. Semi-bold weight, used to anchor sections.
- **Body (Lg/Md)**: `1rem` / `0.875rem`. High line-height (`1.6`) for readability.
- **Label (Md/Sm)**: `0.75rem`. Often all-caps for micro-data (e.g., categories, dates).

## 4. Component Stylings
*   **Buttons**: Primary buttons are high-impact with `full` (pill) radius and a gradient fill from `#0054cc` to `#226cf4`. Tertiary buttons use only text with no background.
*   **Cards & Containers**: Corner radius is `1rem` (DEFAULT) or `1.5rem` (md). Separation is achieved through vertical white space (16px/24px) rather than dividers.
*   **Input Fields**: "Seamless" style. Uses `surface-container-low` background with a pill shape (`1.5rem` radius). Labels sit above in all-caps labels.
*   **Data Visualization**: Minimalist charts with `3pt` strokes. No X/Y axis lines. Uses 10% opacity fills for volume.

## 5. Elevation & Depth
Depth is a function of light and stack order, not simple shadows.
- **Ambient Shadows**: Shadows for floating elements (FABs) use high diffusion: `X: 0, Y: 20, Blur: 40, Color: rgba(25, 27, 35, 0.06)`.
- **The Ghost Border**: If accessibility requires a stroke, use `outline-variant` at 15% opacity. Never use 100% opaque borders.

## 6. Layout Principles
- **Asymmetrical Padding**: e.g., 32px top, 24px sides for an editorial rhythm.
- **Space as Structure**: If the screen feels full, increase margins rather than adding lines.
- **Strong Left Axis**: Long lists must be left-aligned to maintain the "Architect" aesthetic.
