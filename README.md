# Multi-AI Sidebar Chrome Extension  
 
## Features  
- Integrates multiple AI providers (ChatGPT, Gemini, and DeepSeek) into a convenient Chrome side panel for easy access.  
- Simple UI with provider tabs so you can switch between ChatGPT, Gemini, and DeepSeek easily.  
- Remembers the last provider you used by storing it in Chrome storage for quick relaunch.  
- Uses declarativeNetRequest rules to remove headers such as X-Frame-Options and Frame-Options so that provider pages load inside iframes.  
- Displays loading indicators and error messages when providers fail to load; includes a retry button and offline detection.  
- Does not collect or transmit any user data – all requests go directly to the provider websites.  
 
## Installation  
1. Clone or download this repository.  
2. Open Chrome and navigate to `chrome://extensions/`.  
3. Enable **Developer mode** using the toggle in the upper-right corner.  
4. Click **Load unpacked** and select the `multi-ai-sidebar` folder.  
5. A new icon will appear in the toolbar; click it to open the side panel.  
 
## Usage  
- Click the extension icon to open the side panel, or open it via the Chrome side panel menu.  
- Choose the desired AI provider by clicking on its tab (ChatGPT, Gemini, or DeepSeek).  
- Use the embedded interface just as you would on the provider’s website.  
- The extension will remember which provider you last selected for the next time you open the panel.  
 
## Permissions  
The extension requires a small set of permissions:  
- `sidePanel` – to display a custom side panel.  
- `storage` – to save the last selected provider.  
- `cookies` – to maintain login sessions for the embedded provider pages.  
- `declarativeNetRequest` – to remove headers that would otherwise block providers from loading in iframes.  
 
## Troubleshooting  
- If a provider page fails to load inside the side panel, try opening the provider in a regular tab and logging in there first.  
- Some providers may change their embed policies; if an iframe refuses to load even after logging in, report the issue on the repository’s issue tracker.  
- Use the **Retry** button to reload the embedded page if network connectivity is temporarily lost.  
 
## Privacy  
This extension does **not** collect any personal data. All interactions happen directly between your browser and the AI provider sites. There is no analytics, tracking, or data collection.  
 
## License  
This project is licensed under the [MIT License](LICENSE). 
