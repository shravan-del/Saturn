// Voice Guardian Web App
class VoiceGuardianApp {
    constructor() {
        this.apiBase = 'http://localhost:8000';
        this.isListening = false;
        this.recognition = null;
        this.authToken = null;
        this.user = null;
        
        this.init();
    }
    
    async init() {
        console.log('🎤 Voice Guardian Web App Initializing...');
        
        // Check for OAuth callback parameters
        await this.handleOAuthCallback();
        
        // Check if user is already authenticated
        await this.checkAuth();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize speech recognition
        this.initSpeechRecognition();
        
        console.log('✅ Voice Guardian Web App Ready!');
    }
    
    async handleOAuthCallback() {
        // Check for OAuth callback parameters in URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const userId = urlParams.get('user_id');
        const email = urlParams.get('email');
        const name = urlParams.get('name');
        
        if (token && userId && email && name) {
            console.log('🎉 OAuth callback detected, processing...');
            
            // Store authentication data
            this.authToken = token;
            this.user = {
                id: userId,
                email: email,
                name: name
            };
            
            // Save to localStorage
            localStorage.setItem('voice_guardian_token', token);
            localStorage.setItem('voice_guardian_user', JSON.stringify(this.user));
            
            // Clean up URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
            
            // Show success message and main screen
            this.showMessage('Signed in successfully!', 'success');
            this.showMainScreen();
            await this.loadActions();
            
            return true;
        }
        
        return false;
    }
    
    setupEventListeners() {
        // Google Sign In
        const googleSignInBtn = document.getElementById('google-signin-btn');
        if (googleSignInBtn) {
            googleSignInBtn.addEventListener('click', () => this.handleGoogleSignIn());
        }
        
        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
        
        // Voice Button
        const voiceButton = document.getElementById('voice-button');
        if (voiceButton) {
            voiceButton.addEventListener('click', () => this.toggleVoiceRecognition());
        }
        
        // Refresh Actions
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadActions());
        }
        
        // Quick Actions
        const quickActionBtns = document.querySelectorAll('.quick-action-btn');
        quickActionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });
    }
    
    async checkAuth() {
        try {
            const token = localStorage.getItem('voice_guardian_token');
            if (token) {
                this.authToken = token;
                await this.getUserInfo();
                this.showMainScreen();
            } else {
                this.showLoginScreen();
            }
        } catch (error) {
            console.error('Auth check error:', error);
            this.showLoginScreen();
        }
    }
    
    async handleGoogleSignIn() {
        try {
            console.log('🔐 Starting Google OAuth...');
            
            // Get OAuth URL from backend
            const response = await fetch(`${this.apiBase}/auth/google/login`);
            const data = await response.json();
            
            console.log('OAuth URL received:', data.authorization_url);
            
            // Store state for verification
            this.oauthState = data.state;
            
            // Redirect to OAuth URL instead of popup
            window.location.href = data.authorization_url;
            
        } catch (error) {
            console.error('OAuth error:', error);
            this.showMessage('Failed to start sign in', 'error');
        }
    }
    
    setupFocusListener() {
        // Listen for when the user returns to our window
        const handleFocus = () => {
            console.log('Window focused, checking for OAuth completion...');
            
            // Check if we have a stored token (indicating successful auth)
            const token = localStorage.getItem('voice_guardian_token');
            if (token) {
                console.log('Token found, OAuth completed successfully');
                this.hideLoading();
                this.showMessage('Signed in successfully!', 'success');
                this.showMainScreen();
                this.loadActions();
                
                // Remove the focus listener
                window.removeEventListener('focus', handleFocus);
            }
        };
        
        window.addEventListener('focus', handleFocus);
        
        // Remove listener after 5 minutes
        setTimeout(() => {
            window.removeEventListener('focus', handleFocus);
        }, 300000);
    }
    
    listenForOAuthCallback(authWindow) {
        let checkCount = 0;
        const maxChecks = 300; // 5 minutes with 1-second intervals
        
        const checkCallback = () => {
            checkCount++;
            
            try {
                // Check if the window has navigated to our callback URL
                const currentUrl = authWindow.location.href;
                if (currentUrl.includes('/auth/google/callback')) {
                    console.log('OAuth callback detected:', currentUrl);
                    
                    // Extract code and state from URL
                    const url = new URL(currentUrl);
                    const code = url.searchParams.get('code');
                    const state = url.searchParams.get('state');
                    
                    console.log('Extracted code:', code, 'state:', state);
                    
                    // Close auth window
                    authWindow.close();
                    
                    // Complete OAuth flow
                    this.completeOAuthFlow(code, state);
                    return;
                }
            } catch (error) {
                // Cross-origin error is expected, continue checking
                console.log('Cross-origin check (normal):', error.message);
            }
            
            // Check if window is closed (without using window.closed)
            try {
                authWindow.location.href;
            } catch (error) {
                if (error.name === 'SecurityError' || error.message.includes('cross-origin')) {
                    // Window is still open but cross-origin, continue checking
                } else {
                    // Window might be closed
                    console.log('Window might be closed, stopping checks');
                    this.hideLoading();
                    this.showMessage('OAuth window was closed', 'error');
                    return;
                }
            }
            
            // Continue checking if we haven't reached max attempts
            if (checkCount < maxChecks) {
                setTimeout(checkCallback, 1000);
            } else {
                console.log('OAuth timeout reached');
                this.hideLoading();
                this.showMessage('Sign in timed out', 'error');
            }
        };
        
        // Start checking after a short delay
        setTimeout(checkCallback, 2000);
    }
    
    showManualCompletionOption() {
        // Show manual completion button immediately
        const loadingOverlay = document.getElementById('loading-overlay');
        const loadingText = loadingOverlay.querySelector('.loading-text');
        
        loadingText.innerHTML = `
            <div>Complete the Google sign-in in the popup window</div>
            <div style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
                After signing in, click the button below to continue
            </div>
            <button id="manual-complete-btn" style="
                margin-top: 1rem;
                padding: 0.75rem 1.5rem;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1rem;
                font-weight: 600;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                transition: all 0.2s;
            ">
                ✅ I completed the sign-in, continue
            </button>
            <div style="margin-top: 0.5rem; font-size: 0.8rem; color: #999;">
                If the popup closed, you can try again
            </div>
        `;
        
        document.getElementById('manual-complete-btn').addEventListener('click', async () => {
            console.log('Manual completion clicked, checking auth status...');
            
            // Check if we're already signed in by trying to get user info
            try {
                const token = localStorage.getItem('voice_guardian_token');
                if (token) {
                    const response = await fetch(`${this.apiBase}/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    if (response.ok) {
                        const user = await response.json();
                        this.user = user;
                        this.hideLoading();
                        this.showMessage('Signed in successfully!', 'success');
                        this.showMainScreen();
                        await this.loadActions();
                        return;
                    }
                }
                
                // If not signed in, try to complete OAuth flow manually
                this.hideLoading();
                this.showMessage('Please complete the sign-in process and try again', 'info');
                
            } catch (error) {
                console.error('Manual completion error:', error);
                this.hideLoading();
                this.showMessage('Please try signing in again', 'error');
            }
        });
    }
    
    async completeOAuthFlow(code, state) {
        try {
            console.log('🔄 Completing OAuth flow...');
            
            const response = await fetch(
                `${this.apiBase}/auth/google/callback?code=${code}&state=${state}`
            );
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
            
            const data = await response.json();
            console.log('OAuth response:', data);
            
            if (data.access_token) {
                // Save auth
                this.authToken = data.access_token;
                this.user = data.user;
                localStorage.setItem('voice_guardian_token', this.authToken);
                localStorage.setItem('voice_guardian_user', JSON.stringify(this.user));
                
                this.hideLoading();
                this.showMessage('Signed in successfully!', 'success');
                this.showMainScreen();
                await this.loadActions();
            } else {
                throw new Error('No access token received');
            }
            
        } catch (error) {
            console.error('OAuth completion error:', error);
            this.hideLoading();
            this.showMessage('Sign in failed: ' + error.message, 'error');
        }
    }
    
    async getUserInfo() {
        try {
            const response = await fetch(`${this.apiBase}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                }
            });
            
            if (response.ok) {
                this.user = await response.json();
                localStorage.setItem('voice_guardian_user', JSON.stringify(this.user));
            }
        } catch (error) {
            console.error('Get user info error:', error);
        }
    }
    
    async handleLogout() {
        try {
            await fetch(`${this.apiBase}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
        
        // Clear local storage
        localStorage.removeItem('voice_guardian_token');
        localStorage.removeItem('voice_guardian_user');
        this.authToken = null;
        this.user = null;
        
        this.showLoginScreen();
        this.showMessage('Logged out successfully', 'success');
    }
    
    showLoginScreen() {
        document.getElementById('login-screen').style.display = 'block';
        document.getElementById('main-screen').style.display = 'none';
        document.getElementById('user-info').style.display = 'none';
    }
    
    showMainScreen() {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-screen').style.display = 'grid';
        
        if (this.user) {
            document.getElementById('user-info').style.display = 'flex';
            document.getElementById('user-name').textContent = this.user.name;
            document.getElementById('user-email').textContent = this.user.email;
            document.getElementById('user-avatar').textContent = this.user.name.charAt(0).toUpperCase();
        }
    }
    
    initSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
        } else if ('SpeechRecognition' in window) {
            this.recognition = new SpeechRecognition();
        } else {
            console.warn('Speech recognition not supported');
            return;
        }
        
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
        
        this.recognition.onstart = () => {
            console.log('🎤 Speech recognition started');
            this.isListening = true;
            this.updateVoiceStatus('Listening...', 'listening');
        };
        
        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log('🎤 Speech result:', transcript);
            this.handleVoiceCommand(transcript);
        };
        
        this.recognition.onerror = (event) => {
            console.error('🎤 Speech recognition error:', event.error);
            this.isListening = false;
            this.updateVoiceStatus('Error: ' + event.error, 'error');
        };
        
        this.recognition.onend = () => {
            console.log('🎤 Speech recognition ended');
            this.isListening = false;
            this.updateVoiceStatus('Click to start voice command', 'idle');
        };
    }
    
    toggleVoiceRecognition() {
        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }
    
    updateVoiceStatus(text, status) {
        const statusElement = document.getElementById('voice-status');
        const statusText = statusElement.querySelector('.status-text');
        const voiceButton = document.getElementById('voice-button');
        
        statusText.textContent = text;
        
        // Update button state
        if (status === 'listening') {
            voiceButton.classList.add('listening');
        } else {
            voiceButton.classList.remove('listening');
        }
    }
    
    async handleVoiceCommand(transcript) {
        console.log('🎤 Processing voice command:', transcript);
        
        try {
            this.showLoading('Processing voice command...');
            
            const response = await fetch(`${this.apiBase}/voice/command`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`
                },
                body: JSON.stringify({
                    command: transcript
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Voice command response:', data);
            
            this.hideLoading();
            
            if (data.action_id) {
                this.showMessage(`Action created: ${data.intent.title || 'Voice command processed'}`, 'success');
                
                // Auto-execute the action for MVP
                await this.executeAction(data.action_id, true);
                await this.loadActions();
            } else {
                this.showMessage('No action created from voice command', 'error');
            }
            
        } catch (error) {
            console.error('Voice command error:', error);
            this.hideLoading();
            this.showMessage('Failed to process voice command: ' + error.message, 'error');
        }
    }
    
    async loadActions() {
        try {
            const response = await fetch(`${this.apiBase}/actions/`, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            this.displayActions(data.actions);
            
        } catch (error) {
            console.error('Load actions error:', error);
            this.showMessage('Failed to load actions: ' + error.message, 'error');
        }
    }
    
    displayActions(actions) {
        const actionsList = document.getElementById('actions-list');
        
        if (!actions || actions.length === 0) {
            actionsList.innerHTML = '<div class="loading">No actions yet. Try using voice commands!</div>';
            return;
        }
        
        actionsList.innerHTML = actions.map(action => `
            <div class="action-item">
                <div class="action-icon">${this.getActionIcon(action.intent_type)}</div>
                <div class="action-content">
                    <div class="action-title">${action.title}</div>
                    <div class="action-description">${action.description || 'No description'}</div>
                    <div class="action-meta">
                        <span>${new Date(action.created_at).toLocaleString()}</span>
                        <span class="action-status ${action.status}">${action.status}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    getActionIcon(intentType) {
        const icons = {
            'create_event': '📅',
            'send_email': '📧',
            'create_reminder': '⏰',
            'create_note': '📝',
            'default': '🎯'
        };
        return icons[intentType] || icons.default;
    }
    
    async executeAction(actionId, confirm) {
        this.showLoading('Executing action...');
        try {
            const response = await fetch(`${this.apiBase}/actions/execute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.authToken}`
                },
                body: JSON.stringify({ action_id: actionId, confirm: confirm })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to execute action');
            }
            
            const data = await response.json();
            this.hideLoading();
            this.showMessage(data.message, 'success');
            await this.loadActions();
            
        } catch (error) {
            console.error('Action execution error:', error);
            this.hideLoading();
            this.showMessage(`Error executing action: ${error.message}`, 'error');
        }
    }
    
    async handleQuickAction(action) {
        console.log('🚀 Quick action:', action);
        
        const commands = {
            'schedule': 'Schedule a meeting for tomorrow at 2 PM',
            'email': 'Send an email to the team about the project update',
            'reminder': 'Set a reminder to call John at 3 PM',
            'note': 'Create a note about the meeting discussion'
        };
        
        const command = commands[action];
        if (command) {
            await this.handleVoiceCommand(command);
        }
    }
    
    showLoading(text = 'Loading...') {
        const overlay = document.getElementById('loading-overlay');
        const loadingText = overlay.querySelector('.loading-text');
        loadingText.textContent = text;
        overlay.style.display = 'flex';
    }
    
    hideLoading() {
        document.getElementById('loading-overlay').style.display = 'none';
    }
    
    showMessage(text, type = 'success') {
        const toast = document.getElementById('message-toast');
        const messageText = document.getElementById('message-text');
        const messageIcon = document.getElementById('message-icon');
        
        messageText.textContent = text;
        messageIcon.textContent = type === 'success' ? '✅' : '❌';
        
        toast.className = `message-toast ${type}`;
        toast.style.display = 'block';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.voiceGuardianApp = new VoiceGuardianApp();
});
