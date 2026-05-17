/* ==========================================
   NurseNikki.AI - Main Application JavaScript
   ========================================== */

(function () {
    'use strict';

    // ==========================================
    // DOM Elements
    // ==========================================

    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const searchInputWrapper = document.querySelector('.search-input-wrapper');
    const typewriterText = document.getElementById('typewriterText');
    const typewriterCursor = document.getElementById('typewriterCursor');
    const disclaimerToggle = document.getElementById('disclaimerToggle');
    const disclaimerContent = document.getElementById('disclaimerContent');
    const disclaimerArrow = document.getElementById('disclaimerArrow');
    const sampleChips = document.querySelectorAll('.sample-chip');

    // ==========================================
    // Theme Management
    // ==========================================

    /**
     * Initialize theme from localStorage or system preference
     */
    function initTheme() {
        const savedTheme = localStorage.getItem('nursenikki-theme');
        if (savedTheme) {
            html.setAttribute('data-theme', savedTheme);
        } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
            html.setAttribute('data-theme', 'light');
        }
        // Default is dark, already set in HTML
    }

    /**
     * Toggle between dark and light themes
     */
    function toggleTheme() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('nursenikki-theme', newTheme);
    }

    // ==========================================
    // Typewriter Animation
    // ==========================================

    const typewriterPhrases = [
        'painful swallowing',
        'what kind of rash is this?',
        'how to treat heartburn?',
        'signs of dehydration',
        'normal blood pressure range',
        'when to see a doctor for fever?',
        'how to manage diabetes?',
        'symptoms of high cholesterol',
        'healthy sleep habits',
        'what causes chronic fatigue?'
    ];

    let typewriterIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typewriterTimeout = null;
    let isTypewriterActive = true; // Track if animation should run

    /**
     * Update the position of the cursor to follow the text
     */
    function updateCursorPosition() {
        const text = typewriterText.textContent;
        const tempSpan = document.createElement('span');
        tempSpan.className = 'search-input';
        tempSpan.textContent = text;
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.position = 'absolute';
        tempSpan.style.whiteSpace = 'pre';
        document.body.appendChild(tempSpan);
        const width = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);

        // Base left position matches the typewriter elements
        const baseLeft = getComputedStyle(typewriterText).left;
        typewriterCursor.style.left = `calc(${baseLeft} + ${width}px)`;
    }

    /**
     * Main typewriter animation loop
     */
    function typewriterLoop() {
        if (!isTypewriterActive) return;

        const currentPhrase = typewriterPhrases[typewriterIndex];

        if (!isDeleting) {
            // Typing forward
            charIndex++;
            typewriterText.textContent = currentPhrase.substring(0, charIndex);
            typewriterText.classList.add('active');
            typewriterCursor.classList.add('active');
            updateCursorPosition();

            if (charIndex === currentPhrase.length) {
                // Finished typing, pause then start deleting
                typewriterTimeout = setTimeout(() => {
                    isDeleting = true;
                    typewriterLoop();
                }, 2000); // Pause at end
                return;
            }

            // Variable typing speed for natural feel
            const speed = 80 + Math.random() * 40;
            typewriterTimeout = setTimeout(typewriterLoop, speed);
        } else {
            // Deleting
            charIndex--;
            typewriterText.textContent = currentPhrase.substring(0, charIndex);
            updateCursorPosition();

            if (charIndex === 0) {
                // Finished deleting, move to next phrase
                isDeleting = false;
                typewriterIndex = (typewriterIndex + 1) % typewriterPhrases.length;

                // Pause before next phrase
                typewriterTimeout = setTimeout(typewriterLoop, 500);
                return;
            }

            // Deleting is faster
            typewriterTimeout = setTimeout(typewriterLoop, 30);
        }
    }

    /**
     * Start the typewriter animation
     */
    function startTypewriter() {
        isTypewriterActive = true;
        typewriterText.classList.add('active');
        typewriterCursor.classList.add('active');
        searchInputWrapper.classList.add('typewriter-active');
        typewriterLoop();
    }

    /**
     * Stop the typewriter animation (when user interacts)
     */
    function stopTypewriter() {
        isTypewriterActive = false;
        if (typewriterTimeout) {
            clearTimeout(typewriterTimeout);
            typewriterTimeout = null;
        }
        typewriterText.classList.remove('active');
        typewriterCursor.classList.remove('active');
        searchInputWrapper.classList.remove('typewriter-active');
        typewriterText.textContent = '';
    }

    // ==========================================
    // Disclaimer Toggle
    // ==========================================

    /**
     * Toggle the disclaimer expand/collapse
     */
    function toggleDisclaimer() {
        const isExpanded = disclaimerToggle.getAttribute('aria-expanded') === 'true';
        disclaimerToggle.setAttribute('aria-expanded', !isExpanded);
        disclaimerContent.setAttribute('aria-hidden', isExpanded);
    }

    // ==========================================
    // Search Functionality
    // ==========================================

    /**
     * Handle search form submission
     */
    function handleSearch(e) {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            // TODO: Connect to AI backend API
            console.log('Search query:', query);
            // For now, just log the query
            // In production, this would call the AI chatbot API
        }
    }

    /**
     * Handle sample chip click
     */
    function handleChipClick(e) {
        const query = e.currentTarget.getAttribute('data-query');
        searchInput.value = query;
        searchInput.focus();
        stopTypewriter();
    }

    // ==========================================
    // Event Listeners
    // ==========================================

    function initEventListeners() {
        // Theme toggle
        themeToggle.addEventListener('click', toggleTheme);

        // Search form
        searchForm.addEventListener('submit', handleSearch);

        // Stop typewriter when user interacts with search
        searchInput.addEventListener('focus', stopTypewriter);
        searchInput.addEventListener('input', function () {
            if (this.value.length > 0 && isTypewriterActive) {
                stopTypewriter();
            }
        });

        // Restart typewriter when input is cleared and focus is lost
        searchInput.addEventListener('blur', function () {
            if (this.value.length === 0) {
                // Small delay before restarting
                setTimeout(() => {
                    if (searchInput.value.length === 0 && !searchInput.matches(':focus')) {
                        startTypewriter();
                    }
                }, 2000);
            }
        });

        // Disclaimer toggle
        disclaimerToggle.addEventListener('click', toggleDisclaimer);

        // Sample chips
        sampleChips.forEach(chip => {
            chip.addEventListener('click', handleChipClick);
        });

        // Keyboard accessibility for disclaimer
        disclaimerToggle.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDisclaimer();
            }
        });
    }

    // ==========================================
    // Initialization
    // ==========================================

    function init() {
        initTheme();
        initEventListeners();

        // Start typewriter after a small delay for page load
        setTimeout(startTypewriter, 1000);
    }

    // Start the application when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();