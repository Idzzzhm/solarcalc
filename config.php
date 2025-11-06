<?php
/**
 * Configuration File for Solar Calculator
 * Modify these values according to your local tariffs and conditions
 */

return [
    // Electricity Rates (Malaysia - TNB)
    'electricity_rate' => 0.2185,  // RM per kWh (average)
    'export_rate' => 0.20,  // RM per kWh for exported electricity (NEM 3.0)
    'export_cap_percentage' => 60,  // Export capped at 60% of bill (NEM regulations)
    
    // Solar System Specifications
    'solar_generation_factor' => 102.5,  // kWh per kWp per month (Malaysia average)
    'panel_power' => 510,  // Watts per panel (modern standard)
    'cost_per_kwp' => 2368,  // RM per kWp installed
    'atap_discount' => 500,  // RM discount (Solar ATAP program)
    
    // System Limits (Malaysia NEM regulations)
    'single_phase_limit' => 7.14,  // kWp
    'three_phase_limit' => 16.32,  // kWp
    
    // Appliance Power Ratings (Watts)
    'appliances' => [
        'led' => [
            'name' => 'LED Bulbs',
            'icon' => '💡',
            'power' => 10,
            'unit' => '10W each',
            'default_qty' => 10,
            'default_hours' => 5,
            'default_peak' => 1
        ],
        'fan' => [
            'name' => 'Ceiling Fan',
            'icon' => '🌀',
            'power' => 75,
            'unit' => '75W each',
            'default_qty' => 4,
            'default_hours' => 8,
            'default_peak' => 5
        ],
        'ac' => [
            'name' => 'Air Conditioner',
            'icon' => '❄️',
            'power' => 1000,
            'unit' => '1000W each',
            'default_qty' => 2,
            'default_hours' => 6,
            'default_peak' => 3
        ],
        'fridge' => [
            'name' => 'Refrigerator',
            'icon' => '🧊',
            'power' => 150,
            'unit' => '150W each',
            'default_qty' => 1,
            'default_hours' => 24,
            'default_peak' => 10
        ],
        'tv' => [
            'name' => 'Television',
            'icon' => '📺',
            'power' => 100,
            'unit' => '100W each',
            'default_qty' => 2,
            'default_hours' => 4,
            'default_peak' => 1
        ],
        'washer' => [
            'name' => 'Washing Machine',
            'icon' => '🧺',
            'power' => 500,
            'unit' => '500W each',
            'default_qty' => 1,
            'default_hours' => 1,
            'default_peak' => 0.8
        ],
        'heater' => [
            'name' => 'Water Heater',
            'icon' => '🚿',
            'power' => 2000,
            'unit' => '2000W each',
            'default_qty' => 1,
            'default_hours' => 1,
            'default_peak' => 0.2
        ],
        'microwave' => [
            'name' => 'Microwave',
            'icon' => '🍽️',
            'power' => 1200,
            'unit' => '1200W each',
            'default_qty' => 1,
            'default_hours' => 0.5,
            'default_peak' => 0.3
        ],
        'computer' => [
            'name' => 'Computer/Laptop',
            'icon' => '💻',
            'power' => 150,
            'unit' => '150W each',
            'default_qty' => 2,
            'default_hours' => 6,
            'default_peak' => 4
        ],
        'kettle' => [
            'name' => 'Electric Kettle',
            'icon' => '☕',
            'power' => 1500,
            'unit' => '1500W each',
            'default_qty' => 1,
            'default_hours' => 0.5,
            'default_peak' => 0.25
        ],
        'iron' => [
            'name' => 'Iron',
            'icon' => '👔',
            'power' => 1000,
            'unit' => '1000W each',
            'default_qty' => 1,
            'default_hours' => 0.5,
            'default_peak' => 0.35
        ],
        'router' => [
            'name' => 'WiFi Router',
            'icon' => '📡',
            'power' => 10,
            'unit' => '10W each',
            'default_qty' => 1,
            'default_hours' => 24,
            'default_peak' => 10
        ]
    ],
    
    // Default Calculator Values
    'defaults' => [
        'monthly_bill' => 300,
        'direct_usage' => 65,
        'system_type' => 'single',
        'system_size' => 5
    ]
];
?>
