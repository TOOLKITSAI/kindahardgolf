/**
 * Kinda Hard Golf - Social Sharing
 * Handles score sharing and social media integration
 */

(function() {
    'use strict';

    // Configuration
    const config = {
        siteName: 'Kinda Hard Golf',
        siteUrl: 'https://kindahardgolf.app',
        hashtags: ['KindaHardGolf', 'DailyGolf', 'GolfChallenge'],
        twitterHandle: '@kindahardgolf'
    };

    // Share templates
    const shareTemplates = {
        default: 'I scored {score} on today\'s Kinda Hard Golf! ⛳\nCan you beat my score?\nPlay now: {url}',
        perfect: 'HOLE IN ONE! 🎯 I aced today\'s Kinda Hard Golf! ⛳\nCan you match it?\nPlay now: {url}',
        underPar: 'Under par! I scored {score} on today\'s Kinda Hard Golf! 🏌️‍♂️\nBeat my score: {url}',
        struggle: 'Today\'s Kinda Hard Golf was TOUGH! 😅 Took me {score} strokes!\nTry it yourself: {url}'
    };

    // DOM Elements
    const shareBtn = document.getElementById('shareBtn');
    const shareModal = document.getElementById('shareModal');
    const closeModal = document.getElementById('closeModal');
    const copyBtn = document.getElementById('copyBtn');
    const xShare = document.getElementById('xShare');
    const facebookShare = document.getElementById('facebookShare');
    const shareText = document.getElementById('shareText');

    // Current score data
    let currentScore = null;
    let todaysPar = 3; // Default par

    // Initialize
    function init() {
        setupEventListeners();
        loadTodaysData();
    }

    // Setup Event Listeners
    function setupEventListeners() {
        // Share button
        shareBtn?.addEventListener('click', openShareModal);

        // Modal controls
        closeModal?.addEventListener('click', closeShareModal);
        shareModal?.addEventListener('click', (e) => {
            if (e.target === shareModal) {
                closeShareModal();
            }
        });

        // Share buttons
        copyBtn?.addEventListener('click', copyToClipboard);
        xShare?.addEventListener('click', shareToX);

        // Score input handling
        const scoreInput = document.getElementById('scoreInput');
        const scoreDisplay = document.getElementById('scoreDisplay');
        scoreInput?.addEventListener('input', (e) => {
            const score = e.target.value;
            currentScore = parseInt(score) || 3;
            if (scoreDisplay) {
                scoreDisplay.textContent = currentScore;
            }
        });
        facebookShare?.addEventListener('click', shareToFacebook);

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !shareModal?.classList.contains('hidden')) {
                closeShareModal();
            }
        });
    }

    // Load Today's Data
    function loadTodaysData() {
        // Get today's par from the page or API
        const parElement = document.getElementById('todayPar');
        if (parElement && parElement.textContent !== '-') {
            todaysPar = parseInt(parElement.textContent);
        }

        // Check for score in URL params (for direct sharing)
        const urlParams = new URLSearchParams(window.location.search);
        const scoreParam = urlParams.get('score');
        if (scoreParam) {
            currentScore = parseInt(scoreParam);
            // Auto-open share modal if score is in URL
            setTimeout(() => openShareModal(), 1000);
        }
    }

    // Open Share Modal
    function openShareModal(score = null) {
        if (score !== null) {
            currentScore = score;
        } else {
            // Get current value from input if exists
            const scoreInput = document.getElementById('scoreInput');
            if (scoreInput) {
                currentScore = parseInt(scoreInput.value) || 3;
            }
        }

        // Generate share text based on score
        const text = generateShareText(currentScore);
        updateShareText(text);

        // Show modal
        shareModal?.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Track event
        trackEvent('share_modal_opened', { score: currentScore });
    }

    // Close Share Modal
    function closeShareModal() {
        shareModal?.classList.add('hidden');
        document.body.style.overflow = '';
    }

    // Generate Share Text
    function generateShareText(score) {
        let template;
        
        if (score === null) {
            // No score yet, generic share
            return `Check out today's Kinda Hard Golf challenge! ⛳\n${config.siteUrl}\n#${config.hashtags.join(' #')}`;
        }

        // Select template based on score
        if (score === 1) {
            template = shareTemplates.perfect;
        } else if (score < todaysPar) {
            template = shareTemplates.underPar;
        } else if (score > todaysPar + 3) {
            template = shareTemplates.struggle;
        } else {
            template = shareTemplates.default;
        }

        // Add emoji indicators based on score
        const scoreEmojis = generateScoreEmojis(score);

        // Replace placeholders
        let text = template
            .replace('{score}', score)
            .replace('{url}', config.siteUrl)
            .replace('{par}', todaysPar);

        // Add score visualization
        text += `\n${scoreEmojis}\n#${config.hashtags.join(' #')}`;

        return text;
    }

    // Generate Score Emojis
    function generateScoreEmojis(score) {
        const emojis = [];
        const maxDisplay = 10;
        
        for (let i = 0; i < Math.min(score, maxDisplay); i++) {
            if (i < todaysPar) {
                emojis.push('🟢'); // Under par strokes
            } else if (i === todaysPar) {
                emojis.push('🟡'); // Par stroke
            } else {
                emojis.push('🔴'); // Over par strokes
            }
        }

        if (score > maxDisplay) {
            emojis.push('...');
        }

        return emojis.join('');
    }

    // Update Share Text Display
    function updateShareText(text) {
        if (shareText) {
            // Convert line breaks to <br> for display
            shareText.innerHTML = text.replace(/\n/g, '<br>');
        }
    }

    // Copy to Clipboard
    async function copyToClipboard() {
        const scoreInput = document.getElementById('scoreInput');
        const score = scoreInput ? parseInt(scoreInput.value) : currentScore;
        const text = generateShareText(score);

        try {
            if (navigator.clipboard && window.isSecureContext) {
                // Modern async clipboard API
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback method
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }

            // Show success feedback
            showCopySuccess();
            trackEvent('share_copied', { method: 'clipboard' });

        } catch (err) {
            console.error('Failed to copy:', err);
            showCopyError();
        }
    }

    // Show Copy Success
    function showCopySuccess() {
        const originalText = copyBtn?.innerHTML;
        if (copyBtn) {
            copyBtn.innerHTML = '✓ Copied!';
            copyBtn.classList.add('success');
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.classList.remove('success');
            }, 2000);
        }
    }

    // Show Copy Error
    function showCopyError() {
        const originalText = copyBtn?.innerHTML;
        if (copyBtn) {
            copyBtn.innerHTML = '❌ Failed';
            copyBtn.classList.add('error');
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.classList.remove('error');
            }, 2000);
        }
    }

    // Share to X (formerly Twitter)
    function shareToX() {
        const scoreInput = document.getElementById('scoreInput');
        const score = scoreInput ? parseInt(scoreInput.value) : currentScore;
        const text = generateShareText(score);
        const tweetText = encodeURIComponent(text);
        const url = `https://twitter.com/intent/tweet?text=${tweetText}`;

        openShareWindow(url, 'X');
        trackEvent('share_social', { platform: 'x', score: score });
    }

    // Share to Facebook
    function shareToFacebook() {
        const scoreInput = document.getElementById('scoreInput');
        const score = scoreInput ? parseInt(scoreInput.value) : currentScore;
        const url = encodeURIComponent(config.siteUrl);
        const quote = encodeURIComponent(generateShareText(score));
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`;

        openShareWindow(fbUrl, 'Facebook');
        trackEvent('share_social', { platform: 'facebook', score: score });
    }

    // Share to Reddit
    function shareToReddit() {
        const title = encodeURIComponent(`I scored ${currentScore} on today's Kinda Hard Golf!`);
        const url = encodeURIComponent(config.siteUrl);
        const redditUrl = `https://www.reddit.com/submit?title=${title}&url=${url}`;

        openShareWindow(redditUrl, 'Reddit');
        trackEvent('share_social', { platform: 'reddit', score: currentScore });
    }

    // Share to WhatsApp
    function shareToWhatsApp() {
        const text = encodeURIComponent(generateShareText(currentScore));
        const whatsappUrl = `https://wa.me/?text=${text}`;

        window.open(whatsappUrl, '_blank');
        trackEvent('share_social', { platform: 'whatsapp', score: currentScore });
    }

    // Open Share Window
    function openShareWindow(url, platform) {
        const width = 600;
        const height = 400;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        window.open(
            url,
            platform,
            `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
        );
    }

    // Native Web Share API
    async function nativeShare() {
        if (navigator.share) {
            try {
                const shareData = {
                    title: 'Kinda Hard Golf',
                    text: generateShareText(currentScore),
                    url: config.siteUrl
                };

                await navigator.share(shareData);
                trackEvent('share_native', { score: currentScore });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Share failed:', err);
                }
            }
        }
    }

    // Generate Share Image (Canvas API)
    function generateShareImage(score) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas size (social media optimal)
        canvas.width = 1200;
        canvas.height = 630;

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#4CAF50');
        gradient.addColorStop(1, '#2E7D32');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add golf pattern
        ctx.globalAlpha = 0.1;
        for (let i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.arc(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                50,
                0,
                Math.PI * 2
            );
            ctx.fillStyle = 'white';
            ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Title
        ctx.fillStyle = 'white';
        ctx.font = 'bold 80px Quicksand, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Kinda Hard Golf', canvas.width / 2, 200);

        // Score
        ctx.font = 'bold 120px Quicksand, sans-serif';
        ctx.fillText(`Score: ${score}`, canvas.width / 2, 350);

        // URL
        ctx.font = '40px Open Sans, sans-serif';
        ctx.fillText('kindahardgolf.app', canvas.width / 2, 500);

        return canvas;
    }

    // Download Share Image
    function downloadShareImage(score) {
        const canvas = generateShareImage(score);
        const link = document.createElement('a');
        link.download = `kinda-hard-golf-score-${score}.png`;
        link.href = canvas.toDataURL();
        link.click();

        trackEvent('share_image_download', { score: score });
    }

    // Track Event
    function trackEvent(eventName, properties = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
        console.log('Share event:', eventName, properties);
    }

    // Add custom styles
    const style = document.createElement('style');
    style.textContent = `
        .share-buttons .btn.success {
            background: #4CAF50;
            color: white;
        }
        
        .share-buttons .btn.error {
            background: #f44336;
            color: white;
        }
        
        .share-preview {
            margin: 1rem 0;
            padding: 1rem;
            border: 2px dashed var(--border-color);
            border-radius: var(--radius-md);
        }
        
        .share-image-preview {
            max-width: 100%;
            border-radius: var(--radius-md);
            margin-top: 1rem;
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
    window.ShareManager = {
        share: openShareModal,
        nativeShare: nativeShare,
        generateImage: generateShareImage,
        downloadImage: downloadShareImage,
        updateScore: (score) => {
            currentScore = score;
            openShareModal(score);
        }
    };

})();