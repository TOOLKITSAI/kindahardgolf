/**
 * Kinda Hard Golf - Analytics Integration
 * Google Analytics 4 and custom event tracking
 */

(function() {
    'use strict';

    // Configuration
    const config = {
        GA_MEASUREMENT_ID: 'GA_MEASUREMENT_ID', // Replace with actual ID
        debugMode: false,
        trackingEnabled: true
    };

    // Custom events to track
    const customEvents = {
        game: [
            'game_started',
            'game_completed',
            'level_failed',
            'level_retry',
            'score_achieved'
        ],
        interaction: [
            'share_clicked',
            'fullscreen_toggled',
            'leaderboard_viewed',
            'tips_viewed',
            'guide_accessed'
        ],
        navigation: [
            'page_view',
            'external_link_clicked',
            'menu_opened',
            'footer_link_clicked'
        ]
    };

    // Initialize Google Analytics
    function initGA() {
        if (!config.trackingEnabled) return;

        // Check if gtag is already loaded
        if (typeof gtag === 'undefined') {
            window.dataLayer = window.dataLayer || [];
            window.gtag = function() {
                dataLayer.push(arguments);
            };
            gtag('js', new Date());
            gtag('config', config.GA_MEASUREMENT_ID, {
                'page_path': window.location.pathname,
                'debug_mode': config.debugMode
            });
        }
    }

    // Track custom event
    function trackEvent(category, action, label = null, value = null) {
        if (!config.trackingEnabled) return;

        const eventData = {
            'event_category': category,
            'event_label': label,
            'value': value
        };

        // Remove null values
        Object.keys(eventData).forEach(key => {
            if (eventData[key] === null) {
                delete eventData[key];
            }
        });

        if (typeof gtag !== 'undefined') {
            gtag('event', action, eventData);
        }

        // Debug logging
        if (config.debugMode) {
            console.log('Analytics Event:', category, action, eventData);
        }
    }

    // Track page view
    function trackPageView(pagePath = null) {
        if (!config.trackingEnabled) return;

        const path = pagePath || window.location.pathname;
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_path: path,
                page_title: document.title,
                page_location: window.location.href
            });
        }
    }

    // Track game events
    function trackGameEvent(eventName, properties = {}) {
        if (!customEvents.game.includes(eventName)) {
            console.warn(`Unknown game event: ${eventName}`);
            return;
        }

        trackEvent('game', eventName, properties.label, properties.value);

        // Special handling for specific events
        switch(eventName) {
            case 'game_completed':
                // Track completion time and score
                if (properties.score) {
                    trackEvent('game_performance', 'score', `Score: ${properties.score}`, properties.score);
                }
                if (properties.time) {
                    trackEvent('game_performance', 'completion_time', `Time: ${properties.time}s`, properties.time);
                }
                break;
            
            case 'score_achieved':
                // Track score distribution
                const scoreRange = getScoreRange(properties.score);
                trackEvent('game_metrics', 'score_range', scoreRange);
                break;
        }
    }

    // Track user interactions
    function trackInteraction(element, action) {
        const label = element.getAttribute('data-analytics-label') || 
                     element.textContent || 
                     element.id || 
                     'unnamed';
        
        trackEvent('interaction', action, label);
    }

    // Track timing events
    function trackTiming(category, variable, time, label = null) {
        if (!config.trackingEnabled) return;

        if (typeof gtag !== 'undefined') {
            gtag('event', 'timing_complete', {
                'name': variable,
                'value': time,
                'event_category': category,
                'event_label': label
            });
        }
    }

    // Track exceptions/errors
    function trackException(description, fatal = false) {
        if (!config.trackingEnabled) return;

        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                'description': description,
                'fatal': fatal
            });
        }

        // Also log to console in debug mode
        if (config.debugMode) {
            console.error('Exception tracked:', description);
        }
    }

    // Track social shares
    function trackShare(platform, score = null) {
        const label = score ? `Score: ${score}` : 'General share';
        trackEvent('social', 'share', platform, score);
        
        // Also track as conversion
        if (typeof gtag !== 'undefined') {
            gtag('event', 'share', {
                'method': platform,
                'content_type': 'game_score',
                'item_id': label
            });
        }
    }

    // Get score range for categorization
    function getScoreRange(score) {
        if (score === 1) return 'hole_in_one';
        if (score === 2) return 'eagle';
        if (score === 3) return 'birdie';
        if (score === 4) return 'par';
        if (score <= 6) return 'bogey';
        return 'double_bogey_plus';
    }

    // Setup automatic tracking
    function setupAutoTracking() {
        // Track all button clicks
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button, .btn');
            if (button) {
                trackInteraction(button, 'button_click');
            }

            // Track external links
            const link = e.target.closest('a');
            if (link && link.href && !link.href.includes(window.location.hostname)) {
                trackEvent('navigation', 'external_link', link.href);
            }
        });

        // Track form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const formName = form.getAttribute('data-form-name') || form.id || 'unnamed_form';
            trackEvent('form', 'submit', formName);
        });

        // Track scroll depth
        let maxScroll = 0;
        let scrollTimer;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
                if (scrollPercent > maxScroll) {
                    maxScroll = scrollPercent;
                    if (scrollPercent >= 25 && scrollPercent < 50) {
                        trackEvent('engagement', 'scroll_depth', '25%', 25);
                    } else if (scrollPercent >= 50 && scrollPercent < 75) {
                        trackEvent('engagement', 'scroll_depth', '50%', 50);
                    } else if (scrollPercent >= 75 && scrollPercent < 90) {
                        trackEvent('engagement', 'scroll_depth', '75%', 75);
                    } else if (scrollPercent >= 90) {
                        trackEvent('engagement', 'scroll_depth', '90%', 90);
                    }
                }
            }, 500);
        });

        // Track page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                trackEvent('engagement', 'page_hidden');
            } else {
                trackEvent('engagement', 'page_visible');
            }
        });

        // Track print events
        window.addEventListener('beforeprint', () => {
            trackEvent('interaction', 'print', window.location.pathname);
        });
    }

    // Session tracking
    function initSessionTracking() {
        const sessionKey = 'khg_session';
        const sessionTimeout = 30 * 60 * 1000; // 30 minutes
        
        let session = JSON.parse(sessionStorage.getItem(sessionKey) || '{}');
        
        if (!session.id || Date.now() - session.lastActivity > sessionTimeout) {
            // New session
            session = {
                id: generateSessionId(),
                startTime: Date.now(),
                lastActivity: Date.now(),
                pageViews: 1
            };
            trackEvent('session', 'start');
        } else {
            // Continuing session
            session.lastActivity = Date.now();
            session.pageViews++;
        }
        
        sessionStorage.setItem(sessionKey, JSON.stringify(session));
        
        // Track session duration on page unload
        window.addEventListener('beforeunload', () => {
            const duration = Math.round((Date.now() - session.startTime) / 1000);
            trackTiming('session', 'duration', duration);
        });
    }

    // Generate unique session ID
    function generateSessionId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Performance tracking
    function trackPerformance() {
        if ('performance' in window && 'getEntriesByType' in performance) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                        // Track page load time
                        trackTiming('performance', 'page_load', Math.round(perfData.loadEventEnd - perfData.fetchStart));
                        
                        // Track DOM ready time
                        trackTiming('performance', 'dom_ready', Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart));
                        
                        // Track time to first byte
                        trackTiming('performance', 'ttfb', Math.round(perfData.responseStart - perfData.fetchStart));
                    }
                }, 0);
            });
        }
    }

    // Initialize everything
    function init() {
        initGA();
        setupAutoTracking();
        initSessionTracking();
        trackPerformance();
        trackPageView();
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API
    window.Analytics = {
        trackEvent: trackEvent,
        trackGameEvent: trackGameEvent,
        trackShare: trackShare,
        trackTiming: trackTiming,
        trackException: trackException,
        trackPageView: trackPageView
    };

})();