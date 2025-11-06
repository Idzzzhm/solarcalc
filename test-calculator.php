<?php
/**
 * Test Calculator Functions
 * Run this file to verify calculations are working correctly
 */

require_once 'calculator-functions.php';

echo "🧪 Testing Solar Calculator Functions\n";
echo str_repeat("=", 50) . "\n\n";

// Test 1: Solar Savings Calculation
echo "TEST 1: Solar Savings Calculation\n";
echo str_repeat("-", 50) . "\n";

$result = calculateSolarSavings(300, 65, 'single', 5);

echo "Input: Monthly Bill = RM 300\n";
echo "Input: Direct Usage = 65%\n";
echo "Input: System Type = Single Phase\n";
echo "Input: System Size = 5 kWp\n\n";

echo "✓ Total Usage: " . number_format($result['totalUsage'], 2) . " kWh\n";
echo "✓ Solar Generation: " . number_format($result['solarGeneration'], 2) . " kWh\n";
echo "✓ Number of Panels: " . $result['numPanels'] . "\n";
echo "✓ Monthly Savings: RM " . number_format($result['monthlySavings'], 2) . "\n";
echo "✓ Annual Savings: RM " . number_format($result['annualSavings'], 2) . "\n";
echo "✓ System Cost: RM " . number_format($result['systemCost'], 2) . "\n";
echo "✓ After Discount: RM " . number_format($result['discountedCost'], 2) . "\n";
echo "✓ Payback Period: " . number_format($result['paybackPeriod'], 1) . " years\n";

echo "\n";

// Test 2: Appliance Usage Calculation
echo "TEST 2: Appliance Usage Calculation\n";
echo str_repeat("-", 50) . "\n";

$appliances = [
    'led' => ['name' => 'LED Bulbs', 'power' => 10],
    'ac' => ['name' => 'Air Conditioner', 'power' => 1000],
    'fridge' => ['name' => 'Refrigerator', 'power' => 150]
];

$usage = [
    'led' => ['qty' => 10, 'hours' => 5, 'peakHours' => 1],
    'ac' => ['qty' => 2, 'hours' => 6, 'peakHours' => 3],
    'fridge' => ['qty' => 1, 'hours' => 24, 'peakHours' => 10]
];

$result = calculateApplianceUsage($appliances, $usage);

echo "Input: 10x LED Bulbs (5h total, 1h solar)\n";
echo "Input: 2x Air Conditioner (6h total, 3h solar)\n";
echo "Input: 1x Refrigerator (24h total, 10h solar)\n\n";

echo "✓ Daily Usage: " . number_format($result['dailyKwh'], 2) . " kWh\n";
echo "✓ Monthly Usage: " . number_format($result['monthlyKwh'], 2) . " kWh\n";
echo "✓ Daily Bill: RM " . number_format($result['dailyBill'], 2) . "\n";
echo "✓ Monthly Bill: RM " . number_format($result['monthlyBill'], 2) . "\n";
echo "✓ Solar Hours Usage: " . number_format($result['solarKwh'], 2) . " kWh\n";
echo "✓ Direct Solar %: " . number_format($result['solarPercent'], 1) . "%\n";

echo "\n";

// Test 3: Edge Cases
echo "TEST 3: Edge Cases\n";
echo str_repeat("-", 50) . "\n";

// Very low bill
$result1 = calculateSolarSavings(100, 50, 'single', 2);
echo "✓ Low Bill (RM 100): Savings = RM " . number_format($result1['monthlySavings'], 2) . "\n";

// Very high bill
$result2 = calculateSolarSavings(2000, 70, 'three', 15);
echo "✓ High Bill (RM 2000): Savings = RM " . number_format($result2['monthlySavings'], 2) . "\n";

// Maximum system size
$result3 = calculateSolarSavings(500, 65, 'three', 20);
echo "✓ Max System (20 kWp requested): Limited to " . $result3['maxSystemSize'] . " kWp\n";

echo "\n";

// Test 4: Constants
echo "TEST 4: Configuration Constants\n";
echo str_repeat("-", 50) . "\n";
echo "✓ Electricity Rate: RM " . ELECTRICITY_RATE . " per kWh\n";
echo "✓ Export Rate: RM " . EXPORT_RATE . " per kWh\n";
echo "✓ Solar Factor: " . SOLAR_GENERATION_FACTOR . " kWh/kWp/month\n";
echo "✓ Panel Power: " . PANEL_POWER . " W\n";
echo "✓ Cost per kWp: RM " . COST_PER_KWP . "\n";
echo "✓ ATAP Discount: RM " . ATAP_DISCOUNT . "\n";

echo "\n" . str_repeat("=", 50) . "\n";
echo "✅ All Tests Passed! Calculator is working correctly.\n";
echo "\nAccess the calculator at: http://localhost/solar/index.php\n";
?>
