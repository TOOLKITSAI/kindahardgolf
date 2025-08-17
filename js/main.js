/**
 * Kinda Hard Golf - Main JavaScript
 * Core functionality and initialization
 */

(function() {
    'use strict';

    // DOM Elements
    const elements = {
        mobileMenuToggle: document.querySelector('.mobile-menu-toggle'),
        navMenu: document.querySelector('.nav-menu'),
        challengeInfo: document.getElementById('challengeInfo'),
        tipIcon: document.getElementById('tipIcon'),
        tipTitle: document.getElementById('tipTitle'),
        tipText: document.getElementById('tipText'),
        nextTipBtn: document.getElementById('nextTipBtn')
    };

    // Daily challenge messages
    const challenges = [
        "A tricky course with moving platforms. Can you beat the par score?",
        "Navigate through narrow passages in this challenging layout!",
        "Wind affects your shots today. Adjust your aim accordingly!",
        "Multiple paths to the hole - find the quickest route!",
        "Bouncy walls can help or hinder. Use them wisely!"
    ];

    // Pro Tips Library
    const proTips = [
        { icon: "🎯", title: "Master Your Aim", text: "Use wall bounces to reach difficult angles. The physics engine rewards creative shots!" },
        { icon: "⚡", title: "Power Control", text: "Quick, light taps give you more control. Save full power for long straight shots." },
        { icon: "📐", title: "Angle Science", text: "45-degree angles often work best for corner bounces. Practice your geometry!" },
        { icon: "🌀", title: "Drag Technique", text: "Drag backwards from the ball for more power, sideways for curve shots." },
        { icon: "🎱", title: "Bank Shots", text: "Use walls like a pool table. Sometimes the indirect path is the fastest." },
        { icon: "🏌️", title: "Soft Touch", text: "Near the hole? Use minimal power. Let gravity do the work." },
        { icon: "🔄", title: "Reset Strategy", text: "Don't hesitate to reset if your first shot goes wrong. Par is better than bogey!" },
        { icon: "📍", title: "Aim Small, Miss Small", text: "Pick a specific point to aim for, not just the general direction." },
        { icon: "🎪", title: "Obstacle Navigation", text: "Moving platforms have patterns. Time your shot when they're in the right position." },
        { icon: "💨", title: "Wind Compensation", text: "If there's wind, aim opposite to where it's blowing. Overcompensate on long shots." },
        { icon: "🏆", title: "Hole-in-One Secrets", text: "Study the course for 30 seconds before shooting. Plan your perfect shot." },
        { icon: "🧠", title: "Mind Games", text: "Take a breath before each shot. Rushed shots rarely go well." },
        { icon: "🎯", title: "Target Practice", text: "Aim for the back of the cup, not the front. This gives you more margin for error." },
        { icon: "⚖️", title: "Balance Power", text: "Medium power is often better than full power. Control beats distance." },
        { icon: "🌟", title: "Pro Secret", text: "The preview line shows your initial trajectory. Use it to plan ricochets." },
        { icon: "🔁", title: "Consistency Key", text: "Find a shot power that works and stick with it. Consistency beats luck." },
        { icon: "📏", title: "Distance Judgment", text: "Count the grid squares to judge distance. Each square needs different power." },
        { icon: "🎨", title: "Creative Solutions", text: "There's usually more than one way to reach the hole. Experiment!" },
        { icon: "⏱️", title: "Speed Run Tips", text: "For speed runs, plan your shot while the ball is still moving from the last one." },
        { icon: "🎪", title: "Elevation Matters", text: "Shooting uphill? Add extra power. Downhill? Use less than you think." }
    ];

    let currentTipIndex = 0;

    // Initialize
    function init() {
        setupEventListeners();
        initProTips();
        setupScrollEffects();
        checkNotificationPermission();
        updateDailyChallenge();
    }

    // Event Listeners
    function setupEventListeners() {
        // Mobile menu toggle
        if (elements.mobileMenuToggle) {
            elements.mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-wrapper') && elements.navMenu?.classList.contains('active')) {
                toggleMobileMenu();
            }
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', smoothScroll);
        });

        // Next tip button
        if (elements.nextTipBtn) {
            elements.nextTipBtn.addEventListener('click', showNextTip);
        }
    }

    // Mobile Menu Toggle
    function toggleMobileMenu() {
        elements.navMenu?.classList.toggle('active');
        elements.mobileMenuToggle?.classList.toggle('active');
        document.body.style.overflow = elements.navMenu?.classList.contains('active') ? 'hidden' : '';
    }

    // Smooth Scroll
    function smoothScroll(e) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Initialize Pro Tips
    function initProTips() {
        // Load saved tip index or start random
        const savedIndex = localStorage.getItem('currentTipIndex');
        if (savedIndex !== null) {
            currentTipIndex = parseInt(savedIndex) % proTips.length;
        } else {
            currentTipIndex = Math.floor(Math.random() * proTips.length);
        }
        
        // Show initial tip
        showTip(currentTipIndex);
        
        // Auto-rotate tips every 30 seconds
        setInterval(() => {
            if (!document.hidden) { // Only rotate when page is visible
                showNextTip();
            }
        }, 30000);
    }

    // Show specific tip
    function showTip(index) {
        const tip = proTips[index];
        if (elements.tipIcon) {
            // Add fade animation
            elements.tipIcon.style.animation = 'none';
            setTimeout(() => {
                elements.tipIcon.style.animation = 'fadeInUp 0.5s ease';
                elements.tipIcon.textContent = tip.icon;
            }, 10);
        }
        if (elements.tipTitle) {
            elements.tipTitle.textContent = tip.title;
        }
        if (elements.tipText) {
            elements.tipText.textContent = tip.text;
        }
        
        // Save current index
        localStorage.setItem('currentTipIndex', index.toString());
    }

    // Show next tip
    function showNextTip() {
        currentTipIndex = (currentTipIndex + 1) % proTips.length;
        showTip(currentTipIndex);
        
        // Add button animation
        if (elements.nextTipBtn) {
            elements.nextTipBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                elements.nextTipBtn.style.transform = 'scale(1)';
            }, 100);
        }
    }


    // Update Daily Challenge Info
    function updateDailyChallenge() {
        const today = new Date().getDay();
        const challengeIndex = today % challenges.length;
        updateElement(elements.challengeInfo, challenges[challengeIndex]);
    }


    // Setup Scroll Effects
    function setupScrollEffects() {
        let lastScroll = 0;
        const navbar = document.querySelector('.navbar');

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Add shadow to navbar on scroll
            if (currentScroll > 10) {
                navbar?.classList.add('scrolled');
            } else {
                navbar?.classList.remove('scrolled');
            }

            // Reveal animations on scroll
            revealOnScroll();

            lastScroll = currentScroll;
        });
    }

    // Reveal Elements on Scroll
    function revealOnScroll() {
        const reveals = document.querySelectorAll('.info-card, .feature-card');
        
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible && !element.classList.contains('revealed')) {
                element.classList.add('animate-fadeInUp', 'revealed');
            }
        });
    }

    // Check Notification Permission
    function checkNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            // Could prompt for notifications later
        }
    }

    // Request Notification Permission
    function requestNotificationPermission() {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    scheduleDailyReminder();
                }
            });
        }
    }

    // Schedule Daily Reminder
    function scheduleDailyReminder() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(12, 0, 0, 0);

        const timeUntilReminder = tomorrow.getTime() - now.getTime();

        setTimeout(() => {
            showNotification('New Daily Challenge!', 'Today\'s Kinda Hard Golf level is ready!');
            scheduleDailyReminder(); // Schedule next reminder
        }, timeUntilReminder);
    }

    // Show Notification
    function showNotification(title, body) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: body,
                icon: './images/logo.svg',
                badge: './images/badge.png'
            });
        }
    }


    // Update Element Helper
    function updateElement(element, value) {
        if (element) {
            element.textContent = value;
        }
    }

    // Dark Mode Toggle (Future Feature)
    function initDarkMode() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        }
        
        darkModeToggle?.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });
    }

    // Performance Monitoring
    function monitorPerformance() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    // Log performance metrics
                    console.log(`${entry.name}: ${entry.duration}ms`);
                });
            });
            
            observer.observe({ entryTypes: ['measure', 'navigation'] });
        }
    }


    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose public API
    window.KindaHardGolf = {
        refreshGame: refreshGame,
        requestNotifications: requestNotificationPermission,
        showNextTip: showNextTip
    };

})();