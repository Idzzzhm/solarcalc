# 🎨 Solar Calculator - PHP Architecture

## 📊 System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                     http://localhost/solar/                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         index.php                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  1. Receive POST data (appliances, bill, system size)     │  │
│  │  2. Include calculator-functions.php                      │  │
│  │  3. Call calculateApplianceUsage()                        │  │
│  │  4. Call calculateSolarSavings()                          │  │
│  │  5. Render HTML with results                              │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────┬───────────────────────────┬────────────────────┘
                 │                           │
                 ▼                           ▼
┌────────────────────────────┐  ┌──────────────────────────────┐
│ calculator-functions.php   │  │      config.php              │
│                            │  │                              │
│ • calculateSolarSavings()  │  │ • Electricity rates          │
│ • calculateApplianceUsage()│  │ • System limits              │
│ • Constants (rates, etc.)  │  │ • Appliance specifications   │
│ • Helper functions         │  │ • Default values             │
└────────────────────────────┘  └──────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RENDERED HTML + CSS                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  • Form with calculated values                            │  │
│  │  • Styled with styles.css (gradient design)               │  │
│  │  • Interactive with calculator-client.js (sliders)        │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ calculator-     │
                    │ client.js       │
                    │                 │
                    │ • Sync sliders  │
                    │ • Smooth scroll │
                    │ • Animations    │
                    └─────────────────┘
```

## 🔄 Data Flow

### Appliance Calculator Flow
```
[User Input] → [POST Form] → [PHP Process] → [Calculate] → [Display Results]
    │              │              │              │              │
  Qty: 10      name=qty_led   intval($_POST)  dailyKwh    RM 105.54
  Hours: 5     name=hours_led floatval()      monthlyKwh   47.2%
```

### Solar Calculator Flow
```
[User Input] → [POST Form] → [PHP Process] → [Calculate] → [Display Results]
    │              │              │              │              │
  Bill: 300    name=monthlyBill  validate()   generate()    Savings: RM 108
  Usage: 65%   name=directUsage  calculate()  savings()     Payback: 8.7yr
```

## 🗂️ File Structure

```
solar/
│
├── 🌐 Frontend Files
│   ├── index.php              # Main application (PHP + HTML)
│   ├── styles.css             # Modern gradient styling
│   ├── calculator-client.js   # Client-side interactions
│   └── index.html             # Original JavaScript version
│
├── ⚙️ Backend Files
│   ├── calculator-functions.php  # Core calculation logic
│   ├── config.php               # Configuration & constants
│   └── calculator.js            # Original JS calculator
│
├── 🔐 Configuration
│   └── .htaccess               # Apache security & optimization
│
├── 📖 Documentation
│   ├── README-PHP.md           # Complete documentation
│   ├── QUICKSTART-PHP.md       # Quick start guide
│   ├── CONVERSION-SUMMARY.md   # This conversion summary
│   └── README.md               # Original documentation
│
└── 🧪 Testing
    └── test-calculator.php     # Automated tests
```

## 🔌 Component Interaction

```
┌──────────────────────────────────────────────────────────────┐
│                      index.php (Main)                         │
│  ┌────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │   Forms    │  │  Calculator  │  │   Results Display  │   │
│  │            │→ │   Logic      │→ │                    │   │
│  │ • Inputs   │  │ • Validate   │  │ • Formatted output │   │
│  │ • Buttons  │  │ • Calculate  │  │ • Styled cards     │   │
│  │ • Sliders  │  │ • Process    │  │ • Charts (future)  │   │
│  └────────────┘  └──────────────┘  └────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
         ▲                  ▲                      │
         │                  │                      │
         │            ┌─────┴──────┐              │
         │            │ Functions  │              │
         │            │ & Config   │              │
         │            └────────────┘              │
         │                                        │
         └────────────────────────────────────────┘
                     (Form Submit Loop)
```

## 📱 Request/Response Cycle

```
1. INITIAL PAGE LOAD
   ┌─────┐                    ┌─────┐
   │USER │────GET request────→│ PHP │
   └─────┘                    └──┬──┘
                                 │ Load with defaults
                                 │ monthlyBill = 300
                                 │ systemSize = 5
                              ┌──▼──┐
                              │HTML │
                              └──┬──┘
   ┌─────┐                    ┌──▼──┐
   │USER │◄────Display────────│Page │
   └─────┘                    └─────┘

2. USER SUBMITS FORM
   ┌─────┐                    ┌─────┐
   │USER │────POST data───────→│ PHP │
   │     │  monthlyBill=500    └──┬──┘
   │     │  systemSize=7          │ Process data
   │     │                        │ Calculate
   │     │                     ┌──▼──┐
   │     │                     │Calc │
   │     │                     └──┬──┘
   │     │                        │ Return results
   │     │                     ┌──▼──┐
   │     │                     │HTML │
   │     │                     └──┬──┘
   └─────┘◄────New page────────┴──▼──┘
           with updated values
```

## 🎯 Function Call Hierarchy

```
index.php
  │
  ├─→ require 'calculator-functions.php'
  │     │
  │     ├─→ define constants
  │     │     ├─ ELECTRICITY_RATE
  │     │     ├─ SOLAR_GENERATION_FACTOR
  │     │     └─ COST_PER_KWP
  │     │
  │     ├─→ calculateApplianceUsage()
  │     │     ├─ Loop through appliances
  │     │     ├─ Calculate daily kWh
  │     │     ├─ Calculate solar hours
  │     │     └─ Return array
  │     │
  │     └─→ calculateSolarSavings()
  │           ├─ Validate system size
  │           ├─ Calculate generation
  │           ├─ Calculate savings
  │           ├─ Calculate payback
  │           └─ Return array
  │
  └─→ Render HTML with results
        ├─ Echo appliance summary
        ├─ Echo savings cards
        └─ Echo pricing options
```

## 💾 Data Structure

### POST Data Structure
```php
$_POST = [
    // Appliances
    'qty_led' => 10,
    'hours_led' => 5,
    'peak_led' => 1,
    'qty_ac' => 2,
    'hours_ac' => 6,
    'peak_ac' => 3,
    // ... more appliances
    
    // Solar Calculator
    'monthlyBill' => 300,
    'directUsage' => 65,
    'systemType' => 'single',
    'systemSize' => 5,
    
    // Action
    'action' => 'calculate'
]
```

### Calculation Result Structure
```php
$solarCalc = [
    'totalUsage' => 1373.00,
    'solarGeneration' => 512.50,
    'numPanels' => 10,
    'currentBill' => 300.00,
    'billAfterSolar' => 191.34,
    'monthlySavings' => 108.66,
    'annualSavings' => 1303.95,
    'tenYearSavings' => 13039.50,
    'systemCost' => 11840.00,
    'discountedCost' => 11340.00,
    'paybackPeriod' => 8.7,
    'maxSystemSize' => 7.14
]
```

## 🔐 Security Layers

```
User Input
    ▼
┌─────────────────┐
│ Form Validation │ ← HTML5 min/max/step
└────────┬────────┘
         ▼
┌─────────────────┐
│ PHP Validation  │ ← isset(), intval(), floatval()
└────────┬────────┘
         ▼
┌─────────────────┐
│ Type Casting    │ ← Ensure correct data types
└────────┬────────┘
         ▼
┌─────────────────┐
│ Business Logic  │ ← Check limits & constraints
└────────┬────────┘
         ▼
┌─────────────────┐
│ Output Escape   │ ← htmlspecialchars() (if needed)
└────────┬────────┘
         ▼
    Database/Display
```

## 🎨 Styling Architecture

```
styles.css
    │
    ├─→ CSS Variables
    │   ├─ --primary-color: #6366F1
    │   ├─ --bg-gradient: linear-gradient(...)
    │   └─ --shadow-lg: 0 10px 15px...
    │
    ├─→ Component Styles
    │   ├─ .navbar (glassmorphism)
    │   ├─ .hero (gradient background)
    │   ├─ .appliance-card (hover effects)
    │   ├─ .summary-card (elevated shadow)
    │   └─ .savings-card (gradient accents)
    │
    ├─→ Animations
    │   ├─ @keyframes fadeInUp
    │   ├─ @keyframes pulse
    │   └─ transition: var(--transition)
    │
    └─→ Responsive
        ├─ @media (max-width: 968px)
        └─ @media (max-width: 640px)
```

---

## 🚀 Deployment Checklist

- [x] PHP syntax validated
- [x] Functions tested
- [x] Edge cases handled
- [x] Security headers configured
- [x] Error handling implemented
- [x] Documentation complete
- [x] Test script created
- [x] Modern styling applied

---

**Ready for Production!** 🎉
