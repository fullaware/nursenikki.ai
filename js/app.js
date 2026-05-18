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
    const chatGreeting = document.getElementById('chatGreeting');
    const chatCursor = document.getElementById('chatCursor');
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
    // Chat Greeting Typewriter
    // ==========================================

    const greetingText = 'What brings you in today?';
    let greetingIndex = 0;
    let greetingTimeout = null;

    /**
     * Type out the greeting message character by character
     */
    function typeGreeting() {
        if (greetingIndex < greetingText.length) {
            chatGreeting.textContent += greetingText.charAt(greetingIndex);
            greetingIndex++;
            const speed = 60 + Math.random() * 50;
            greetingTimeout = setTimeout(typeGreeting, speed);
        } else {
            // Finished typing - hide cursor after a pause
            setTimeout(() => {
                chatCursor.classList.add('done');
            }, 1500);
        }
    }

    /**
     * Start the greeting animation after page load
     */
    function startGreeting() {
        setTimeout(typeGreeting, 800);
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
    }

    // ==========================================
    // Event Listeners
    // ==========================================

    function initEventListeners() {
        // Theme toggle
        themeToggle.addEventListener('click', toggleTheme);

        // Search form
        searchForm.addEventListener('submit', handleSearch);

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
        startGreeting();
    }

    // Start the application when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();