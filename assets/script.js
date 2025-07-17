'use strict';

// DOM Elements
let messageInput;
let sendButton;
let chatContainer;
let attachButton;
let searchButton;
let voiceButton;
let errorMessage;

// Application State
const appState = {
    isTyping: false,
    messageCount: 0
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeElements();
        setupEventListeners();
        setupInputHandling();
        console.log('ChatGPT Clone initialized successfully');
    } catch (error) {
        console.error('Failed to initialize application:', error);
        showError('Failed to initialize the chat interface. Please refresh the page.');
    }
});

// Initialize DOM elements
function initializeElements() {
    messageInput = document.getElementById('messageInput');
    sendButton = document.getElementById('sendButton');
    chatContainer = document.getElementById('chatContainer');
    attachButton = document.getElementById('attachButton');
    searchButton = document.getElementById('searchButton');
    voiceButton = document.getElementById('voiceButton');
    errorMessage = document.getElementById('errorMessage');

    // Validate that all required elements exist
    const requiredElements = {
        messageInput,
        sendButton,
        chatContainer,
        attachButton,
        searchButton,
        voiceButton,
        errorMessage
    };

    for (const [name, element] of Object.entries(requiredElements)) {
        if (!element) {
            throw new Error(`Required element not found: ${name}`);
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    try {
        // Send button click
        sendButton.addEventListener('click', handleSendMessage);

        // Enter key in textarea (with Shift+Enter for new line)
        messageInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });

        // Action buttons
        attachButton.addEventListener('click', handleAttachClick);
        searchButton.addEventListener('click', handleSearchClick);
        voiceButton.addEventListener('click', handleVoiceClick);

        // Input validation
        messageInput.addEventListener('input', handleInputChange);
        messageInput.addEventListener('paste', handleInputChange);

    } catch (error) {
        console.error('Error setting up event listeners:', error);
        throw error;
    }
}

// Setup input handling and auto-resize
function setupInputHandling() {
    try {
        // Auto-resize textarea
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });

        // Initial state
        updateSendButtonState();
    } catch (error) {
        console.error('Error setting up input handling:', error);
    }
}

// Handle input changes
function handleInputChange() {
    try {
        hideError();
        updateSendButtonState();
    } catch (error) {
        console.error('Error handling input change:', error);
    }
}

// Update send button state based on input
function updateSendButtonState() {
    try {
        const hasContent = messageInput.value.trim().length > 0;
        sendButton.disabled = !hasContent || appState.isTyping;
    } catch (error) {
        console.error('Error updating send button state:', error);
    }
}

// Handle sending a message
async function handleSendMessage() {
    try {
        const message = messageInput.value.trim();
        
        // Validate input
        if (!message) {
            showError('Please enter a message before sending.');
            return;
        }

        if (message.length > 4000) {
            showError('Message is too long. Please keep it under 4000 characters.');
            return;
        }

        if (appState.isTyping) {
            showError('Please wait for the current response to complete.');
            return;
        }

        // Clear input and hide error
        messageInput.value = '';
        messageInput.style.height = 'auto';
        hideError();
        updateSendButtonState();

        // Add user message
        addMessage(message, 'user');

        // Simulate typing and response
        await simulateResponse();

    } catch (error) {
        console.error('Error sending message:', error);
        showError('Failed to send message. Please try again.');
        appState.isTyping = false;
        updateSendButtonState();
    }
}

// Add a message to the chat
function addMessage(content, type) {
    try {
        appState.messageCount++;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;
        messageDiv.setAttribute('data-message-id', appState.messageCount);

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = type === 'user' ? 'U' : 'AI';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);

        chatContainer.appendChild(messageDiv);
        scrollToBottom();

    } catch (error) {
        console.error('Error adding message:', error);
        throw error;
    }
}

// Simulate AI response
async function simulateResponse() {
    try {
        appState.isTyping = true;
        updateSendButtonState();

        // Add typing indicator
        const typingDiv = addTypingIndicator();

        // Simulate delay
        await delay(1000 + Math.random() * 2000);

        // Remove typing indicator
        if (typingDiv && typingDiv.parentNode) {
            typingDiv.parentNode.removeChild(typingDiv);
        }

        // Generate response
        const responses = [
            "I'm a demo version of ChatGPT. This is a simulated response to show how the interface works.",
            "This is a clone of the ChatGPT interface. The actual AI functionality would require integration with OpenAI's API.",
            "Hello! I'm simulating a ChatGPT response. In a real implementation, this would connect to an AI service.",
            "This interface mimics ChatGPT's design. Real responses would come from a language model API.",
            "I'm demonstrating how the chat interface works. Each message you send will get a simulated response like this one."
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage(randomResponse, 'assistant');

    } catch (error) {
        console.error('Error simulating response:', error);
        showError('Failed to generate response. Please try again.');
    } finally {
        appState.isTyping = false;
        updateSendButtonState();
    }
}

// Add typing indicator
function addTypingIndicator() {
    try {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message assistant typing';
        typingDiv.setAttribute('data-typing', 'true');

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = 'AI';

        const typingContent = document.createElement('div');
        typingContent.className = 'message-content';
        
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingIndicator.appendChild(dot);
        }
        
        typingContent.appendChild(typingIndicator);
        typingDiv.appendChild(avatar);
        typingDiv.appendChild(typingContent);

        chatContainer.appendChild(typingDiv);
        scrollToBottom();

        return typingDiv;
    } catch (error) {
        console.error('Error adding typing indicator:', error);
        return null;
    }
}

// Handle attach button click
function handleAttachClick() {
    try {
        // Create a hidden file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.accept = 'image/*,text/*,.pdf,.doc,.docx';
        
        fileInput.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
                const fileNames = files.map(f => f.name).join(', ');
                addMessage(`📎 Attached files: ${fileNames}`, 'user');
                setTimeout(() => {
                    addMessage("File attachment is a demo feature. In a real implementation, files would be processed and analyzed.", 'assistant');
                }, 1000);
            }
        });

        fileInput.click();
    } catch (error) {
        console.error('Error handling attach click:', error);
        showError('File attachment feature is temporarily unavailable.');
    }
}

// Handle search button click
function handleSearchClick() {
    try {
        const searchQuery = prompt('Enter your search query:');
        if (searchQuery && searchQuery.trim()) {
            addMessage(`🔍 Searching for: "${searchQuery.trim()}"`, 'user');
            setTimeout(() => {
                addMessage(`Search functionality is a demo feature. In a real implementation, this would search through chat history or external sources for "${searchQuery.trim()}".`, 'assistant');
            }, 1000);
        }
    } catch (error) {
        console.error('Error handling search click:', error);
        showError('Search feature is temporarily unavailable.');
    }
}

// Handle voice button click
function handleVoiceClick() {
    try {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = function() {
                voiceButton.style.backgroundColor = '#dc3545';
                voiceButton.innerHTML = '<span>🔴</span> Listening...';
            };

            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                messageInput.value = transcript;
                handleInputChange();
                messageInput.focus();
            };

            recognition.onerror = function(event) {
                console.error('Speech recognition error:', event.error);
                showError('Voice recognition failed. Please try again or type your message.');
            };

            recognition.onend = function() {
                voiceButton.style.backgroundColor = '';
                voiceButton.innerHTML = '<span>🎤</span> Voice';
            };

            recognition.start();
        } else {
            addMessage("🎤 Voice input requested", 'user');
            setTimeout(() => {
                addMessage("Voice recognition is not supported in your browser. This is a demo of how the voice feature would work.", 'assistant');
            }, 1000);
        }
    } catch (error) {
        console.error('Error handling voice click:', error);
        showError('Voice feature is temporarily unavailable.');
    }
}

// Utility functions
function scrollToBottom() {
    try {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    } catch (error) {
        console.error('Error scrolling to bottom:', error);
    }
}

function showError(message) {
    try {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(hideError, 5000); // Auto-hide after 5 seconds
    } catch (error) {
        console.error('Error showing error message:', error);
    }
}

function hideError() {
    try {
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';
    } catch (error) {
        console.error('Error hiding error message:', error);
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, pause any ongoing operations
        console.log('Page hidden, pausing operations');
    } else {
        // Page is visible, resume operations
        console.log('Page visible, resuming operations');
    }
});

// Handle errors globally
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showError('An unexpected error occurred. Please refresh the page if problems persist.');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    showError('An unexpected error occurred. Please refresh the page if problems persist.');
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addMessage,
        showError,
        hideError,
        updateSendButtonState
    };
}
