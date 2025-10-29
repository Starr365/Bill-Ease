// ==========================================
// BillEase Landing Page JavaScript
// ==========================================

// ==========================================
// DOM Content Loaded
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    initializeNavbar();
    initializeSmoothScrolling();
    initializeFormValidation();
    initializeCartFunctionality();
    initializeThemeToggle();
    initializeAnimations();
});

// ==========================================
// Navbar Functionality
// ==========================================
function initializeNavbar() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navWrapper = document.querySelector('.nav-wrapper');

    // Sticky navbar on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
    });

    // Mobile menu toggle
    menuToggle.addEventListener('click', function() {
        navWrapper.classList.toggle('active');
        const isExpanded = navWrapper.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navbar.contains(event.target) && navWrapper.classList.contains('active')) {
            navWrapper.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', false);
        }
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 768) {
                navWrapper.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', false);
            }
        });
    });

    // Mobile menu toggle (if needed in future)
    // const menuToggle = document.querySelector('.menu-toggle');
    // const navMenu = document.querySelector('nav ul');

    // if (menuToggle && navMenu) {
    //     menuToggle.addEventListener('click', function() {
    //         navMenu.classList.toggle('active');
    //     });
    // }
}

// ==========================================
// Smooth Scrolling
// ==========================================
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for sticky navbar

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================
// Form Validation
// ==========================================
function initializeFormValidation() {
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Clear previous error messages
            clearFormErrors();

            // Validate form
            const isValid = validateForm(this);

            if (isValid) {
                // Show success message
                showSuccessMessage();
                // Reset form
                this.reset();
            }
        });
    }
}

function validateForm(form) {
    let isValid = true;
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');

    // Name validation
    if (!name.value.trim()) {
        showError(name, 'Name is required');
        isValid = false;
    } else if (name.value.trim().length < 2) {
        showError(name, 'Name must be at least 2 characters');
        isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        showError(email, 'Email is required');
        isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    }

    // Message validation
    if (!message.value.trim()) {
        showError(message, 'Message is required');
        isValid = false;
    } else if (message.value.trim().length < 10) {
        showError(message, 'Message must be at least 10 characters');
        isValid = false;
    }

    return isValid;
}

function showError(element, message) {
    // Remove existing error
    const existingError = element.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.style.marginTop = '0.5rem';

    // Insert after the element
    element.parentNode.insertBefore(errorDiv, element.nextSibling);
}

function clearFormErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());
}

function showSuccessMessage() {
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = 'Thank you! Your message has been sent successfully.';
    successDiv.style.backgroundColor = '#27ae60';
    successDiv.style.color = 'white';
    successDiv.style.padding = '1rem';
    successDiv.style.borderRadius = '5px';
    successDiv.style.marginTop = '1rem';
    successDiv.style.textAlign = 'center';

    // Insert before the form
    const form = document.querySelector('.contact-form');
    form.parentNode.insertBefore(successDiv, form);

    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// ==========================================
// Cart Functionality
// ==========================================
function initializeCartFunctionality() {
    let cart = JSON.parse(localStorage.getItem('billeasy_cart')) || [];

    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.pricing-item-free button, .pricing-item-pro button, .pricing-item-business button');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const planType = this.closest('.pricing-item-free, .pricing-item-pro, .pricing-item-business').querySelector('h4').textContent;
            addToCart(planType);
        });
    });

    // Initialize cart display
    updateCartDisplay();
}

function addToCart(planType) {
    let cart = JSON.parse(localStorage.getItem('billeasy_cart')) || [];

    // Check if plan already in cart
    const existingPlan = cart.find(item => item.type === planType);

    if (existingPlan) {
        existingPlan.quantity += 1;
    } else {
        cart.push({
            type: planType,
            quantity: 1,
            price: getPlanPrice(planType)
        });
    }

    localStorage.setItem('billeasy_cart', JSON.stringify(cart));
    updateCartDisplay();
    showCartNotification(`${planType} plan added to cart!`);
}

function getPlanPrice(planType) {
    const prices = {
        'Free': 0,
        'Pro': 9.99,
        'Business': 29.99
    };
    return prices[planType] || 0;
}

function updateCartDisplay() {
    // Create cart modal if it doesn't exist
    let cartModal = document.querySelector('.cart-modal');
    if (!cartModal) {
        createCartModal();
        cartModal = document.querySelector('.cart-modal');
    }

    const cart = JSON.parse(localStorage.getItem('billeasy_cart')) || [];
    const cartItems = cartModal.querySelector('.cart-items');
    const cartTotal = cartModal.querySelector('.cart-total');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '$0.00';
        return;
    }

    let total = 0;
    cartItems.innerHTML = '';

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.type} Plan</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" data-action="decrease" data-index="${index}">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" data-action="increase" data-index="${index}">+</button>
                <button class="remove-btn" data-index="${index}">Remove</button>
            </div>
        `;
        cartItems.appendChild(itemElement);
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;

    // Add event listeners for cart controls
    addCartControlListeners();
}

function createCartModal() {
    const modal = document.createElement('div');
    modal.className = 'cart-modal';
    modal.innerHTML = `
        <div class="cart-overlay"></div>
        <div class="cart-content">
            <div class="cart-header">
                <h3>Your Cart</h3>
                <button class="cart-close">&times;</button>
            </div>
            <div class="cart-items"></div>
            <div class="cart-footer">
                <div class="cart-total-section">
                    <strong>Total: <span class="cart-total">$0.00</span></strong>
                </div>
                <div class="cart-buttons">
                    <button class="cart-clear">Clear Cart</button>
                    <button class="cart-checkout">Checkout</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Add event listeners
    modal.querySelector('.cart-close').addEventListener('click', () => modal.style.display = 'none');
    modal.querySelector('.cart-overlay').addEventListener('click', () => modal.style.display = 'none');
    modal.querySelector('.cart-clear').addEventListener('click', clearCart);
    modal.querySelector('.cart-checkout').addEventListener('click', proceedToCheckout);
}

function addCartControlListeners() {
    // Quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            const action = this.dataset.action;
            updateCartQuantity(index, action);
        });
    });

    // Remove buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            removeFromCart(index);
        });
    });
}

function updateCartQuantity(index, action) {
    let cart = JSON.parse(localStorage.getItem('billeasy_cart')) || [];

    if (action === 'increase') {
        cart[index].quantity += 1;
    } else if (action === 'decrease' && cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    }

    localStorage.setItem('billeasy_cart', JSON.stringify(cart));
    updateCartDisplay();
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('billeasy_cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('billeasy_cart', JSON.stringify(cart));
    updateCartDisplay();
}

function clearCart() {
    localStorage.removeItem('billeasy_cart');
    updateCartDisplay();
    showCartNotification('Cart cleared!');
}

function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('billeasy_cart')) || [];

    if (cart.length === 0) {
        showCartNotification('Your cart is empty!');
        return;
    }

    // Show checkout confirmation
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const checkoutModal = document.createElement('div');
    checkoutModal.className = 'checkout-modal';
    checkoutModal.innerHTML = `
        <div class="checkout-overlay"></div>
        <div class="checkout-content">
            <h3>Checkout Confirmation</h3>
            <p>Thank you for choosing BillEase!</p>
            <p><strong>Total: $${total.toFixed(2)}</strong></p>
            <p>Your order has been processed successfully.</p>
            <button class="checkout-close">Close</button>
        </div>
    `;
    document.body.appendChild(checkoutModal);

    checkoutModal.querySelector('.checkout-close').addEventListener('click', () => {
        checkoutModal.remove();
        document.querySelector('.cart-modal').style.display = 'none';
        clearCart();
    });

    checkoutModal.querySelector('.checkout-overlay').addEventListener('click', () => {
        checkoutModal.remove();
    });
}

function showCartNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.cart-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '120px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#27ae60';
    notification.style.color = 'white';
    notification.style.padding = '1rem';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1001';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ==========================================
// Theme Toggle (Dark/Light Mode)
// ==========================================
function initializeThemeToggle() {
    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.setAttribute('aria-label', 'Toggle theme');
    themeToggle.style.position = 'fixed';
    themeToggle.style.top = '20px';
    themeToggle.style.right = '20px';
    themeToggle.style.backgroundColor = 'black';
    themeToggle.style.color = 'white';
    themeToggle.style.border = 'none';
    themeToggle.style.borderRadius = '50%';
    themeToggle.style.width = '50px';
    themeToggle.style.height = '50px';
    themeToggle.style.cursor = 'pointer';
    themeToggle.style.zIndex = '1000';
    themeToggle.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    themeToggle.style.transition = 'all 0.3s ease';

    document.body.appendChild(themeToggle);

    // Load saved theme
    const savedTheme = localStorage.getItem('billeasy_theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Toggle theme
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');

        // Update icon
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

        // Save theme preference
        localStorage.setItem('billeasy_theme', isDark ? 'dark' : 'light');
    });
}

// ==========================================
// Animations and Effects
// ==========================================
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe sections for animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Add hover effects to feature items
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        });
    });
}

// ==========================================
// Utility Functions
// ==========================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==========================================
// CSS for Dynamic Elements
// ==========================================
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .cart-modal, .checkout-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2000;
    }

    .cart-overlay, .checkout-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .cart-content, .checkout-content {
        position: relative;
        background-color: white;
        margin: 10% auto;
        padding: 0;
        border-radius: 10px;
        width: 90%;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
    }

    .cart-header, .checkout-content {
        padding: 1rem;
    }

    .cart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eee;
    }

    .cart-close, .checkout-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
    }

    .cart-items {
        padding: 1rem;
        max-height: 300px;
        overflow-y: auto;
    }

    .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid #eee;
    }

    .cart-item-info h4 {
        margin: 0;
        font-size: 1rem;
    }

    .cart-item-info p {
        margin: 0.5rem 0 0 0;
        font-size: 0.9rem;
        color: #666;
    }

    .cart-item-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .quantity-btn, .remove-btn {
        padding: 0.2rem 0.5rem;
        border: 1px solid #ddd;
        background: white;
        cursor: pointer;
        border-radius: 3px;
    }

    .remove-btn {
        background-color: #e74c3c;
        color: white;
        border: none;
    }

    .cart-footer {
        padding: 1rem;
        border-top: 1px solid #eee;
    }

    .cart-total-section {
        text-align: center;
        margin-bottom: 1rem;
    }

    .cart-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
    }

    .cart-clear, .cart-checkout {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    .cart-clear {
        background-color: #95a5a6;
        color: white;
    }

    .cart-checkout {
        background-color: #27ae60;
        color: white;
    }

    .dark-theme {
        --bg-color: #1a1a1a;
        --text-color: #ffffff;
        --card-bg: #2d2d2d;
        --border-color: #404040;
    }

    .dark-theme body {
        background-color: var(--bg-color);
        color: var(--text-color);
    }

    .dark-theme .navbar {
        background-color: rgba(45, 45, 45, 0.95);
        border-color: var(--border-color);
    }

    .dark-theme .feature-item,
    .dark-theme .pricing-item-free,
    .dark-theme .pricing-item-pro,
    .dark-theme .pricing-item-business,
    .dark-theme .testimonial-item {
        background-color: var(--card-bg);
        border-color: var(--border-color);
    }

    .dark-theme .cart-content,
    .dark-theme .checkout-content {
        background-color: var(--card-bg);
        color: var(--text-color);
    }

    .theme-toggle:hover {
        transform: scale(1.1);
    }

    @media (max-width: 768px) {
        .cart-content, .checkout-content {
            width: 95%;
            margin: 20% auto;
        }

        .theme-toggle {
            width: 45px;
            height: 45px;
            font-size: 0.9rem;
        }
    }
`;
document.head.appendChild(style);

// Show cart modal when clicking on a cart-related element (you can add a cart icon later)
document.addEventListener('click', function(e) {
    if (e.target.closest('.cart-icon') || e.target.closest('.cart-trigger')) {
        const cartModal = document.querySelector('.cart-modal');
        if (cartModal) {
            cartModal.style.display = 'block';
        }
    }
});