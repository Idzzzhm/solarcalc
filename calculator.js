// Solar Calculator Logic - Full JavaScript Implementation
class SolarCalculator {
    constructor() {
        // Constants
        this.ELECTRICITY_RATE = 0.2185; // RM per kWh (average TNB rate)
        this.SOLAR_GENERATION_FACTOR = 102.5; // kWh per kWp per month (Malaysia average)
        this.PANEL_POWER = 510; // Watts per panel (typical modern panel)
        this.COST_PER_KWP = 2368; // RM per kWp installed
        this.ATAP_DISCOUNT = 500; // RM discount
        this.EXPORT_RATE = 0.20; // RM per kWh for exported electricity

        // Appliance power ratings (Watts)
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

        this.initializeElements();
        this.bindEvents();
        this.calculate();
        this.calculateApplianceUsage();
    }

    initializeElements() {
        // Solar Calculator Input elements
        this.monthlyBillInput = document.getElementById('monthlyBill');
        this.monthlyBillSlider = document.getElementById('monthlyBillSlider');
        this.directUsageInput = document.getElementById('directUsage');
        this.directUsageSlider = document.getElementById('directUsageSlider');
        this.systemTypeSelect = document.getElementById('systemType');
        this.systemSizeInput = document.getElementById('systemSize');
        this.systemSizeSlider = document.getElementById('systemSizeSlider');

        // Solar Calculator Display elements
        this.totalUsageDisplay = document.getElementById('totalUsage');
        this.solarGenerationDisplay = document.getElementById('solarGeneration');
        this.numPanelsDisplay = document.getElementById('numPanels');
        this.currentBillDisplay = document.getElementById('currentBill');
        this.billAfterSolarDisplay = document.getElementById('billAfterSolar');
        this.monthlySavingsDisplay = document.getElementById('monthlySavings');
        this.annualSavingsDisplay = document.getElementById('annualSavings');
        this.tenYearSavingsDisplay = document.getElementById('tenYearSavings');
        this.systemCostDisplay = document.getElementById('systemCost');
        this.discountedCostDisplay = document.getElementById('discountedCost');
        this.paybackPeriodDisplay = document.getElementById('paybackPeriod');

        // Payment options
        this.fullPaymentDisplay = document.getElementById('fullPayment');
        this.threeYearDisplay = document.getElementById('threeYearPayment');
        this.fiveYearDisplay = document.getElementById('fiveYearPayment');

        // Appliance calculator elements
        this.applianceQtyInputs = document.querySelectorAll('.appliance-qty');
        this.applianceHoursInputs = document.querySelectorAll('.appliance-hours');
        this.appliancePeakHoursInputs = document.querySelectorAll('.appliance-peak-hours');
        this.dailyKwhUsageDisplay = document.getElementById('dailyKwhUsage');
        this.dailyBillDisplay = document.getElementById('dailyBill');
        this.totalKwhUsageDisplay = document.getElementById('totalKwhUsage');
        this.estimatedBillDisplay = document.getElementById('estimatedBill');
        this.directSolarPercentDisplay = document.getElementById('directSolarPercent');
        this.useCalculationBtn = document.getElementById('useCalculation');

        // Peak hours configuration
        this.solarStartTime = document.getElementById('solarStartTime');
        this.solarEndTime = document.getElementById('solarEndTime');
        this.solarDuration = document.getElementById('solarDuration');
    }

    bindEvents() {
        // Solar Calculator: Sync number inputs with sliders
        if (this.monthlyBillInput && this.monthlyBillSlider) {
            this.monthlyBillInput.addEventListener('input', () => this.syncSlider('monthlyBill'));
            this.monthlyBillSlider.addEventListener('input', () => this.syncInput('monthlyBill'));
        }

        if (this.directUsageInput && this.directUsageSlider) {
            this.directUsageInput.addEventListener('input', () => this.syncSlider('directUsage'));
            this.directUsageSlider.addEventListener('input', () => this.syncInput('directUsage'));
        }

        if (this.systemSizeInput && this.systemSizeSlider) {
            this.systemSizeInput.addEventListener('input', () => this.syncSlider('systemSize'));
            this.systemSizeSlider.addEventListener('input', () => this.syncInput('systemSize'));
        }

        // System type change
        if (this.systemTypeSelect) {
            this.systemTypeSelect.addEventListener('change', () => {
                this.updateSystemLimits();
                this.calculate();
            });
        }

        // Appliance calculator inputs
        this.applianceQtyInputs.forEach(input => {
            input.addEventListener('input', () => this.calculateApplianceUsage());
        });

        this.applianceHoursInputs.forEach(input => {
            input.addEventListener('input', () => this.calculateApplianceUsage());
        });

        this.appliancePeakHoursInputs.forEach(input => {
            input.addEventListener('input', () => this.calculateApplianceUsage());
        });

        // Peak hours configuration
        if (this.solarStartTime && this.solarEndTime) {
            this.solarStartTime.addEventListener('change', () => this.updateSolarDuration());
            this.solarEndTime.addEventListener('change', () => this.updateSolarDuration());
        }

        // Use calculation button
        if (this.useCalculationBtn) {
            this.useCalculationBtn.addEventListener('click', () => this.transferToSolarCalculator());
        }
    }

    syncSlider(name) {
        const input = document.getElementById(name);
        const slider = document.getElementById(name + 'Slider');
        if (input && slider) {
            slider.value = input.value;
            this.updateSliderBackground(slider);
            this.calculate();
        }
    }

    syncInput(name) {
        const input = document.getElementById(name);
        const slider = document.getElementById(name + 'Slider');
        if (input && slider) {
            input.value = slider.value;
            this.updateSliderBackground(slider);
            this.calculate();
        }
    }

    updateSliderBackground(slider) {
        const min = parseFloat(slider.min) || 0;
        const max = parseFloat(slider.max) || 100;
        const value = parseFloat(slider.value);
        const percentage = ((value - min) / (max - min)) * 100;
        
        slider.style.background = `linear-gradient(to right, #6366F1 0%, #6366F1 ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`;
    }

    updateSystemLimits() {
        const systemType = this.systemTypeSelect.value;
        const maxSize = systemType === 'single' ? 7.14 : 16.32;
        
        if (this.systemSizeInput) {
            this.systemSizeInput.max = maxSize;
            if (parseFloat(this.systemSizeInput.value) > maxSize) {
                this.systemSizeInput.value = maxSize;
            }
        }
        
        if (this.systemSizeSlider) {
            this.systemSizeSlider.max = maxSize;
            if (parseFloat(this.systemSizeSlider.value) > maxSize) {
                this.systemSizeSlider.value = maxSize;
            }
            this.updateSliderBackground(this.systemSizeSlider);
        }
    }

    calculate() {
        // Get input values
        const monthlyBill = parseFloat(this.monthlyBillInput?.value) || 300;
        const directUsagePercent = parseFloat(this.directUsageInput?.value) || 65;
        const systemSize = parseFloat(this.systemSizeInput?.value) || 5;

        // Calculate total usage from bill (simplified tiered tariff)
        const totalUsage = monthlyBill / this.ELECTRICITY_RATE;

        // Calculate solar generation
        const solarGeneration = systemSize * this.SOLAR_GENERATION_FACTOR;

        // Calculate number of panels
        const numPanels = Math.ceil((systemSize * 1000) / this.PANEL_POWER);

        // Calculate direct usage and export
        const directUsageKwh = (directUsagePercent / 100) * solarGeneration;
        const exportKwh = solarGeneration - directUsageKwh;

        // Calculate savings
        const directSavings = directUsageKwh * this.ELECTRICITY_RATE;
        const exportSavings = Math.min(exportKwh * this.EXPORT_RATE, monthlyBill * 0.6);
        let monthlySavings = directSavings + exportSavings;

        // Ensure savings don't exceed the bill
        if (monthlySavings > monthlyBill) {
            monthlySavings = monthlyBill;
        }

        const billAfterSolar = monthlyBill - monthlySavings;
        const annualSavings = monthlySavings * 12;
        const tenYearSavings = annualSavings * 10;

        // Calculate costs
        const systemCost = systemSize * this.COST_PER_KWP;
        const discountedCost = systemCost - this.ATAP_DISCOUNT;

        // Calculate payback period
        const paybackPeriod = monthlySavings > 0 ? discountedCost / (monthlySavings * 12) : 0;

        // Update displays
        this.updateDisplays({
            totalUsage,
            solarGeneration,
            numPanels,
            monthlyBill,
            billAfterSolar,
            monthlySavings,
            annualSavings,
            tenYearSavings,
            systemCost,
            discountedCost,
            paybackPeriod
        });
    }

    updateDisplays(data) {
        if (this.totalUsageDisplay) this.totalUsageDisplay.textContent = this.formatNumber(data.totalUsage, 0);
        if (this.solarGenerationDisplay) this.solarGenerationDisplay.textContent = this.formatNumber(data.solarGeneration, 0);
        if (this.numPanelsDisplay) this.numPanelsDisplay.textContent = data.numPanels;
        if (this.currentBillDisplay) this.currentBillDisplay.textContent = this.formatCurrency(data.monthlyBill);
        if (this.billAfterSolarDisplay) this.billAfterSolarDisplay.textContent = this.formatCurrency(data.billAfterSolar);
        if (this.monthlySavingsDisplay) this.monthlySavingsDisplay.textContent = this.formatCurrency(data.monthlySavings);
        if (this.annualSavingsDisplay) this.annualSavingsDisplay.textContent = this.formatCurrency(data.annualSavings);
        if (this.tenYearSavingsDisplay) this.tenYearSavingsDisplay.textContent = this.formatCurrency(data.tenYearSavings);
        if (this.systemCostDisplay) this.systemCostDisplay.textContent = this.formatCurrency(data.systemCost);
        if (this.discountedCostDisplay) this.discountedCostDisplay.textContent = this.formatCurrency(data.discountedCost);
        if (this.paybackPeriodDisplay) this.paybackPeriodDisplay.textContent = this.formatNumber(data.paybackPeriod, 1);

        // Update payment options
        if (this.fullPaymentDisplay) this.fullPaymentDisplay.textContent = this.formatNumber(data.discountedCost, 0);
        if (this.threeYearDisplay) this.threeYearDisplay.textContent = this.formatNumber(data.discountedCost / 36, 0);
        if (this.fiveYearDisplay) this.fiveYearDisplay.textContent = this.formatNumber(data.discountedCost / 60, 0);
    }

    calculateApplianceUsage() {
        let dailyKwh = 0;
        let solarKwh = 0;

        // Calculate for each appliance
        this.applianceQtyInputs.forEach(input => {
            const appliance = input.dataset.appliance;
            const qty = parseFloat(input.value) || 0;
            const hoursInput = document.querySelector(`.appliance-hours[data-appliance="${appliance}"]`);
            const peakHoursInput = document.querySelector(`.appliance-peak-hours[data-appliance="${appliance}"]`);
            
            const hours = parseFloat(hoursInput?.value) || 0;
            const peakHours = parseFloat(peakHoursInput?.value) || 0;
            const power = this.APPLIANCE_POWER[appliance] || 0;

            // Calculate daily consumption
            const applianceDailyKwh = (power * qty * hours) / 1000;
            dailyKwh += applianceDailyKwh;

            // Calculate solar hour usage
            const applianceSolarKwh = (power * qty * peakHours) / 1000;
            solarKwh += applianceSolarKwh;
        });

        // Calculate monthly values
        const monthlyKwh = dailyKwh * 30;
        const dailyBill = dailyKwh * this.ELECTRICITY_RATE;
        const monthlyBill = monthlyKwh * this.ELECTRICITY_RATE;

        // Calculate direct solar percentage
        const solarPercent = dailyKwh > 0 ? (solarKwh / dailyKwh) * 100 : 0;

        // Update displays
        if (this.dailyKwhUsageDisplay) this.dailyKwhUsageDisplay.textContent = this.formatNumber(dailyKwh, 2);
        if (this.dailyBillDisplay) this.dailyBillDisplay.textContent = this.formatNumber(dailyBill, 2);
        if (this.totalKwhUsageDisplay) this.totalKwhUsageDisplay.textContent = this.formatNumber(monthlyKwh, 2);
        if (this.estimatedBillDisplay) this.estimatedBillDisplay.textContent = this.formatNumber(monthlyBill, 2);
        if (this.directSolarPercentDisplay) this.directSolarPercentDisplay.textContent = this.formatNumber(solarPercent, 1);
    }

    updateSolarDuration() {
        if (!this.solarStartTime || !this.solarEndTime || !this.solarDuration) return;

        const start = this.solarStartTime.value.split(':');
        const end = this.solarEndTime.value.split(':');

        const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1]);
        const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1]);

        let duration = (endMinutes - startMinutes) / 60;
        if (duration < 0) duration += 24;

        this.solarDuration.textContent = `${duration.toFixed(1)} hours`;
    }

    transferToSolarCalculator() {
        const monthlyBill = parseFloat(this.estimatedBillDisplay?.textContent) || 300;
        const solarPercent = parseFloat(this.directSolarPercentDisplay?.textContent) || 65;

        if (this.monthlyBillInput) {
            this.monthlyBillInput.value = monthlyBill;
            this.monthlyBillSlider.value = monthlyBill;
            this.updateSliderBackground(this.monthlyBillSlider);
        }

        if (this.directUsageInput) {
            this.directUsageInput.value = solarPercent;
            this.directUsageSlider.value = solarPercent;
            this.updateSliderBackground(this.directUsageSlider);
        }

        this.calculate();

        // Smooth scroll to calculator
        const calculatorSection = document.getElementById('calculator');
        if (calculatorSection) {
            calculatorSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    formatNumber(number, decimals = 2) {
        return number.toLocaleString('en-MY', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    formatCurrency(amount, decimals = 2) {
        return amount.toLocaleString('en-MY', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SolarCalculator();

    // Smooth scroll for anchor links
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

    // Initialize slider backgrounds
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        const min = parseFloat(slider.min) || 0;
        const max = parseFloat(slider.max) || 100;
        const value = parseFloat(slider.value);
        const percentage = ((value - min) / (max - min)) * 100;
        slider.style.background = `linear-gradient(to right, #6366F1 0%, #6366F1 ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`;
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.appliance-card, .benefit-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});
