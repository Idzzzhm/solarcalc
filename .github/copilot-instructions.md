## Purpose

Guide AI agents working on this **Solar Savings Calculator** web application - a client-side tool for calculating solar panel savings, system sizing, and ROI based on Malaysian electricity tariffs and solar generation patterns.

## Architecture Overview

**Stack:** Vanilla JavaScript (ES6 classes) + HTML5 + CSS3  
**Deployment:** Static site hosted via XAMPP (localhost) - no backend/database  
**Pattern:** Single-page application with real-time calculations triggered by user input

### Core Files
- `index.html` - Main page with appliance calculator, solar calculator form, results display, and benefits section
- `styles.css` - Responsive design with CSS variables, gradients, mobile-first approach
- `calculator.js` - `SolarCalculator` ES6 class handling appliance usage calculations and solar savings

## Critical Domain Knowledge

### Calculation Constants (in `calculator.js`)
```javascript
ELECTRICITY_RATE = 0.2185        // RM per kWh (TNB average)
SOLAR_GENERATION_FACTOR = 102.5  // kWh per kWp per month (Malaysia)
PANEL_POWER = 510                // Watts per panel (modern standard)
COST_PER_KWP = 2368              // RM installation cost per kWp
ATAP_DISCOUNT = 500              // Solar ATAP government discount
EXPORT_RATE = 0.20               // RM per kWh for exported electricity

// Appliance power ratings (Watts)
APPLIANCE_POWER = {
    led: 10, fan: 75, ac: 1000, fridge: 150, tv: 100,
    washer: 500, heater: 2000, microwave: 1200, computer: 150,
    kettle: 1500, iron: 1000, router: 10
}

// Typical % of usage during solar hours (8am-6pm) for each appliance
SOLAR_HOUR_USAGE_PERCENT = {
    led: 10, fan: 70, ac: 60, fridge: 42, tv: 30,
    washer: 80, heater: 20, microwave: 60, computer: 70,
    kettle: 50, iron: 70, router: 42
}
```

**When to adjust:** If tariffs change, update `ELECTRICITY_RATE` and `EXPORT_RATE`. If government incentives change, update `ATAP_DISCOUNT`. Adjust `SOLAR_HOUR_USAGE_PERCENT` based on local usage patterns.

### Key Calculations Flow

**Appliance Usage Calculation:**
1. **For each appliance:** `dailyKwh = (powerWatts × qty × hoursPerDay) / 1000`
2. **Solar hour usage:** `solarKwh = dailyKwh × (SOLAR_HOUR_USAGE_PERCENT / 100)`
3. **Daily total:** Sum of all appliances' daily usage
4. **Monthly total:** `dailyKwh × 30`
5. **Direct solar %:** `(total solarKwh / total dailyKwh) × 100`
6. **Estimated bills:** `kWh × ELECTRICITY_RATE` (for both daily and monthly)
7. **Transfer:** Button copies bill AND direct solar % to solar calculator

**Solar Savings Calculation:**
1. **Usage from bill:** `totalUsageKwh = monthlyBill / ELECTRICITY_RATE` (simplified tiered tariff)
2. **Solar generation:** `solarGenKwh = systemSize * SOLAR_GENERATION_FACTOR`
3. **Direct usage:** `directKwh = (directUsagePercent / 100) * solarGenKwh`
4. **Export:** `exportKwh = solarGenKwh - directKwh`
5. **Savings:** `monthlySavings = (directKwh * ELECTRICITY_RATE) + min(exportKwh * EXPORT_RATE, bill * 0.6)`

### System Limits (Malaysian Regulations)
- Single-phase: max **7.14 kWp**
- Three-phase: max **16.32 kWp**  
Enforced in `updateSystemLimits()` method when user changes system type.

## Development Workflow

### Local Testing (XAMPP)
1. Ensure XAMPP Apache is running
2. Open `http://localhost/solar/` in browser
3. Test calculator by adjusting sliders/inputs - calculations update in real-time
4. Check browser console for JS errors

### Making Changes
- **Add new input:** Update HTML form → bind events in `bindEvents()` → use value in `calculate()` → display in `updateDisplays()`
- **Adjust calculations:** Modify constants or formulas in `calculate()` method
- **Style changes:** Edit CSS variables in `:root` for colors, or specific selectors for layout
- **Responsive tweaks:** Check `@media` queries at end of `styles.css`

### Validation Checklist
- Open browser DevTools → verify no console errors
- Test slider/input sync (both should update together)
- Test edge cases: very low bills (RM100), very high (RM3000), max system sizes
- Test mobile viewport (< 640px) - should stack vertically
- Verify calculations match expected patterns (higher bill = higher savings)

## Code Conventions

### JavaScript Patterns
- ES6 class-based architecture (`SolarCalculator` singleton initialized on DOMContentLoaded)
- All DOM references cached in `initializeElements()`
- Event handlers bound once in `bindEvents()`
- Calculation logic separated from display logic (`calculate()` → `updateDisplays()`)
- Number formatting: `formatNumber()` for display with commas, `formatCurrency()` for RM amounts

### CSS Patterns
- CSS custom properties for theming (`--primary-color`, `--text-dark`, etc.)
- Mobile-first responsive design (base styles → `@media` overrides)
- Grid layouts for calculator sections and benefit cards
- Range slider styling via `-webkit-slider-thumb` and `-moz-range-thumb`
- Gradient backgrounds for hero/navbar using `linear-gradient()`

### HTML Patterns
- Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)
- Input/slider pairs synced via JavaScript (e.g., `monthlyBill` + `monthlyBillSlider`)
- Display elements use IDs for JavaScript updates (e.g., `id="monthlySavings"`)
- Info tooltips via `title` attribute on `.info-icon` spans

## Common Tasks

### Update Tariff Rates
1. Open `calculator.js`
2. Modify `ELECTRICITY_RATE` or `EXPORT_RATE` in constructor constants
3. Refresh browser - calculations auto-update

### Add New Appliance Type
1. Add new `appliance-card` in HTML with icon, quantity input, hours input, and power rating
2. Add power rating to `APPLIANCE_POWER` object in `calculator.js`
3. Use `data-appliance="name"` attribute on inputs (must match object key)
4. Calculation auto-updates via existing event listeners

### Add New Calculation Parameter
1. Add HTML input in `index.html` (number + range slider)
2. In `calculator.js`: add element refs in `initializeElements()`
3. Bind sync events in `bindEvents()` (follow existing pattern)
4. Use new value in `calculate()` method
5. Display result via `updateDisplays()` if needed

### Style/Theme Changes
1. Edit CSS variables in `:root` selector (`styles.css` line 10-20)
2. For layout changes, edit grid/flexbox properties in relevant sections
3. Test responsive breakpoints: 968px (tablet), 640px (mobile)

## Reference Implementation

**Based on:** https://www.emitsolar.com/solar-savings-calculator/  
Key features replicated: TNB bill input, direct usage percentage, system sizing slider, real-time savings display, purchase options, responsive design.

## Troubleshooting

- **Sliders not updating:** Check `updateSliderBackground()` is called after value change
- **Wrong calculations:** Verify constants match Malaysian rates; check parentheses in `calculate()`
- **Mobile layout broken:** Inspect `@media` queries; ensure grid/flex switches to single column
- **Numbers not formatted:** Ensure `formatNumber()` or `formatCurrency()` is called in `updateDisplays()`

---

**Next steps for contributors:** Consider adding chart visualization (Chart.js), email quote form, or backend API for persisting calculations.
