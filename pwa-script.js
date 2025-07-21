// PWA Functionality Script
class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.init();
  }

  init() {
    this.registerServiceWorker();
    this.setupInstallPrompt();
    this.setupSplashScreen();
    this.checkInstallStatus();
    this.setupOfflineDetection();
  }

  // Register service worker
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('PWA: Service Worker registered successfully:', registration);
        
        // Handle service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.showUpdateAvailable();
            }
          });
        });
      } catch (error) {
        console.error('PWA: Service Worker registration failed:', error);
      }
    }
  }

  // Setup install prompt
  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallPrompt();
    });

    window.addEventListener('appinstalled', () => {
      console.log('PWA: App installed successfully');
      this.isInstalled = true;
      this.hideInstallPrompt();
    });
  }

  // Show install prompt
  showInstallPrompt() {
    if (this.isInstalled || !this.deferredPrompt) return;

    const promptHTML = `
      <div class="install-prompt" id="installPrompt">
        <div class="install-prompt-text">
          Install Trading Journal Pro for the best experience
        </div>
        <div class="install-prompt-buttons">
          <button class="install-button" onclick="pwaManager.installApp()">
            Install App
          </button>
          <button class="dismiss-button" onclick="pwaManager.dismissInstallPrompt()">
            Not Now
          </button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', promptHTML);
    
    setTimeout(() => {
      const prompt = document.getElementById('installPrompt');
      if (prompt) prompt.classList.add('show');
    }, 2000);
  }

  // Install app
  async installApp() {
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA: User accepted the install prompt');
    } else {
      console.log('PWA: User dismissed the install prompt');
    }
    
    this.deferredPrompt = null;
    this.hideInstallPrompt();
  }

  // Dismiss install prompt
  dismissInstallPrompt() {
    this.hideInstallPrompt();
    localStorage.setItem('installPromptDismissed', Date.now().toString());
  }

  // Hide install prompt
  hideInstallPrompt() {
    const prompt = document.getElementById('installPrompt');
    if (prompt) {
      prompt.classList.remove('show');
      setTimeout(() => prompt.remove(), 300);
    }
  }

  // Setup splash screen
  setupSplashScreen() {
    const splashHTML = `
      <div class="splash-screen" id="splashScreen">
        <img src="/icons/icon-192x192.png" alt="TJ Pro" class="splash-logo">
        <div class="splash-text">Trading Journal Pro</div>
        <div class="loading-spinner"></div>
      </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', splashHTML);

    // Hide splash screen after app loads
    window.addEventListener('load', () => {
      setTimeout(() => {
        const splash = document.getElementById('splashScreen');
        if (splash) {
          splash.classList.add('fade-out');
          setTimeout(() => splash.remove(), 500);
        }
      }, 1500);
    });
  }

  // Check if app is installed
  checkInstallStatus() {
    // Check if running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
      console.log('PWA: App is running in standalone mode');
    }

    // Check if launched from home screen on iOS
    if (window.navigator.standalone === true) {
      this.isInstalled = true;
      console.log('PWA: App launched from home screen on iOS');
    }
  }

  // Setup offline detection
  setupOfflineDetection() {
    window.addEventListener('online', () => {
      console.log('PWA: Back online');
      this.showConnectionStatus('online');
    });

    window.addEventListener('offline', () => {
      console.log('PWA: Gone offline');
      this.showConnectionStatus('offline');
    });
  }

  // Show connection status
  showConnectionStatus(status) {
    const statusHTML = `
      <div class="connection-status ${status}" id="connectionStatus">
        ${status === 'online' ? '🟢 Back Online' : '🔴 Offline Mode'}
      </div>
    `;

    // Remove existing status
    const existing = document.getElementById('connectionStatus');
    if (existing) existing.remove();

    document.body.insertAdjacentHTML('beforeend', statusHTML);

    // Auto-hide after 3 seconds
    setTimeout(() => {
      const statusEl = document.getElementById('connectionStatus');
      if (statusEl) statusEl.remove();
    }, 3000);
  }

  // Show update available notification
  showUpdateAvailable() {
    const updateHTML = `
      <div class="update-prompt" id="updatePrompt">
        <div class="update-prompt-text">
          A new version is available!
        </div>
        <div class="update-prompt-buttons">
          <button class="install-button" onclick="pwaManager.updateApp()">
            Update Now
          </button>
          <button class="dismiss-button" onclick="pwaManager.dismissUpdate()">
            Later
          </button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', updateHTML);
    
    setTimeout(() => {
      const prompt = document.getElementById('updatePrompt');
      if (prompt) prompt.classList.add('show');
    }, 1000);
  }

  // Update app
  updateApp() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      });
    }
  }

  // Dismiss update
  dismissUpdate() {
    const prompt = document.getElementById('updatePrompt');
    if (prompt) {
      prompt.classList.remove('show');
      setTimeout(() => prompt.remove(), 300);
    }
  }
}

// Initialize PWA Manager
const pwaManager = new PWAManager();

// Add connection status styles
const connectionStyles = `
  .connection-status {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    z-index: 10000;
    backdrop-filter: blur(10px);
    animation: slideIn 0.3s ease;
  }

  .connection-status.online {
    background: rgba(34, 197, 94, 0.9);
  }

  .connection-status.offline {
    background: rgba(239, 68, 68, 0.9);
  }

  .update-prompt {
    position: fixed;
    top: 20px;
    left: 20px;
    right: 20px;
    background: linear-gradient(135deg, #1C2534 0%, #2D3748 100%);
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(212, 175, 55, 0.2);
    z-index: 1000;
    transform: translateY(-100px);
    opacity: 0;
    transition: all 0.3s ease;
  }

  .update-prompt.show {
    transform: translateY(0);
    opacity: 1;
  }

  .update-prompt-text {
    color: #F9FAFB;
    font-size: 14px;
    margin-bottom: 12px;
  }

  .update-prompt-buttons {
    display: flex;
    gap: 12px;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = connectionStyles;
document.head.appendChild(styleSheet);

