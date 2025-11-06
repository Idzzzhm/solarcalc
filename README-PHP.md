# Solar Savings Calculator - PHP Edition

A professional solar panel savings calculator built with PHP for server-side processing. Calculate your electricity usage, solar savings, and return on investment based on Malaysian electricity tariffs and solar generation patterns.

## 🚀 Features

### Server-Side Processing
- **PHP Backend**: All calculations performed server-side for better security and performance
- **Form Handling**: POST method for data submission and processing
- **Session Management**: Maintains calculator state across page reloads

### Appliance Calculator
- 12 common household appliances with customizable quantities and usage hours
- Solar hour tracking for accurate direct usage calculations
- Real-time daily and monthly consumption estimates
- Direct solar usage percentage calculation

### Solar Savings Calculator
- Monthly bill input with TNB tariff calculations
- Direct usage percentage configuration
- System type selection (Single/Three Phase)
- Dynamic system sizing with panel count calculations
- Comprehensive savings breakdown (monthly, annual, 10-year)
- Payback period analysis
- Multiple payment options (full, 3-year, 5-year plans)

### Modern UI
- Gradient design with glassmorphism effects
- Smooth animations and transitions
- Responsive design for all devices
- Interactive hover effects

## 📋 Requirements

- **PHP**: 7.4 or higher
- **Web Server**: Apache (XAMPP recommended) or Nginx
- **Browser**: Modern browser with JavaScript enabled

## 🛠️ Installation

### Using XAMPP

1. **Install XAMPP**
   - Download from https://www.apachefriends.org/
   - Install and start Apache server

2. **Copy Files**
   ```
   Copy all files to: C:\xampp\htdocs\solar\
   ```

3. **Access Application**
   ```
   Open browser: http://localhost/solar/index.php
   ```

### File Structure
```
solar/
├── index.php                 # Main application file
├── calculator-functions.php  # Server-side calculation logic
├── calculator-client.js      # Client-side interactions
├── config.php               # Configuration settings
├── styles.css               # Modern styling
└── README-PHP.md            # This file
```

## 🔧 Configuration

Edit `config.php` to customize:

```php
// Electricity Rates
'electricity_rate' => 0.2185,  // RM per kWh
'export_rate' => 0.20,         // RM per kWh

// Solar Specifications
'solar_generation_factor' => 102.5,  // kWh per kWp per month
'panel_power' => 510,                // Watts per panel
'cost_per_kwp' => 2368,             // RM per kWp

// System Limits
'single_phase_limit' => 7.14,   // kWp
'three_phase_limit' => 16.32,   // kWp
```

## 📊 Calculation Methods

### Appliance Usage
```php
dailyKwh = (power × quantity × hours) / 1000
monthlyKwh = dailyKwh × 30
monthlyBill = monthlyKwh × electricityRate
solarPercent = (solarHoursKwh / dailyKwh) × 100
```

### Solar Savings
```php
totalUsage = monthlyBill / electricityRate
solarGeneration = systemSize × solarGenerationFactor
directUsageKwh = (directUsagePercent / 100) × solarGeneration
exportKwh = solarGeneration - directUsageKwh
monthlySavings = (directUsageKwh × electricityRate) + min(exportKwh × exportRate, bill × 0.6)
paybackPeriod = discountedCost / (monthlySavings × 12)
```

## 🎨 Customization

### Adding New Appliances

Edit `config.php`:
```php
'appliances' => [
    'dishwasher' => [
        'name' => 'Dishwasher',
        'icon' => '🍽️',
        'power' => 1800,
        'unit' => '1800W each',
        'default_qty' => 1,
        'default_hours' => 1,
        'default_peak' => 0.5
    ]
]
```

### Changing Tariff Rates

Update in `calculator-functions.php`:
```php
define('ELECTRICITY_RATE', 0.2185);  // Your rate
define('EXPORT_RATE', 0.20);         // Your export rate
```

### Styling

Modify `styles.css` CSS variables:
```css
:root {
    --primary-color: #6366F1;
    --primary-dark: #4F46E5;
    --accent-color: #F59E0B;
}
```

## 🔐 Security Features

- **Input Validation**: All user inputs sanitized and validated
- **Type Casting**: Proper type conversion (intval, floatval)
- **Server-Side Processing**: Calculations cannot be manipulated client-side
- **XSS Protection**: Output properly escaped with htmlspecialchars

## 🌐 API Integration (Optional)

To add database storage or API features:

```php
// Save calculation to database
function saveCalculation($data) {
    $conn = new mysqli('localhost', 'user', 'pass', 'solar_db');
    $stmt = $conn->prepare("INSERT INTO calculations VALUES (?, ?, ?)");
    $stmt->bind_param("sdd", $data['name'], $data['bill'], $data['savings']);
    $stmt->execute();
}
```

## 📱 Mobile Optimization

The application is fully responsive:
- Mobile-first design approach
- Touch-friendly inputs and sliders
- Optimized for screens 320px and up
- Collapsible sections for small screens

## 🐛 Troubleshooting

### Blank Page
- Check PHP error logs: `C:\xampp\apache\logs\error.log`
- Enable error display in `php.ini`: `display_errors = On`

### Calculations Not Working
- Verify `calculator-functions.php` is in the same directory
- Check file permissions (755 for directories, 644 for files)

### Styling Issues
- Clear browser cache
- Check `styles.css` is loading correctly
- Verify path in `<link>` tag

## 🔄 Converting Back to JavaScript

To use pure JavaScript version:
1. Use `index.html` instead of `index.php`
2. Use `calculator.js` for client-side calculations
3. No server required - works offline

## 📄 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

To contribute:
1. Test all calculations thoroughly
2. Follow existing code style
3. Comment complex logic
4. Update documentation

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review calculation logic in `calculator-functions.php`
- Test with default values first

## 🎯 Future Enhancements

Planned features:
- Database integration for saving quotes
- Email quote functionality
- Chart.js visualization of savings
- PDF report generation
- Multi-language support
- Admin panel for configuration

---

**Version**: 2.0 (PHP Edition)  
**Last Updated**: November 2025  
**Tested With**: PHP 8.0, XAMPP 8.0.28
