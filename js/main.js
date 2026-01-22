// ===== EmailJS Configuration =====
// IMPORTANT: Replace these with your actual EmailJS credentials
// Sign up at https://www.emailjs.com/ (free: 200 emails/month)
const EMAILJS_PUBLIC_KEY = 'LdBVqtPcvBKvH5vjC';  // Get from EmailJS Dashboard > Account > API Keys
const EMAILJS_SERVICE_ID = 'service_t3zap0i';  // Get from EmailJS Dashboard > Email Services
const EMAILJS_CONTACT_TEMPLATE = 'template_tk2kfwf';  // Template for contact form
const EMAILJS_RECEIPT_TEMPLATE = 'template_z5fd8ke';  // Template for payment receipts

// Initialize EmailJS
(function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }
})();

// ===== Pricing Information =====
const PRICING_INFO = {
    'Individual - $75': {
        name: 'Individual Tax Filing',
        price: 75,
        features: ['Single ITR Filing', 'W-2 Income', 'Standard Deductions', 'E-Filing', 'Email Support']
    },
    'Professional - $99': {
        name: 'Professional Tax Filing',
        price: 99,
        features: ['Complex ITR Filing', 'Multiple Income Sources', 'Itemized Deductions', 'Investment Income', 'Rental Income', 'Priority Support', 'Tax Planning Consultation']
    },
    'Tax Refund': {
        name: 'Tax Refund Services',
        price: 'Custom',
        features: ['Refund Maximization', 'Deduction Analysis', 'Credit Identification', 'Fast Processing']
    },
    'Financial Services': {
        name: 'Financial Services',
        price: 'Custom',
        features: ['Excel Sheet Management', 'Financial Data Entry', 'Document Organization', 'Report Preparation']
    },
    'Other': {
        name: 'Custom Service',
        price: 'Custom',
        features: ['Contact us for details']
    }
};

// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const scrollTopBtn = document.getElementById('scrollTop');
const contactForm = document.getElementById('contactForm');
const paymentForm = document.getElementById('paymentForm');

// ===== Mobile Menu Toggle =====
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileMenuBtn?.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

// ===== Navbar Scroll Effect =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Show/hide scroll to top button
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

// ===== Scroll to Top =====
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Contact Form Handling =====
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        // Basic validation
        if (!data.name || !data.email || !data.service || !data.message) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Get pricing info for selected service
        const serviceKey = Object.keys(PRICING_INFO).find(key =>
            key.toLowerCase().includes(data.service.replace('-', ' '))
        ) || data.service;
        const pricingDetails = PRICING_INFO[serviceKey] || { name: data.service, price: 'Contact for quote', features: [] };

        // Prepare email parameters
        const templateParams = {
            to_email: 'varunbhatia2004@gmail.com',
            from_name: data.name,
            from_email: data.email,
            phone: data.phone || 'Not provided',
            service: data.service,
            service_name: pricingDetails.name,
            service_price: typeof pricingDetails.price === 'number' ? `$${pricingDetails.price}` : pricingDetails.price,
            service_features: pricingDetails.features.join(', '),
            message: data.message,
            date: new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        try {
            // Check if EmailJS is properly configured
            if (typeof emailjs === 'undefined' || EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
                // Fallback: Use mailto link
                const mailtoLink = `mailto:varunbhatia2004@gmail.com?subject=New Inquiry from ${data.name} - ${data.service}&body=Name: ${data.name}%0D%0AEmail: ${data.email}%0D%0APhone: ${data.phone || 'Not provided'}%0D%0AService: ${data.service}%0D%0APrice: ${templateParams.service_price}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(data.message)}`;
                window.location.href = mailtoLink;
                showNotification('Opening your email client to send the message...', 'info');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                return;
            }

            // Send email via EmailJS
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CONTACT_TEMPLATE, templateParams);
            showNotification('Thank you! Your message has been sent successfully. We will get back to you soon.', 'success');
            this.reset();
        } catch (error) {
            console.error('Email error:', error);
            // Fallback to mailto
            const mailtoLink = `mailto:varunbhatia2004@gmail.com?subject=New Inquiry from ${data.name} - ${data.service}&body=Name: ${data.name}%0D%0AEmail: ${data.email}%0D%0APhone: ${data.phone || 'Not provided'}%0D%0AService: ${data.service}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(data.message)}`;
            window.location.href = mailtoLink;
            showNotification('Opening your email client as a backup method...', 'info');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ===== Payment Form Handling =====
if (paymentForm) {
    paymentForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const payerName = document.getElementById('payerName').value;
        const payerEmail = document.getElementById('payerEmail').value;
        const serviceSelected = document.getElementById('serviceSelected').value;
        const paymentAmount = document.getElementById('paymentAmount').value;
        const paymentNotes = document.getElementById('paymentNotes').value;

        // Validation
        if (!payerName || !payerEmail || !serviceSelected || !paymentAmount) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(payerEmail)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Receipt...';
        submitBtn.disabled = true;

        // Get pricing info
        const pricingDetails = PRICING_INFO[serviceSelected] || { name: serviceSelected, features: [] };
        const receiptNumber = 'BTS-' + Date.now().toString().slice(-8);
        const currentDate = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Prepare email parameters for receipt
        const templateParams = {
            to_email: payerEmail,
            to_name: payerName,
            receipt_number: receiptNumber,
            service_name: pricingDetails.name || serviceSelected,
            service_features: pricingDetails.features.join(', '),
            amount: paymentAmount,
            payment_method: 'Zelle',
            payment_date: currentDate,
            notes: paymentNotes || 'None',
            business_name: 'Bhatia Tax Services',
            business_email: 'varunbhatia2004@gmail.com',
            business_phone: '(714) 872-6910',
            business_address: '8149 Santa Inez Way, Buena Park, CA 92831'
        };

        // Also send notification to business owner
        const ownerNotificationParams = {
            to_email: 'varunbhatia2004@gmail.com',
            from_name: payerName,
            from_email: payerEmail,
            service: serviceSelected,
            amount: paymentAmount,
            receipt_number: receiptNumber,
            notes: paymentNotes || 'None',
            date: currentDate
        };

        try {
            // Check if EmailJS is properly configured
            if (typeof emailjs === 'undefined' || EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
                // Fallback: Show receipt details and use mailto
                const receiptMessage = `
PAYMENT RECEIPT - ${receiptNumber}
================================
Bhatia Tax Services
Date: ${currentDate}

BILL TO:
${payerName}
${payerEmail}

SERVICE: ${pricingDetails.name || serviceSelected}
AMOUNT PAID: $${paymentAmount}
PAYMENT METHOD: Zelle

Features Included:
${pricingDetails.features.map(f => '- ' + f).join('\n')}

Notes: ${paymentNotes || 'None'}

Thank you for your business!
================================
Bhatia Tax Services
Email: varunbhatia2004@gmail.com
Phone: (714) 872-6910
`;
                // Open mailto to send to owner
                const mailtoLink = `mailto:varunbhatia2004@gmail.com?subject=Payment Received - ${payerName} - ${receiptNumber}&body=${encodeURIComponent(`Payment Confirmation\n\nClient: ${payerName}\nEmail: ${payerEmail}\nService: ${serviceSelected}\nAmount: $${paymentAmount}\nReceipt #: ${receiptNumber}\nNotes: ${paymentNotes || 'None'}`)}`;
                window.open(mailtoLink, '_blank');

                // Show receipt to user
                showReceiptModal(receiptMessage, payerEmail);
                showNotification('Receipt generated! Check the popup for your receipt details.', 'success');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                return;
            }

            // Send receipt to customer
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_RECEIPT_TEMPLATE, templateParams);

            // Send notification to business owner
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CONTACT_TEMPLATE, ownerNotificationParams);

            showNotification(`Receipt sent to ${payerEmail}! Receipt #: ${receiptNumber}`, 'success');
            this.reset();
        } catch (error) {
            console.error('Email error:', error);
            // Fallback
            showNotification('Receipt generated! Please check your email or contact us if not received.', 'info');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ===== Receipt Modal =====
function showReceiptModal(receiptText, email) {
    // Remove existing modal
    const existingModal = document.getElementById('receiptModal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'receiptModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
    `;
    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto;">
            <h3 style="margin-bottom: 1rem; color: #1e40af;"><i class="fas fa-receipt"></i> Your Payment Receipt</h3>
            <pre style="background: #f8fafc; padding: 1rem; border-radius: 8px; font-size: 0.875rem; white-space: pre-wrap; overflow-x: auto;">${receiptText}</pre>
            <p style="margin-top: 1rem; font-size: 0.875rem; color: #64748b;">A copy has been prepared for ${email}. Please save or print this receipt for your records.</p>
            <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                <button onclick="window.print()" style="flex: 1; padding: 0.75rem; background: #1e40af; color: white; border: none; border-radius: 8px; cursor: pointer;"><i class="fas fa-print"></i> Print</button>
                <button onclick="document.getElementById('receiptModal').remove()" style="flex: 1; padding: 0.75rem; background: #64748b; color: white; border: none; border-radius: 8px; cursor: pointer;">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// ===== Copy to Clipboard =====
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Email copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('Email copied to clipboard!', 'success');
    });
}

// ===== Notification System =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;

    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        margin-left: 0.5rem;
        opacity: 0.8;
    `;
    closeBtn.addEventListener('click', () => removeNotification(notification));

    // Auto remove after 5 seconds
    setTimeout(() => removeNotification(notification), 5000);
}

function removeNotification(notification) {
    if (notification && notification.parentNode) {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }
}

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    // Add animation styles
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        .service-card,
        .pricing-card,
        .testimonial-card,
        .about-card,
        .payment-card,
        .payment-info {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .service-card.animate-in,
        .pricing-card.animate-in,
        .testimonial-card.animate-in,
        .about-card.animate-in,
        .payment-card.animate-in,
        .payment-info.animate-in {
            opacity: 1;
            transform: translateY(0);
        }

        .service-card:nth-child(2) { transition-delay: 0.1s; }
        .service-card:nth-child(3) { transition-delay: 0.2s; }

        .pricing-card:nth-child(2) { transition-delay: 0.1s; }
        .pricing-card:nth-child(3) { transition-delay: 0.2s; }

        .testimonial-card:nth-child(2) { transition-delay: 0.1s; }
        .testimonial-card:nth-child(3) { transition-delay: 0.2s; }
    `;
    document.head.appendChild(animationStyles);

    // Observe cards
    document.querySelectorAll('.service-card, .pricing-card, .testimonial-card, .about-card, .payment-card, .payment-info').forEach(card => {
        observer.observe(card);
    });
});

// ===== Counter Animation for Stats =====
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + (element.dataset.suffix || '');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (element.dataset.suffix || '');
        }
    }

    updateCounter();
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text);
                const suffix = text.replace(/[0-9]/g, '');
                stat.dataset.suffix = suffix;
                animateCounter(stat, number);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }
});

// ===== Active Navigation Highlight =====
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// Add active link styles
document.addEventListener('DOMContentLoaded', () => {
    const activeLinkStyles = document.createElement('style');
    activeLinkStyles.textContent = `
        .nav-links a.active {
            color: var(--primary-color);
        }
        .nav-links a.active::after {
            width: 100%;
        }
    `;
    document.head.appendChild(activeLinkStyles);
});
