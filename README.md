# Solar Savings Calculator

A web-based solar panel savings calculator designed for Malaysian homeowners. Calculate your potential savings, system size requirements, and return on investment based on TNB electricity tariffs and local solar generation patterns.

## 🌟 Features

- **Real-time Calculations**: Instant updates as you adjust inputs with synchronized sliders and number fields
- **Malaysian Context**: Uses accurate TNB tariff rates and Malaysia's solar generation factors
- **System Sizing**: Automatic calculation of recommended system size based on your usage
- **Multiple Purchase Options**: Compare 5-year, 10-year, and outright purchase plans
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Solar ATAP Integration**: Includes government discount calculations and export rates

## 📊 What It Calculates

- Monthly and annual electricity savings
- System sizing (kWp) and number of panels needed
- Direct solar usage vs. exported electricity
- System installation costs with ATAP discount
- Payback period
- 10-year total savings
- Bill comparison (before and after solar)

## 🚀 Quick Start

### Prerequisites
- XAMPP (or any web server with Apache)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone or download** this repository to your XAMPP `htdocs` folder:
   ```
   c:\xampp\htdocs\solar\
   ```

2. **Start XAMPP** and ensure Apache is running

3. **Open in browser**:
   ```
   http://localhost/solar/
   ```

That's it! No build process, no dependencies to install.

## 📁 Project Structure

```
solar/
├── index.html          # Main HTML page with calculator form
├── styles.css          # Responsive CSS styling with CSS variables
├── calculator.js       # ES6 class-based calculation logic
├── .github/
│   └── copilot-instructions.md  # AI coding assistant guidance
└── README.md          # This file
```

## 🔧 Technical Details

### Technology Stack
- **HTML5**: Semantic markup with modern form elements
- **CSS3**: CSS Grid, Flexbox, custom properties, gradients
- **JavaScript (ES6+)**: Class-based architecture, no frameworks/libraries
- **Hosting**: Static files, no backend required

### Key Constants (in `calculator.js`)

```javascript
ELECTRICITY_RATE = 0.2185        // RM per kWh (TNB average)
SOLAR_GENERATION_FACTOR = 102.5  // kWh per kWp per month
PANEL_POWER = 510                // Watts per panel
COST_PER_KWP = 2368              // RM per kWp installation cost
ATAP_DISCOUNT = 500              // Government discount (RM)
EXPORT_RATE = 0.20               // RM per kWh for exports
```

### Malaysian Regulations
- **Single-phase system**: Maximum 7.14 kWp
- **Three-phase system**: Maximum 16.32 kWp

## 🎨 Customization

### Change Colors/Theme
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #f59e0b;      /* Main orange color */
    --primary-dark: #d97706;       /* Darker shade */
    --secondary-color: #3b82f6;    /* Blue accent */
    --success-color: #10b981;      /* Green for savings */
}
```

### Update Tariff Rates
Modify constants in `calculator.js` when rates change:
```javascript
this.ELECTRICITY_RATE = 0.2185;  // Update this line
this.EXPORT_RATE = 0.20;         // Update this line
```

### Add New Input Field
1. Add HTML elements in `index.html`
2. Cache references in `initializeElements()`
3. Bind events in `bindEvents()`
4. Use values in `calculate()`
5. Display results in `updateDisplays()`

## 🧪 Testing

Open browser DevTools (F12) and:
1. Check Console for errors
2. Test slider/input synchronization
3. Verify calculations at edge cases:
   - Minimum bill: RM 100
   - Maximum bill: RM 3000
   - Maximum system sizes (7.14 kWp / 16.32 kWp)
4. Test responsive design (resize browser or use device toolbar)

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📖 Reference

This calculator is based on the Emit Solar calculator:
https://www.emitsolar.com/solar-savings-calculator/

Key features replicated:
- TNB bill input with usage calculation
- Direct solar usage percentage with guidance
- System size slider with real-time updates
- Comprehensive savings breakdown
- Multiple purchase options display

## 🤝 Contributing

This is a learning/demonstration project. Feel free to:
- Report issues or suggest improvements
- Fork and modify for your own use
- Submit pull requests with enhancements

Potential enhancements:
- Chart visualization (Chart.js/D3.js)
- Email quote form integration
- Backend API for saving calculations
- PDF report generation
- Comparison with different panel types

## 📄 License

This project is open source and available for educational purposes.

## 💡 AI Development Notes

For AI coding assistants working on this project, see `.github/copilot-instructions.md` for:
- Architecture patterns and conventions
- Calculation logic documentation
- Common modification tasks
- Testing procedures
- Troubleshooting guide

## 📞 Support

For questions or issues:
- Open an issue in the repository
- Contact: info@solarsavings.com (update with your contact)

---

**Built with ☀️ for a sustainable future**
