/**
 * Client-side JavaScript for PHP version
 * Handles slider synchronization and form interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Sync number inputs with range sliders
    syncInputs();
    
    // Auto-submit form on slider change (optional)
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
        slider.addEventListener('input', function() {
            const inputId = this.id.replace('Slider', '');
            const input = document.getElementById(inputId);
            if (input) {
                input.value = this.value;
            }
        });
    });
    
    // Sync number inputs back to sliders
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', function() {
            const sliderId = this.id + 'Slider';
            const slider = document.getElementById(sliderId);
            if (slider) {
                slider.value = this.value;
                updateSliderBackground(slider);
            }
        });
    });
    
    // Update slider backgrounds on load
    sliders.forEach(slider => {
        updateSliderBackground(slider);
    });
});

function syncInputs() {
    // Monthly Bill
    const monthlyBillInput = document.getElementById('monthlyBill');
    const monthlyBillSlider = document.getElementById('monthlyBillSlider');
    
    if (monthlyBillInput && monthlyBillSlider) {
        monthlyBillInput.addEventListener('input', () => {
            monthlyBillSlider.value = monthlyBillInput.value;
            updateSliderBackground(monthlyBillSlider);
        });
        
        monthlyBillSlider.addEventListener('input', () => {
            monthlyBillInput.value = monthlyBillSlider.value;
            updateSliderBackground(monthlyBillSlider);
        });
        
        updateSliderBackground(monthlyBillSlider);
    }
    
    // Direct Usage
    const directUsageInput = document.getElementById('directUsage');
    const directUsageSlider = document.getElementById('directUsageSlider');
    
    if (directUsageInput && directUsageSlider) {
        directUsageInput.addEventListener('input', () => {
            directUsageSlider.value = directUsageInput.value;
            updateSliderBackground(directUsageSlider);
        });
        
        directUsageSlider.addEventListener('input', () => {
            directUsageInput.value = directUsageSlider.value;
            updateSliderBackground(directUsageSlider);
        });
        
        updateSliderBackground(directUsageSlider);
    }
    
    // System Size
    const systemSizeInput = document.getElementById('systemSize');
    const systemSizeSlider = document.getElementById('systemSizeSlider');
    
    if (systemSizeInput && systemSizeSlider) {
        systemSizeInput.addEventListener('input', () => {
            systemSizeSlider.value = systemSizeInput.value;
            updateSliderBackground(systemSizeSlider);
        });
        
        systemSizeSlider.addEventListener('input', () => {
            systemSizeInput.value = systemSizeSlider.value;
            updateSliderBackground(systemSizeSlider);
        });
        
        updateSliderBackground(systemSizeSlider);
    }
}

function updateSliderBackground(slider) {
    const min = slider.min || 0;
    const max = slider.max || 100;
    const value = slider.value;
    const percentage = ((value - min) / (max - min)) * 100;
    
    slider.style.background = `linear-gradient(to right, #6366F1 0%, #6366F1 ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`;
}

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

// Add animation class on scroll
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
