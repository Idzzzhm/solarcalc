// Solar Calculator Logic
class SolarCalculator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.calculate();
    }

    initializeElements() {
        // Input elements
        this.monthlyBillInput = document.getElementById('monthlyBill');
        this.monthlyBillSlider = document.getElementById('monthlyBillSlider');
        this.directUsageInput = document.getElementById('directUsage');
        this.directUsageSlider = document.getElementById('directUsageSlider');
        this.systemTypeSelect = document.getElementById('systemType');
        this.systemSizeInput = document.getElementById('systemSize');
        this.systemSizeSlider = document.getElementById('systemSizeSlider');

        // Display elements
        this.totalUsageDisplay = document.getElementById('totalUsage');
        this.solarUsageDisplay = document.getElementById('solarUsage');
        this.numPanelsDisplay = document.getElementById('numPanels');
        this.solarGenerationDisplay = document.getElementById('solarGeneration');
        this.currentBillDisplay = document.getElementById('currentBill');
        this.billAfterSolarDisplay = document.getElementById('billAfterSolar');
        this.monthlySavingsDisplay = document.getElementById('monthlySavings');
        this.annualSavingsDisplay = document.getElementById('annualSavings');
        this.tenYearSavingsDisplay = document.getElementById('tenYearSavings');
        this.systemCostDisplay = document.getElementById('systemCost');
        this.discountedCostDisplay = document.getElementById('discountedCost');
        this.paybackPeriodDisplay = document.getElementById('paybackPeriod');

        // Appliance calculator elements
        this.applianceQtyInputs = document.querySelectorAll('.appliance-qty');
        this.applianceHoursInputs = document.querySelectorAll('.appliance-hours');
        this.dailyKwhUsageDisplay = document.getElementById('dailyKwhUsage');
        this.dailyBillDisplay = document.getElementById('dailyBill');
        this.totalKwhUsageDisplay = document.getElementById('totalKwhUsage');
        this.estimatedBillDisplay = document.getElementById('estimatedBill');
        this.directSolarPercentDisplay = document.getElementById('directSolarPercent');
        this.useCalculationBtn = document.getElementById('useCalculation');

        // Constants
        this.ELECTRICITY_RATE = 0.2185; // RM per kWh (average TNB rate)
        this.SOLAR_GENERATION_FACTOR = 102.5; // kWh per kWp per month (Malaysia average)
        this.PANEL_POWER = 510; // Watts per panel (typical modern panel)
        this.COST_PER_KWP = 2368; // RM per kWp installed
        this.ATAP_DISCOUNT = 500; // RM discount
        this.EXPORT_RATE = 0.20; // RM per kWh for exported electricity

        // Appliance power ratings (in Watts)
        this.APPLIANCE_POWER = {
            led: 10,
            fan: 75,
            ac: 1000,
            fridge: 150,
            tv: 100,
            washer: 500,
            heater: 2000,
            microwave: 1200,
            computer: 150,
            kettle: 1500,
            iron: 1000,
            router: 10
        };

        // Typical percentage of usage during solar hours (8am-6pm) for each appliance
        // Based on common Malaysian household patterns
        this.SOLAR_HOUR_USAGE_PERCENT = {
            led: 10,        // Mostly used at night
            fan: 70,        // Used throughout the day
            ac: 60,         // Daytime and evening use
            fridge: 42,     // 24/7 device, ~10hrs of 24hrs is during solar
            tv: 30,         // Mostly evening use
            washer: 80,     // Usually used during daytime
            heater: 20,     // Morning and evening showers
            microwave: 60,  // Lunch and some breakfast/dinner prep
            computer: 70,   // Work from home during day
            kettle: 50,     // Morning and afternoon tea
            iron: 70,       // Usually done during daytime
            router: 42      // 24/7 device, ~10hrs of 24hrs is during solar
        };
    }

    bindEvents() {
        // Sync number inputs with sliders
        this.monthlyBillInput.addEventListener('input', (e) => {
            this.monthlyBillSlider.value = e.target.value;
            this.updateSliderBackground(this.monthlyBillSlider);
            this.calculate();
        });

        this.monthlyBillSlider.addEventListener('input', (e) => {
            this.monthlyBillInput.value = e.target.value;
            this.updateSliderBackground(e.target);
            this.calculate();
        });

        this.directUsageInput.addEventListener('input', (e) => {
            this.directUsageSlider.value = e.target.value;
            this.updateSliderBackground(this.directUsageSlider);
            this.calculate();
        });

        this.directUsageSlider.addEventListener('input', (e) => {
            this.directUsageInput.value = e.target.value;
            this.updateSliderBackground(e.target);
            this.calculate();
        });

        this.systemSizeInput.addEventListener('input', (e) => {
            this.systemSizeSlider.value = e.target.value;
            this.updateSliderBackground(this.systemSizeSlider);
            this.calculate();
        });

        this.systemSizeSlider.addEventListener('input', (e) => {
            this.systemSizeInput.value = e.target.value;
            this.updateSliderBackground(e.target);
            this.calculate();
        });

        this.systemTypeSelect.addEventListener('change', () => {
            this.updateSystemLimits();
            this.calculate();
        });

        // Appliance calculator events
        this.applianceQtyInputs.forEach(input => {
            input.addEventListener('input', () => this.calculateFromAppliances());
        });

        this.applianceHoursInputs.forEach(input => {
            input.addEventListener('input', () => this.calculateFromAppliances());
        });

        this.useCalculationBtn.addEventListener('click', () => {
            this.transferApplianceCalculation();
        });

        // Initialize slider backgrounds
        this.updateSliderBackground(this.monthlyBillSlider);
        this.updateSliderBackground(this.directUsageSlider);
        this.updateSliderBackground(this.systemSizeSlider);

        // Calculate appliances on init
        this.calculateFromAppliances();
    }

    updateSystemLimits() {
        const systemType = this.systemTypeSelect.value;
        const maxKwp = systemType === 'single' ? 7.14 : 16.32;
        
        this.systemSizeInput.max = maxKwp;
        this.systemSizeSlider.max = maxKwp;
        
        // Adjust current value if it exceeds new max
        if (parseFloat(this.systemSizeInput.value) > maxKwp) {
            this.systemSizeInput.value = maxKwp;
            this.systemSizeSlider.value = maxKwp;
        }
    }

    updateSliderBackground(slider) {
        const min = parseFloat(slider.min);
        const max = parseFloat(slider.max);
        const value = parseFloat(slider.value);
        const percentage = ((value - min) / (max - min)) * 100;
        
        slider.style.background = `linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) ${percentage}%, var(--border-color) ${percentage}%, var(--border-color) 100%)`;
    }

    calculate() {
        // Get input values
        const monthlyBill = parseFloat(this.monthlyBillInput.value);
        const directUsagePercent = parseFloat(this.directUsageInput.value);
        const systemSize = parseFloat(this.systemSizeInput.value);

        // Calculate total usage from bill
        const totalUsageKwh = this.calculateUsageFromBill(monthlyBill);
        
        // Calculate solar generation
        const solarGenerationKwh = systemSize * this.SOLAR_GENERATION_FACTOR;
        
        // Calculate direct solar usage
        const directSolarUsageKwh = (directUsagePercent / 100) * solarGenerationKwh;
        
        // Calculate exported solar
        const exportedSolarKwh = solarGenerationKwh - directSolarUsageKwh;
        
        // Calculate savings
        const directUsageSavings = directSolarUsageKwh * this.ELECTRICITY_RATE;
        const exportSavings = Math.min(exportedSolarKwh * this.EXPORT_RATE, monthlyBill * 0.6); // Cap at 60% of energy charges
        const monthlySavings = directUsageSavings + exportSavings;
        
        // Calculate bill after solar
        const billAfterSolar = Math.max(monthlyBill - monthlySavings, 0);
        
        // Calculate annual and 10-year savings
        const annualSavings = monthlySavings * 12;
        const tenYearSavings = annualSavings * 10;
        
        // Calculate system costs
        const systemCost = systemSize * this.COST_PER_KWP;
        const discountedCost = systemCost - this.ATAP_DISCOUNT;
        
        // Calculate payback period
        const paybackYears = discountedCost / annualSavings;
        
        // Calculate number of panels
        const numPanels = Math.ceil((systemSize * 1000) / this.PANEL_POWER);
        
        // Calculate recommended system size
        const recommendedSize = this.calculateRecommendedSize(totalUsageKwh, directUsagePercent);
        const isRecommended = Math.abs(systemSize - recommendedSize) < 0.5;
        
        // Update displays
        this.updateDisplays({
            totalUsageKwh,
            directSolarUsageKwh: (directUsagePercent / 100) * totalUsageKwh,
            solarGenerationKwh,
            numPanels,
            monthlyBill,
            billAfterSolar,
            monthlySavings,
            annualSavings,
            tenYearSavings,
            systemCost,
            discountedCost,
            paybackYears,
            isRecommended
        });
    }

    calculateUsageFromBill(bill) {
        // Simplified TNB tariff calculation (reverse engineering from bill)
        // Real tariff is tiered, but this is a reasonable approximation
        return bill / this.ELECTRICITY_RATE;
    }

    calculateRecommendedSize(totalUsageKwh, directUsagePercent) {
        // Recommend a system that covers about 80% of usage
        // Accounting for direct usage efficiency
        const targetGeneration = totalUsageKwh * 0.8;
        const adjustedForDirectUsage = targetGeneration / (directUsagePercent / 100 + 0.3); // Factor in export
        return Math.min(adjustedForDirectUsage / this.SOLAR_GENERATION_FACTOR, 16.32);
    }

    updateDisplays(data) {
        // Format and update all display elements
        this.totalUsageDisplay.textContent = `${this.formatNumber(data.totalUsageKwh)} kWh`;
        this.solarUsageDisplay.textContent = `${this.formatNumber(data.directSolarUsageKwh)} kWh`;
        this.solarGenerationDisplay.textContent = `${this.formatNumber(data.solarGenerationKwh)} kWh/month`;
        this.numPanelsDisplay.textContent = data.numPanels;
        
        this.currentBillDisplay.textContent = `RM ${this.formatCurrency(data.monthlyBill)}`;
        this.billAfterSolarDisplay.textContent = `RM ${this.formatCurrency(data.billAfterSolar)}`;
        this.monthlySavingsDisplay.textContent = `RM ${this.formatCurrency(data.monthlySavings)}`;
        this.annualSavingsDisplay.textContent = `RM ${this.formatCurrency(data.annualSavings)}`;
        this.tenYearSavingsDisplay.textContent = `RM ${this.formatCurrency(data.tenYearSavings)}`;
        
        this.systemCostDisplay.textContent = `RM ${this.formatCurrency(data.systemCost)}`;
        this.discountedCostDisplay.textContent = `RM ${this.formatCurrency(data.discountedCost)}`;
        
        this.paybackPeriodDisplay.textContent = `${data.paybackYears.toFixed(1)} years`;
        
        // Update recommended badge
        const badge = document.getElementById('recommendedBadge');
        if (data.isRecommended) {
            badge.style.display = 'inline';
        } else {
            badge.style.display = 'none';
        }
    }

    formatNumber(num, decimals = 0) {
        if (decimals > 0) {
            return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        return Math.round(num).toLocaleString('en-MY');
    }

    formatCurrency(num) {
        return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    calculateFromAppliances() {
        let totalDailyKwh = 0;
        let solarHourKwh = 0;

        // Calculate for each appliance type
        this.applianceQtyInputs.forEach(input => {
            const appliance = input.dataset.appliance;
            const qty = parseFloat(input.value) || 0;
            const hoursInput = document.querySelector(`.appliance-hours[data-appliance="${appliance}"]`);
            const hoursPerDay = parseFloat(hoursInput.value) || 0;
            
            // Get power rating for this appliance
            const powerWatts = this.APPLIANCE_POWER[appliance] || 0;
            
            // Calculate daily kWh: (Watts × Quantity × Hours/day) / 1000
            const dailyKwh = (powerWatts * qty * hoursPerDay) / 1000;
            totalDailyKwh += dailyKwh;

            // Calculate kWh used during solar hours based on typical patterns
            const solarUsagePercent = this.SOLAR_HOUR_USAGE_PERCENT[appliance] || 40;
            const applianceSolarKwh = dailyKwh * (solarUsagePercent / 100);
            solarHourKwh += applianceSolarKwh;
        });

        // Calculate monthly values
        const totalMonthlyKwh = totalDailyKwh * 30;
        
        // Calculate bills
        const dailyBill = totalDailyKwh * this.ELECTRICITY_RATE;
        const monthlyBill = totalMonthlyKwh * this.ELECTRICITY_RATE;

        // Calculate direct solar usage percentage
        // This represents how much of the total daily usage happens during solar generation hours
        const directSolarPercent = totalDailyKwh > 0 ? (solarHourKwh / totalDailyKwh) * 100 : 0;

        // Update displays
        this.dailyKwhUsageDisplay.textContent = `${this.formatNumber(totalDailyKwh, 2)} kWh`;
        this.dailyBillDisplay.textContent = `RM ${this.formatCurrency(dailyBill)}`;
        this.totalKwhUsageDisplay.textContent = `${this.formatNumber(totalMonthlyKwh)} kWh`;
        this.estimatedBillDisplay.textContent = `RM ${this.formatCurrency(monthlyBill)}`;
        this.directSolarPercentDisplay.textContent = `${Math.round(directSolarPercent)}%`;

        // Store for transfer
        this.calculatedBill = monthlyBill;
        this.calculatedKwh = totalMonthlyKwh;
        this.calculatedDailyKwh = totalDailyKwh;
        this.calculatedDirectSolarPercent = Math.round(directSolarPercent);
    }

    transferApplianceCalculation() {
        if (this.calculatedBill > 0) {
            // Update monthly bill inputs
            this.monthlyBillInput.value = Math.round(this.calculatedBill);
            this.monthlyBillSlider.value = Math.round(this.calculatedBill);
            this.updateSliderBackground(this.monthlyBillSlider);
            
            // Update direct solar usage percentage
            if (this.calculatedDirectSolarPercent) {
                this.directUsageInput.value = this.calculatedDirectSolarPercent;
                this.directUsageSlider.value = this.calculatedDirectSolarPercent;
                this.updateSliderBackground(this.directUsageSlider);
            }
            
            // Recalculate solar savings
            this.calculate();
            
            // Scroll to solar calculator section
            document.getElementById('calculator').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });

            // Visual feedback
            this.useCalculationBtn.textContent = '✓ Applied! Scroll Down';
            setTimeout(() => {
                this.useCalculationBtn.textContent = 'Use These Values ↓';
            }, 2000);
        }
    }
}

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SolarCalculator();
    
    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
