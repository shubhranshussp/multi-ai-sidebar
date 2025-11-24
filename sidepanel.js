// ============================================
// MULTI-AI CHAT SIDEBAR - Main Logic v3.1
// ============================================

const SERVICES = {
  chatgpt: {
    name: 'ChatGPT',
    url: 'https://chatgpt.com/',
    domain: 'chatgpt.com',
    color: '#10a37f',
    loginMethod: 'Standard login works well'
  },

  gemini: {
    name: 'Gemini',
    url: 'https://gemini.google.com/app',
    domain: 'gemini.google.com',
    color: '#4285f4',
    loginMethod: 'Google account required'
  },
  deepseek: {
    name: 'DeepSeek',
    url: 'https://chat.deepseek.com/',
    alternateUrl: 'https://chat.deepseek.com/sign_in',
    domain: 'chat.deepseek.com',
    color: '#1890ff',
    loginMethod: 'Use Email/Phone login (not Google) for best results'
  }
};

const tabs = document.querySelectorAll('.tab');
const frame = document.getElementById('chat-frame');
const loading = document.getElementById('loading');
const loadingText = document.getElementById('loading-text');
const loadingSubtext = document.getElementById('loading-subtext');
const networkStatus = document.getElementById('network-status');

let currentService = null;
let isLoading = false;

function init() {
  const lastService = localStorage.getItem('lastAIService') || 'chatgpt';
  setupTabListeners();
  setupFrameListeners();
  setupNetworkListeners();
  loadService(lastService);
}

function setupTabListeners() {
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const service = tab.dataset.service;
      console.log(`Tab clicked: ${service}, Current service: ${currentService}`);
      
      if (service === currentService && !isLoading) {
        console.log('Reloading same service');
        reloadCurrentService();
      } else {
        console.log(`Switching to new service: ${service}`);
        loadService(service);
      }
    });
  });
}

function updateTabUI(serviceKey) {
  tabs.forEach(tab => {
    const isActive = tab.dataset.service === serviceKey;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive);
  });
}

function loadService(serviceKey, useAlternate = false) {
  const service = SERVICES[serviceKey];
  if (!service) {
    console.error('Service not found:', serviceKey);
    return;
  }

  if (!navigator.onLine) {
    showError('No Internet Connection', 'Please check your network and try again.', true);
    return;
  }

  // Update UI and state first
  currentService = serviceKey;
  localStorage.setItem('lastAIService', serviceKey);
  updateTabUI(serviceKey);
  showLoading(service.name);

  // Determine which URL to load
  let urlToLoad = service.url;
  if (useAlternate && service.alternateUrl) {
    urlToLoad = service.alternateUrl;
  }

  console.log(`Loading ${service.name} from: ${urlToLoad}`);

  // Clear the frame first to prevent caching issues
  frame.src = 'about:blank';
  
  // Set loading state
  isLoading = true;

  // Load the new URL after a brief delay to ensure clean load
  setTimeout(() => {
    frame.src = urlToLoad;
  }, 50);

  // Auto-hide loading overlay after 900ms
  setTimeout(() => {
    if (isLoading) {
      hideLoading();
    }
  }, 900);
}

function reloadCurrentService() {
  if (currentService) {
    loadService(currentService);
  }
}

function showLoading(serviceName) {
  isLoading = true;
  loadingText.textContent = `Loading ${serviceName}...`;
  loadingSubtext.textContent = 'Please wait';
  loading.classList.remove('hidden');
  loading.style.display = 'flex';
}

function hideLoading() {
  isLoading = false;
  loading.classList.add('hidden');
  setTimeout(() => {
    loading.style.display = 'none';
  }, 200);
}

function showError(title, message, canRetry = true, showAlternative = false) {
  const service = SERVICES[currentService];
  let alternativeButton = '';
  if (showAlternative && service && service.alternateUrl) {
    alternativeButton = '<button id="alternate-btn" class="secondary-btn">Try Alternative Login</button>';
  }

  let helpText = '';
  if (service && service.loginMethod) {
    helpText = `<p style="margin-top: 12px; font-size: 12px; color: #60a5fa;">💡 Tip: ${service.loginMethod}</p>`;
  }

  loading.innerHTML = `
    <div class="error-container">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <h2>${title}</h2>
      <p>${message}</p>
      ${!navigator.onLine ? '<p style="color: #ef4444; margin-top: 8px;">⚠️ You appear to be offline</p>' : ''}
      ${helpText}
      ${service ? `<p style="margin-top: 12px; font-size: 12px;">
        Try opening <a href="${service.url}" target="_blank">${service.domain}</a> in a new tab to login first.
      </p>` : ''}
      ${canRetry ? '<button id="retry-btn">Retry</button>' : ''}
      ${alternativeButton}
    </div>
  `;

  loading.classList.remove('hidden');
  loading.style.display = 'flex';

  if (canRetry) {
    document.getElementById('retry-btn')?.addEventListener('click', () => {
      reloadCurrentService();
    });
  }
  if (showAlternative) {
    document.getElementById('alternate-btn')?.addEventListener('click', () => {
      loadService(currentService, true);
    });
  }
}

function showDeepSeekHelp() {
  const service = SERVICES['deepseek'];
  if (!service) return;

  loading.innerHTML = `
    <div class="error-container">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="${service.color}" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 16v-4"></path>
        <path d="M12 8h.01"></path>
      </svg>
      <h2 style="color: ${service.color};">DeepSeek Login Help</h2>
      <p style="margin: 12px 0;">DeepSeek's Google login can have issues in iframes.</p>
      <p style="font-size: 14px; line-height: 1.6;">
        <strong>Recommended:</strong><br>
        1. Open <a href="https://chat.deepseek.com/sign_in" target="_blank">chat.deepseek.com</a> in a new tab<br>
        2. Use <strong>Email or Phone</strong> login (NOT Google)<br>
        3. Complete login there<br>
        4. Come back and click Retry
      </p>
      <button id="retry-btn">I'm Logged In - Retry</button>
      <button id="open-tab-btn" class="secondary-btn">Open DeepSeek Login</button>
    </div>
  `;

  loading.classList.remove('hidden');
  loading.style.display = 'flex';

  document.getElementById('retry-btn')?.addEventListener('click', reloadCurrentService);
  document.getElementById('open-tab-btn')?.addEventListener('click', () => {
    window.open('https://chat.deepseek.com/sign_in', '_blank');
  });
}

function setupFrameListeners() {
  frame.addEventListener('error', () => {
    const service = SERVICES[currentService];
    if (currentService === 'deepseek') {
      showDeepSeekHelp();
    } else {
      showError(
        `Failed to Load ${service?.name || 'Service'}`,
        'This AI service could not be loaded. It may have iframe restrictions.',
        true,
        currentService === 'deepseek'
      );
    }
  });
}

function setupNetworkListeners() {
  window.addEventListener('offline', handleOffline);
  window.addEventListener('online', handleOnline);

  if (!navigator.onLine) {
    handleOffline();
  }
}

function handleOffline() {
  networkStatus.classList.add('show');
  showError(
    'No Internet Connection',
    'Your network connection was lost. Please check your connection and try again.',
    true
  );
}

function handleOnline() {
  networkStatus.classList.remove('show');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

console.log('Multi-AI Sidebar v3.1 loaded');
console.log('Available services:', Object.keys(SERVICES));
