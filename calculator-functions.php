<?php
/**
 * Solar Calculator Functions
 * Server-side calculation logic for PHP
 */

// Constants
define('ELECTRICITY_RATE', 0.2185);  // RM per kWh
define('SOLAR_GENERATION_FACTOR', 102.5);  // kWh per kWp per month
define('PANEL_POWER', 510);  // Watts per panel
define('COST_PER_KWP', 2368);  // RM per kWp
define('ATAP_DISCOUNT', 500);  // RM discount
define('EXPORT_RATE', 0.20);  // RM per kWh

/**
 * Calculate appliance electricity usage
 */
function calculateApplianceUsage($appliances, $usage) {
    $dailyKwh = 0;
    $solarKwh = 0;
    
    foreach ($appliances as $key => $appliance) {
        if (isset($usage[$key])) {
            $qty = $usage[$key]['qty'];
            $hours = $usage[$key]['hours'];
            $peakHours = $usage[$key]['peakHours'];
            $power = $appliance['power'];
            
            // Calculate daily consumption
            $applianceDailyKwh = ($power * $qty * $hours) / 1000;
            $dailyKwh += $applianceDailyKwh;
            
            // Calculate solar hour usage
            $applianceSolarKwh = ($power * $qty * $peakHours) / 1000;
            $solarKwh += $applianceSolarKwh;
        }
    }
    
    $monthlyKwh = $dailyKwh * 30;
    $dailyBill = $dailyKwh * ELECTRICITY_RATE;
    $monthlyBill = $monthlyKwh * ELECTRICITY_RATE;
    $solarPercent = $dailyKwh > 0 ? ($solarKwh / $dailyKwh) * 100 : 0;
    
    return [
        'dailyKwh' => $dailyKwh,
        'monthlyKwh' => $monthlyKwh,
        'dailyBill' => $dailyBill,
        'monthlyBill' => $monthlyBill,
        'solarKwh' => $solarKwh,
        'solarPercent' => $solarPercent
    ];
}

/**
 * Calculate solar savings
 */
function calculateSolarSavings($monthlyBill, $directUsagePercent, $systemType, $systemSize) {
    // System limits
    $maxSystemSize = ($systemType === 'single') ? 7.14 : 16.32;
    
    // Ensure system size is within limits
    if ($systemSize > $maxSystemSize) {
        $systemSize = $maxSystemSize;
    }
    
    // Calculate total usage from bill
    $totalUsage = $monthlyBill / ELECTRICITY_RATE;
    
    // Calculate solar generation
    $solarGeneration = $systemSize * SOLAR_GENERATION_FACTOR;
    
    // Calculate number of panels
    $numPanels = ceil(($systemSize * 1000) / PANEL_POWER);
    
    // Calculate direct usage and export
    $directUsageKwh = ($directUsagePercent / 100) * $solarGeneration;
    $exportKwh = $solarGeneration - $directUsageKwh;
    
    // Calculate savings
    $directSavings = $directUsageKwh * ELECTRICITY_RATE;
    $exportSavings = min($exportKwh * EXPORT_RATE, $monthlyBill * 0.6); // Capped at 60% of bill
    $monthlySavings = $directSavings + $exportSavings;
    
    // Ensure savings don't exceed the bill
    if ($monthlySavings > $monthlyBill) {
        $monthlySavings = $monthlyBill;
    }
    
    $billAfterSolar = $monthlyBill - $monthlySavings;
    $annualSavings = $monthlySavings * 12;
    $tenYearSavings = $annualSavings * 10;
    
    // Calculate costs
    $systemCost = $systemSize * COST_PER_KWP;
    $discountedCost = $systemCost - ATAP_DISCOUNT;
    
    // Calculate payback period
    $paybackPeriod = $monthlySavings > 0 ? $discountedCost / ($monthlySavings * 12) : 0;
    
    return [
        'totalUsage' => $totalUsage,
        'solarGeneration' => $solarGeneration,
        'numPanels' => $numPanels,
        'currentBill' => $monthlyBill,
        'billAfterSolar' => $billAfterSolar,
        'monthlySavings' => $monthlySavings,
        'annualSavings' => $annualSavings,
        'tenYearSavings' => $tenYearSavings,
        'systemCost' => $systemCost,
        'discountedCost' => $discountedCost,
        'paybackPeriod' => $paybackPeriod,
        'maxSystemSize' => $maxSystemSize
    ];
}

/**
 * Format number with commas
 */
function formatNumber($number, $decimals = 2) {
    return number_format($number, $decimals);
}

/**
 * Format currency (RM)
 */
function formatCurrency($amount, $decimals = 2) {
    return 'RM ' . number_format($amount, $decimals);
}
?>
