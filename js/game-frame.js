/**
 * Kinda Hard Golf - Game Frame Controller
 * Manages iframe interaction and fullscreen functionality
 */

(function() {
    'use strict';

    // Configuration
    const config = {
        gameUrl: 'https://kindahardgolf.com',
        loadTimeout: 10000, // 10 seconds
        retryAttempts: 3,
        retryDelay: 2000
    };

    // State
    let isFullscreen = false;
    let loadAttempts = 0;
    let loadTimer = null;

    // DOM Elements
    const gameFrame = document.getElementById('gameFrame');
    const gameContainer = document.getElementById('gameContainer');
    const gameLoading = document.getElementById('gameLoading');
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    // Initialize
    function init() {
        if (!gameFrame) return;

        setupEventListeners();
        loadGame();
        setupMessageListener();
        detectFullscreenSupport();
        setupMobileEnhancements();
    }

    // Setup Event Listeners
    function setupEventListeners() {
        // Fullscreen button
        fullscreenBtn?.addEventListener('click', toggleFullscreen);

        // Fullscreen change events
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);

        // iframe load events
        gameFrame.addEventListener('load', handleFrameLoad);
        gameFrame.addEventListener('error', handleFrameError);

        // Escape key to exit fullscreen
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isFullscreen) {
                exitFullscreen();
            }
        });

        // Window resize
        window.addEventListener('resize', adjustFrameSize);
    }

    // Load Game
    function loadGame() {
        showLoading();
        
        // Set loading timeout
        loadTimer = setTimeout(() => {
            if (loadAttempts < config.retryAttempts) {
                retryLoad();
            } else {
                showError('Unable to load the game. Please try again later.');
            }
        }, config.loadTimeout);

        // Set iframe source
        gameFrame.src = config.gameUrl;
    }

    // Handle Frame Load
    function handleFrameLoad() {
        clearTimeout(loadTimer);
        hideLoading();
        loadAttempts = 0;
        
        // Track successful load
        trackEvent('game_loaded', {
            attempts: loadAttempts + 1
        });

        // Adjust size
        adjustFrameSize();
        
        // Try to focus the game
        try {
            gameFrame.contentWindow.focus();
        } catch (e) {
            // Cross-origin restriction, ignore
        }
    }

    // Handle Frame Error
    function handleFrameError(error) {
        console.error('Game frame error:', error);
        
        if (loadAttempts < config.retryAttempts) {
            retryLoad();
        } else {
            showError('Failed to load the game. Please check your connection.');
        }
    }

    // Retry Loading
    function retryLoad() {
        loadAttempts++;
        
        showLoading(`Retrying... (Attempt ${loadAttempts + 1}/${config.retryAttempts + 1})`);
        
        setTimeout(() => {
            gameFrame.src = '';
            setTimeout(() => {
                gameFrame.src = config.gameUrl;
            }, 100);
        }, config.retryDelay);
    }

    // Toggle Fullscreen
    function toggleFullscreen() {
        if (!isFullscreen) {
            enterFullscreen();
        } else {
            exitFullscreen();
        }
    }

    // Enter Fullscreen
    function enterFullscreen() {
        const element = gameContainer || gameFrame;
        
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else {
            // Fallback: Maximize the game container
            fallbackFullscreen();
        }

        trackEvent('fullscreen_entered');
    }

    // Exit Fullscreen
    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else {
            // Fallback: Restore normal view
            exitFallbackFullscreen();
        }

        trackEvent('fullscreen_exited');
    }

    // Fallback Fullscreen (for unsupported browsers)
    function fallbackFullscreen() {
        gameContainer.classList.add('fullscreen-fallback');
        document.body.style.overflow = 'hidden';
        isFullscreen = true;
        updateFullscreenButton();
    }

    // Exit Fallback Fullscreen
    function exitFallbackFullscreen() {
        gameContainer.classList.remove('fullscreen-fallback');
        document.body.style.overflow = '';
        isFullscreen = false;
        updateFullscreenButton();
    }

    // Handle Fullscreen Change
    function handleFullscreenChange() {
        isFullscreen = !!(document.fullscreenElement || 
                         document.webkitFullscreenElement || 
                         document.mozFullScreenElement || 
                         document.msFullscreenElement);
        
        updateFullscreenButton();
        adjustFrameSize();
    }

    // Update Fullscreen Button
    function updateFullscreenButton() {
        if (!fullscreenBtn) return;
        
        const icon = fullscreenBtn.querySelector('svg');
        const text = isFullscreen ? 'Exit Fullscreen' : 'Fullscreen';
        
        // Update button text
        fullscreenBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                ${isFullscreen ? 
                    '<path d="M8 3v3m0 0H5m3 0l-3-3m11 0v3m0 0h3m-3 0l3-3M8 21v-3m0 0H5m3 0l-3 3m11 0v-3m0 0h3m-3 0l3 3"/>' :
                    '<path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/>'}
            </svg>
            ${text}
        `;
    }

    // Adjust Frame Size
    function adjustFrameSize() {
        if (!gameFrame) return;
        
        const container = gameContainer;
        const isMobile = window.innerWidth <= 768;
        const isSmallMobile = window.innerWidth <= 480;
        
        if (isFullscreen) {
            // Full viewport in fullscreen
            gameFrame.style.height = '100vh';
        } else if (isMobile) {
            // Mobile devices need extra height for game buttons
            let mobileHeight;
            if (isSmallMobile) {
                // Small phones need at least 700px to show buttons
                mobileHeight = Math.max(700, window.innerHeight * 0.9);
            } else {
                // Tablets and larger phones
                mobileHeight = Math.max(750, window.innerHeight * 0.85);
            }
            gameFrame.style.height = `${mobileHeight}px`;
            
            // Ensure the iframe content is accessible
            gameFrame.style.minHeight = '700px';
            
            // Log for debugging
            console.log(`Mobile iframe height set to: ${mobileHeight}px`);
        } else {
            // Desktop: responsive sizing with aspect ratio
            const width = container.offsetWidth;
            const aspectRatio = 16 / 9;
            const maxHeight = window.innerHeight * 0.8;
            const calculatedHeight = width / aspectRatio;
            const finalHeight = Math.min(calculatedHeight, maxHeight);
            
            gameFrame.style.height = `${finalHeight}px`;
        }
    }

    // Setup Message Listener (for cross-frame communication)
    function setupMessageListener() {
        window.addEventListener('message', handleMessage);
    }

    // Handle Messages from Game
    function handleMessage(event) {
        // Verify origin
        if (event.origin !== 'https://kindahardgolf.com') return;
        
        const data = event.data;
        
        // Handle different message types
        switch(data.type) {
            case 'score':
                handleGameScore(data.score);
                break;
            case 'level_complete':
                handleLevelComplete(data);
                break;
            case 'game_event':
                trackEvent(data.event, data.properties);
                break;
        }
    }

    // Handle Game Score
    function handleGameScore(score) {
        // Save score using main.js API
        if (window.KindaHardGolf && window.KindaHardGolf.saveScore) {
            window.KindaHardGolf.saveScore(score);
        }
        
        // Show share modal
        showShareModal(score);
    }

    // Handle Level Complete
    function handleLevelComplete(data) {
        // Could show completion animation or message
        console.log('Level completed:', data);
    }

    // Show Share Modal
    function showShareModal(score) {
        const modal = document.getElementById('shareModal');
        const shareText = document.getElementById('shareText');
        
        if (modal && shareText) {
            shareText.innerHTML = `
                I scored ${score} on today's Kinda Hard Golf! ⛳<br>
                Can you beat my score?<br>
                Play now: kindahardgolf.app<br>
                #KindaHardGolf #DailyGolf
            `;
            modal.classList.remove('hidden');
        }
    }

    // Detect Fullscreen Support
    function detectFullscreenSupport() {
        const hasFullscreen = document.fullscreenEnabled || 
                            document.webkitFullscreenEnabled || 
                            document.mozFullScreenEnabled || 
                            document.msFullscreenEnabled;
        
        if (!hasFullscreen && fullscreenBtn) {
            // Use fallback fullscreen
            fullscreenBtn.title = 'Maximize game view';
        }
    }

    // Show Loading
    function showLoading(message = 'Loading today\'s challenge...') {
        if (gameLoading) {
            gameLoading.classList.remove('hidden');
            const loadingText = gameLoading.querySelector('p');
            if (loadingText) {
                loadingText.textContent = message;
            }
        }
        
        if (gameFrame) {
            gameFrame.classList.add('hidden');
        }
    }

    // Hide Loading
    function hideLoading() {
        if (gameLoading) {
            gameLoading.classList.add('hidden');
        }
        
        if (gameFrame) {
            gameFrame.classList.remove('hidden');
        }
    }

    // Show Error
    function showError(message) {
        if (gameLoading) {
            gameLoading.innerHTML = `
                <div class="error-message">
                    <div class="error-icon">⚠️</div>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="location.reload()">
                        Try Again
                    </button>
                </div>
            `;
        }
    }

    // Track Event
    function trackEvent(eventName, properties = {}) {
        // Google Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
        
        // Console log for development
        console.log('Event:', eventName, properties);
    }

    // Performance Optimization
    function optimizePerformance() {
        // Request idle callback for non-critical tasks
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                // Preload assets
                preloadAssets();
            });
        }
    }

    // Preload Assets
    function preloadAssets() {
        // Preload images that might be needed
        const imagesToPreload = [
            './images/logo.svg',
            './images/og-image.jpg'
        ];
        
        imagesToPreload.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // Setup Mobile Enhancements
    function setupMobileEnhancements() {
        const isMobile = window.innerWidth <= 768;
        if (!isMobile) return;

        // Handle scroll hint
        const scrollHint = document.getElementById('mobileScrollHint');
        if (scrollHint && gameContainer) {
            let hasScrolled = false;
            
            // Hide hint after user scrolls
            gameContainer.addEventListener('scroll', () => {
                if (!hasScrolled && gameContainer.scrollTop > 50) {
                    hasScrolled = true;
                    scrollHint.style.display = 'none';
                }
            });
            
            // Also hide after 5 seconds
            setTimeout(() => {
                if (scrollHint) {
                    scrollHint.style.opacity = '0';
                    setTimeout(() => {
                        scrollHint.style.display = 'none';
                    }, 500);
                }
            }, 5000);
        }

        // Add "Open in Full Screen" prompt for better mobile experience
        if (fullscreenBtn && gameContainer) {
            // Show a more prominent fullscreen suggestion on mobile
            const promptFullscreen = () => {
                const prompt = document.createElement('div');
                prompt.className = 'mobile-fullscreen-prompt';
                prompt.innerHTML = `
                    <div style="background: #4CAF50; color: white; padding: 10px; border-radius: 8px; margin: 10px; text-align: center;">
                        📱 Tip: Tap "Fullscreen" for the best mobile experience!
                    </div>
                `;
                gameContainer.insertBefore(prompt, gameContainer.firstChild);
                
                // Remove prompt after 5 seconds
                setTimeout(() => {
                    prompt.style.opacity = '0';
                    setTimeout(() => prompt.remove(), 500);
                }, 5000);
            };
            
            // Show prompt after game loads
            setTimeout(promptFullscreen, 2000);
        }
    }

    // Add custom styles for fullscreen fallback
    const style = document.createElement('style');
    style.textContent = `
        .fullscreen-fallback {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 9999 !important;
            background: black !important;
            padding: 0 !important;
            margin: 0 !important;
            border-radius: 0 !important;
        }
        
        .fullscreen-fallback .game-iframe {
            width: 100% !important;
            height: 100% !important;
        }
        
        .error-message {
            text-align: center;
            padding: 2rem;
        }
        
        .error-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
    `;
    document.head.appendChild(style);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose API
    window.GameFrame = {
        reload: loadGame,
        enterFullscreen: enterFullscreen,
        exitFullscreen: exitFullscreen,
        isFullscreen: () => isFullscreen
    };

})();