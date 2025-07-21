// Safe Performance Optimizations for Trading Journal Pro
class SafePerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    // Only apply safe optimizations that won't break the app
    this.optimizeTransitions();
    this.optimizeScrolling();
    this.optimizeTouch();
    this.addGPUAcceleration();
  }

  // Safe transition optimizations
  optimizeTransitions() {
    const style = document.createElement('style');
    style.textContent = `
      /* Faster, smoother transitions */
      button, a, [role="button"] {
        transition: transform 0.15s ease-out, box-shadow 0.15s ease-out !important;
      }
      
      .premium-button {
        transition: transform 0.2s ease-out, box-shadow 0.2s ease-out !important;
      }
      
      /* Smooth hover effects */
      button:hover, a:hover, [role="button"]:hover {
        transform: translateY(-1px);
      }
      
      button:active, a:active, [role="button"]:active {
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);
  }

  // Optimize scrolling performance
  optimizeScrolling() {
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Optimize scroll events with throttling
    let scrollTimeout;
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      if (type === 'scroll') {
        const throttledListener = (event) => {
          if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
              listener(event);
              scrollTimeout = null;
            }, 16); // ~60fps
          }
        };
        return originalAddEventListener.call(this, type, throttledListener, options);
      }
      return originalAddEventListener.call(this, type, listener, options);
    };
  }

  // Optimize touch interactions
  optimizeTouch() {
    // Add passive listeners for better performance
    const passiveEvents = ['touchstart', 'touchmove', 'wheel'];
    passiveEvents.forEach(eventType => {
      document.addEventListener(eventType, () => {}, { passive: true });
    });

    // Improve touch responsiveness
    const touchStyle = document.createElement('style');
    touchStyle.textContent = `
      * {
        touch-action: manipulation;
      }
      
      button, a, [role="button"] {
        -webkit-tap-highlight-color: transparent;
        user-select: none;
      }
    `;
    document.head.appendChild(touchStyle);
  }

  // Safe GPU acceleration
  addGPUAcceleration() {
    // Only add GPU acceleration to specific elements that benefit from it
    const gpuStyle = document.createElement('style');
    gpuStyle.textContent = `
      .premium-button,
      .install-prompt,
      .splash-screen,
      .loading-spinner {
        transform: translateZ(0);
        backface-visibility: hidden;
      }
      
      /* Optimize animations */
      @keyframes smoothPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
      
      .splash-logo {
        animation: smoothPulse 2s ease-in-out infinite;
      }
    `;
    document.head.appendChild(gpuStyle);
  }

  // Memory optimization (safe version)
  optimizeMemory() {
    // Clean up event listeners periodically
    setInterval(() => {
      // Force garbage collection if available
      if (window.gc) {
        window.gc();
      }
    }, 60000); // Every minute
  }
}

// Initialize safe performance optimizer after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new SafePerformanceOptimizer();
  });
} else {
  new SafePerformanceOptimizer();
}

