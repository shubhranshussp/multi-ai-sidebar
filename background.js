// ============================================
// MULTI-AI SIDEBAR v3.1 - Background Service Worker
// ============================================

chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.sidePanel.open({ windowId: tab.windowId });
    console.log('Multi-AI sidebar opened successfully for tab:', tab.id);
  } catch (error) {
    console.error('Failed to open side panel with windowId:', error);
    try {
      await chrome.sidePanel.open({ tabId: tab.id });
      console.log('Sidebar opened with tabId fallback');
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
    }
  }
});

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => {
    console.error('Error setting panel behavior:', error);
  });

chrome.runtime.onInstalled.addListener((details) => {
  const manifest = chrome.runtime.getManifest();

  if (details.reason === 'install') {
    console.log('Multi-AI Chat Sidebar v3.1 installed successfully! Version:', manifest.version);
    console.log('Supported AI services: ChatGPT, Gemini, DeepSeek');
  } else if (details.reason === 'update') {
    const previousVersion = details.previousVersion;
    console.log(`Multi-AI Sidebar updated from ${previousVersion} to ${manifest.version}`);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message);
  sendResponse({ success: true });
  return true;
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Reserved for future logic
});

console.log('Multi-AI Sidebar v3.1 background service worker initialized');
