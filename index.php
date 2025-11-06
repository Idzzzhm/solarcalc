<?php
// Initialize variables
$monthlyBill = isset($_POST['monthlyBill']) ? floatval($_POST['monthlyBill']) : 300;
$directUsage = isset($_POST['directUsage']) ? floatval($_POST['directUsage']) : 65;
$systemType = isset($_POST['systemType']) ? $_POST['systemType'] : 'single';
$systemSize = isset($_POST['systemSize']) ? floatval($_POST['systemSize']) : 5;

// Appliance data
$appliances = [
    'led' => ['name' => 'LED Bulbs', 'icon' => '💡', 'power' => 10, 'unit' => '10W each'],
    'fan' => ['name' => 'Ceiling Fan', 'icon' => '🌀', 'power' => 75, 'unit' => '75W each'],
    'ac' => ['name' => 'Air Conditioner', 'icon' => '❄️', 'power' => 1000, 'unit' => '1000W each'],
    'fridge' => ['name' => 'Refrigerator', 'icon' => '🧊', 'power' => 150, 'unit' => '150W each'],
    'tv' => ['name' => 'Television', 'icon' => '📺', 'power' => 100, 'unit' => '100W each'],
    'washer' => ['name' => 'Washing Machine', 'icon' => '🧺', 'power' => 500, 'unit' => '500W each'],
    'heater' => ['name' => 'Water Heater', 'icon' => '🚿', 'power' => 2000, 'unit' => '2000W each'],
    'microwave' => ['name' => 'Microwave', 'icon' => '🍽️', 'power' => 1200, 'unit' => '1200W each'],
    'computer' => ['name' => 'Computer/Laptop', 'icon' => '💻', 'power' => 150, 'unit' => '150W each'],
    'kettle' => ['name' => 'Electric Kettle', 'icon' => '☕', 'power' => 1500, 'unit' => '1500W each'],
    'iron' => ['name' => 'Iron', 'icon' => '👔', 'power' => 1000, 'unit' => '1000W each'],
    'router' => ['name' => 'WiFi Router', 'icon' => '📡', 'power' => 10, 'unit' => '10W each']
];

// Get appliance usage data from POST
$applianceUsage = [];
foreach ($appliances as $key => $appliance) {
    $applianceUsage[$key] = [
        'qty' => isset($_POST['qty_' . $key]) ? intval($_POST['qty_' . $key]) : 0,
        'hours' => isset($_POST['hours_' . $key]) ? floatval($_POST['hours_' . $key]) : 0,
        'peakHours' => isset($_POST['peak_' . $key]) ? floatval($_POST['peak_' . $key]) : 0
    ];
}

// Include calculation functions
require_once 'calculator-functions.php';

// Calculate appliance usage
$applianceCalc = calculateApplianceUsage($appliances, $applianceUsage);

// Calculate solar savings
$solarCalc = calculateSolarSavings($monthlyBill, $directUsage, $systemType, $systemSize);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solar Savings Calculator - PHP Edition</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <nav class="navbar">
            <div class="container">
                <div class="logo">
                    <h1>☀️ Solar Savings</h1>
                </div>
                <ul class="nav-links">
                    <li><a href="#calculator">Calculator</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#contact" class="btn-primary">Get Quote</a></li>
                </ul>
            </div>
        </nav>
    </header>

    <main>
        <section class="hero">
            <div class="container">
                <h2>Calculate Your Solar Savings</h2>
                <p>See how much you can save with solar energy in just a few clicks</p>
            </div>
        </section>

        <!-- Appliance Calculator Section -->
        <section id="appliance-calculator" class="appliance-calculator-section">
            <div class="container">
                <div class="section-header">
                    <h2>⚡ Calculate Your Electricity Usage</h2>
                    <p>Select your appliances and hours of use to estimate your monthly kWh consumption</p>
                </div>

                <form method="POST" action="index.php#appliance-calculator" id="applianceForm">
                    <div class="appliances-grid">
                        <?php foreach ($appliances as $key => $appliance): ?>
                            <div class="appliance-card">
                                <div class="appliance-header">
                                    <span class="appliance-icon"><?php echo $appliance['icon']; ?></span>
                                    <h3><?php echo $appliance['name']; ?></h3>
                                </div>
                                <div class="appliance-inputs">
                                    <div class="input-row">
                                        <label>Quantity:</label>
                                        <input type="number" name="qty_<?php echo $key; ?>" 
                                               value="<?php echo $applianceUsage[$key]['qty']; ?>" 
                                               min="0" max="50">
                                    </div>
                                    <div class="input-row">
                                        <label>Total hours/day:</label>
                                        <input type="number" name="hours_<?php echo $key; ?>" 
                                               value="<?php echo $applianceUsage[$key]['hours']; ?>" 
                                               min="0" max="24" step="0.5">
                                    </div>
                                    <div class="input-row">
                                        <label>During solar hours:</label>
                                        <input type="number" name="peak_<?php echo $key; ?>" 
                                               value="<?php echo $applianceUsage[$key]['peakHours']; ?>" 
                                               min="0" max="24" step="0.5">
                                    </div>
                                    <div class="appliance-power"><?php echo $appliance['unit']; ?></div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>

                    <div class="appliance-summary">
                        <div class="summary-card">
                            <h3>📊 Your Electricity Usage Summary</h3>
                            
                            <div class="usage-tabs">
                                <div class="usage-column">
                                    <h4>Daily Usage</h4>
                                    <div class="summary-row">
                                        <span>Consumption:</span>
                                        <span class="value"><?php echo number_format($applianceCalc['dailyKwh'], 2); ?> kWh</span>
                                    </div>
                                    <div class="summary-row">
                                        <span>Estimated Cost:</span>
                                        <span class="value">RM <?php echo number_format($applianceCalc['dailyBill'], 2); ?></span>
                                    </div>
                                </div>

                                <div class="usage-divider"></div>

                                <div class="usage-column">
                                    <h4>Monthly Usage</h4>
                                    <div class="summary-row">
                                        <span>Consumption:</span>
                                        <span class="value highlight"><?php echo number_format($applianceCalc['monthlyKwh'], 2); ?> kWh</span>
                                    </div>
                                    <div class="summary-row">
                                        <span>Estimated Bill:</span>
                                        <span class="value highlight">RM <?php echo number_format($applianceCalc['monthlyBill'], 2); ?></span>
                                    </div>
                                </div>
                            </div>

                            <div class="solar-usage-estimate">
                                <div class="estimate-header">
                                    <span>Direct Solar Usage Potential:</span>
                                    <span class="value solar"><?php echo number_format($applianceCalc['solarPercent'], 1); ?>%</span>
                                </div>
                                <p class="estimate-note">Based on <?php echo number_format($applianceCalc['solarKwh'], 2); ?> kWh used during solar hours</p>
                            </div>

                            <button type="submit" class="btn-use-calculation" name="action" value="calculate">Calculate My Savings</button>
                        </div>
                    </div>
                </form>
            </div>
        </section>

        <!-- Solar Calculator Section -->
        <section id="calculator" class="calculator-section">
            <div class="container">
                <div class="section-header">
                    <h2>💰 Solar Savings Calculator</h2>
                    <p>Calculate your potential savings with solar panels</p>
                </div>

                <form method="POST" action="index.php#calculator" id="solarForm">
                    <div class="calculator-wrapper">
                        <div class="calculator-inputs">
                            <h3>Enter Your Details</h3>

                            <!-- Monthly Electricity Bill -->
                            <div class="input-group">
                                <label>
                                    Monthly Electricity Bill (RM)
                                    <span class="info-icon" title="Your average monthly TNB bill">ℹ️</span>
                                </label>
                                <div class="input-with-slider">
                                    <input type="number" id="monthlyBill" name="monthlyBill" 
                                           value="<?php echo $monthlyBill; ?>" min="100" max="3000" step="10">
                                    <input type="range" id="monthlyBillSlider" 
                                           value="<?php echo $monthlyBill; ?>" min="100" max="3000" step="10">
                                </div>
                                <div class="input-info">
                                    <span class="info-label">Estimated Usage:</span>
                                    <span class="info-value"><?php echo number_format($solarCalc['totalUsage'], 0); ?> kWh/month</span>
                                </div>
                            </div>

                            <!-- Direct Usage Percentage -->
                            <div class="input-group">
                                <label>
                                    Direct Usage During Solar Hours (%)
                                    <span class="info-icon" title="Percentage of electricity used during daytime when solar panels generate power">ℹ️</span>
                                </label>
                                <div class="input-with-slider">
                                    <input type="number" id="directUsage" name="directUsage" 
                                           value="<?php echo $directUsage; ?>" min="0" max="100" step="5">
                                    <input type="range" id="directUsageSlider" 
                                           value="<?php echo $directUsage; ?>" min="0" max="100" step="5">
                                </div>
                                <div class="usage-guide">
                                    <p>💡 Typical Usage Patterns:</p>
                                    <ul>
                                        <li>40-50%: Working from home, daytime appliances</li>
                                        <li>50-70%: Retired, home all day</li>
                                        <li>20-40%: Working away, evening usage</li>
                                    </ul>
                                </div>
                            </div>

                            <!-- System Type -->
                            <div class="input-group">
                                <label>System Type</label>
                                <select id="systemType" name="systemType" onchange="this.form.submit()">
                                    <option value="single" <?php echo $systemType === 'single' ? 'selected' : ''; ?>>Single Phase (Max 7.14 kWp)</option>
                                    <option value="three" <?php echo $systemType === 'three' ? 'selected' : ''; ?>>Three Phase (Max 16.32 kWp)</option>
                                </select>
                            </div>

                            <!-- System Size -->
                            <div class="input-group">
                                <label>
                                    System Size (kWp)
                                    <span class="info-icon" title="Kilowatt peak - the maximum power output of your solar system">ℹ️</span>
                                </label>
                                <div class="input-with-slider">
                                    <input type="number" id="systemSize" name="systemSize" 
                                           value="<?php echo $systemSize; ?>" min="1" max="<?php echo $solarCalc['maxSystemSize']; ?>" step="0.5">
                                    <input type="range" id="systemSizeSlider" 
                                           value="<?php echo $systemSize; ?>" min="1" max="<?php echo $solarCalc['maxSystemSize']; ?>" step="0.5">
                                </div>
                                <div class="system-info">
                                    <div class="info-row">
                                        <span class="info-label">Number of Panels:</span>
                                        <span class="info-value"><?php echo $solarCalc['numPanels']; ?> panels (510W each)</span>
                                    </div>
                                    <div class="info-row">
                                        <span class="info-label">Monthly Generation:</span>
                                        <span class="info-value"><?php echo number_format($solarCalc['solarGeneration'], 0); ?> kWh</span>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" class="btn-use-calculation" name="action" value="recalculate">Recalculate</button>
                        </div>

                        <div class="calculator-results">
                            <h3>Your Potential Savings</h3>

                            <!-- Savings Card -->
                            <div class="savings-card">
                                <div class="savings-row">
                                    <span>Current Monthly Bill:</span>
                                    <span class="amount">RM <?php echo number_format($solarCalc['currentBill'], 2); ?></span>
                                </div>
                                <div class="savings-row">
                                    <span>Bill After Solar:</span>
                                    <span class="amount">RM <?php echo number_format($solarCalc['billAfterSolar'], 2); ?></span>
                                </div>
                                <div class="savings-row highlight">
                                    <span><strong>Monthly Savings:</strong></span>
                                    <span class="amount savings">RM <?php echo number_format($solarCalc['monthlySavings'], 2); ?></span>
                                </div>
                                <div class="savings-row">
                                    <span>Annual Savings:</span>
                                    <span class="amount total">RM <?php echo number_format($solarCalc['annualSavings'], 2); ?></span>
                                </div>
                                <div class="savings-row">
                                    <span>10-Year Savings:</span>
                                    <span class="amount total">RM <?php echo number_format($solarCalc['tenYearSavings'], 2); ?></span>
                                </div>
                            </div>

                            <!-- Pricing Section -->
                            <div class="pricing-section">
                                <h4>💵 System Pricing</h4>
                                <div class="system-cost">
                                    <div class="cost-row">
                                        <span>System Cost:</span>
                                        <span class="price">RM <?php echo number_format($solarCalc['systemCost'], 2); ?></span>
                                    </div>
                                    <div class="cost-row discount">
                                        <span>Solar ATAP Discount:</span>
                                        <span class="price">-RM 500.00</span>
                                    </div>
                                    <div class="cost-row">
                                        <span><strong>Final Cost:</strong></span>
                                        <span class="price"><strong>RM <?php echo number_format($solarCalc['discountedCost'], 2); ?></strong></span>
                                    </div>
                                </div>

                                <div class="purchase-options">
                                    <div class="purchase-option">
                                        <h5>Full Payment</h5>
                                        <p class="price-large">RM <?php echo number_format($solarCalc['discountedCost'], 0); ?></p>
                                        <p class="small-text">One-time payment</p>
                                    </div>
                                    <div class="purchase-option">
                                        <h5>3-Year Plan</h5>
                                        <p class="price-large">RM <?php echo number_format($solarCalc['discountedCost'] / 36, 0); ?> <span>/month</span></p>
                                        <p class="small-text">36 months installment</p>
                                    </div>
                                    <div class="purchase-option">
                                        <h5>5-Year Plan</h5>
                                        <p class="price-large">RM <?php echo number_format($solarCalc['discountedCost'] / 60, 0); ?> <span>/month</span></p>
                                        <p class="small-text">60 months installment</p>
                                    </div>
                                </div>

                                <div class="payback-period">
                                    <strong>Payback Period</strong>
                                    <span><?php echo number_format($solarCalc['paybackPeriod'], 1); ?> years</span>
                                </div>

                                <button type="button" class="btn-cta" onclick="window.location.href='#contact'">Get Free Quote</button>

                                <div class="disclaimer">
                                    <p><strong>⚠️ Important Notes:</strong></p>
                                    <ul>
                                        <li>Calculations are estimates based on average Malaysian solar conditions</li>
                                        <li>Actual savings may vary based on weather, panel orientation, and usage patterns</li>
                                        <li>Export rate capped at 60% of your TNB bill (NEM regulations)</li>
                                        <li>Prices include installation, equipment, and Solar ATAP discount</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </section>

        <!-- About Section -->
        <section id="about" class="about-section">
            <div class="container">
                <h2>Why Choose Solar Energy?</h2>
                <div class="benefits-grid">
                    <div class="benefit-card">
                        <div class="benefit-icon">💰</div>
                        <h3>Save Money</h3>
                        <p>Reduce your electricity bills by up to 90% with solar energy</p>
                    </div>
                    <div class="benefit-card">
                        <div class="benefit-icon">🌍</div>
                        <h3>Go Green</h3>
                        <p>Reduce your carbon footprint and help protect the environment</p>
                    </div>
                    <div class="benefit-card">
                        <div class="benefit-icon">📈</div>
                        <h3>Increase Value</h3>
                        <p>Solar panels increase your property value and attract buyers</p>
                    </div>
                    <div class="benefit-card">
                        <div class="benefit-icon">🔋</div>
                        <h3>Energy Independence</h3>
                        <p>Generate your own clean electricity and reduce grid dependence</p>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer id="contact">
        <div class="container">
            <p>&copy; 2025 Solar Savings Calculator. Powered by clean energy. | <a href="#calculator">Back to Top</a></p>
        </div>
    </footer>

    <script src="calculator-client.js"></script>
</body>
</html>
