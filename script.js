// DOM Elements
const chatbotContainer = document.getElementById('chatbotContainer');
const chatbotToggle = document.getElementById('chatbotToggle');
const closeChat = document.getElementById('closeChat');
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendMessage');

// System prompt for the chatbot
const SYSTEM_PROMPT = `Act like an intelligent and friendly chatbot assistant designed specifically for the website "Studyocean". Your goal is to help users explore and access **free study materials**, **practice work (PW)**, **revision work (RW)**, and **live classes** available on Studyocean. You also guide them through account setup, key generation, and provide developer contact support if needed.

Task: Engage users in a clear, supportive, and helpful way while maintaining an educational tone that encourages learning.

Requirements:
1. Greet users warmly and introduce Studyocean as a free study platform.
2. Explain how to generate or use their access key if they ask for it.
3. Provide quick access information about available resources:
   - Study material categories (subjects, grades, topics)
   - PW (Practice Work) and RW (Revision Work)
   - Live classes and how to join them
4. Offer troubleshooting support if users face access or login problems.
5. Share contact details or instructions to reach the developer team if issues persist.
6. Keep answers concise, friendly, and easy to understand for students.
7. Never share unrelated or unsafe links — only provide verified Studyocean information.

Context:
Studyocean is a free educational platform offering:
- Study materials for all major subjects
- Practice and revision work modules (PW & RW)
- Interactive live classes
- 100% free access (users only need to generate a key)
If users face any issues, they can reach out directly to the developer support team via the "Contact Developer" option.

Constraints:
- Format: Short messages, bulleted info, or step-by-step guidance
- Style: Friendly, motivating, and clear
- Scope: Focus only on education, account setup, or technical help
- Reasoning: Always confirm user intent before giving steps
- Self-check: Verify all responses are accurate and relevant to Studyocean before sending`;

// Chat history from localStorage
let chatHistory = JSON.parse(localStorage.getItem('studyocean_chat_history')) || [];

// Toggle chat visibility
function toggleChat(forceClose = false) {
    if (forceClose) {
        chatbotContainer.classList.remove('active');
        return;
    }
    
    // Always open when toggle is clicked
    chatbotContainer.classList.add('active');
    userInput.focus();
}

// Add message to chat with typing animation for bot messages
async function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = getCurrentTime();
    
    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(messageTime);
    chatMessages.appendChild(messageDiv);
    
    // Add to chat history first
    chatHistory.push({
        role: isUser ? 'user' : 'assistant',
        content: content,
        timestamp: new Date().toISOString()
    });
    
    // Save to localStorage (keep last 20 messages)
    chatHistory = chatHistory.slice(-20);
    localStorage.setItem('studyocean_chat_history', JSON.stringify(chatHistory));
    
    if (isUser) {
        // For user messages, display immediately
        messageContent.textContent = content;
    } else {
        // For bot messages, show typing animation
        messageContent.innerHTML = '<span class="typing-cursor">|</span>';
        await typeMessage(content, messageContent);
    }
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Type message with animation
async function typeMessage(message, element) {
    return new Promise(resolve => {
        let i = 0;
        const speed = 20; // Typing speed in milliseconds
        
        function typeWriter() {
            if (i < message.length) {
                // Remove the cursor
                const currentText = element.innerHTML.replace('<span class="typing-cursor">|</span>', '');
                // Add next character and cursor
                element.innerHTML = currentText + message.charAt(i) + 
                    (i < message.length - 1 ? '<span class="typing-cursor">|</span>' : '');
                i++;
                setTimeout(typeWriter, speed);
            } else {
                resolve();
            }
        }
        
        typeWriter();
    });
}

// Show typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Get current time in HH:MM format
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Get response from Pollinations.ai API
async function getBotResponse(userMessage) {
    // Format the prompt to be more structured for the AI
    const prompt = `You are a helpful assistant for Studyocean, a free educational platform. 
    You help students with study materials, practice work, revision work, and live classes.
    
    User: ${userMessage}
    
    Please provide a helpful and accurate response related to Studyocean's services. 
    If the question is not related to Studyocean, politely guide the user back to relevant topics.
    
    Keep your response concise, friendly, and focused on education.
    
    Response:`;
    
    const encodedPrompt = encodeURIComponent(prompt);
    
    try {
        const response = await fetch(`https://pollinations.ai/prompts/text?prompt=${encodedPrompt}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.text();
        
        // Clean up the response
        let cleanResponse = data.trim();
        
        // If the response is too short or seems incomplete, provide a fallback
        if (cleanResponse.length < 5 || cleanResponse.toLowerCase().includes('i am an ai') || 
            cleanResponse.toLowerCase().includes('as an ai')) {
            return "I'm here to help you with Studyocean! You can ask me about study materials, practice work, revision work, or live classes. How can I assist you today?";
        }
        
        return cleanResponse;
    } catch (error) {
        console.error('Error fetching response:', error);
        return "I'm here to help you with Studyocean! You can ask me about study materials, practice work, revision work, or live classes. How can I assist you today?";
    }
}

// Handle user input
async function handleUserInput() {
    const message = userInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    addMessage(message, true);
    userInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Get bot response
        const botResponse = await getBotResponse(message);
        
        // Remove typing indicator and add bot response
        hideTypingIndicator();
        addMessage(botResponse);
    } catch (error) {
        console.error('Error:', error);
        hideTypingIndicator();
        addMessage("I'm sorry, I encountered an error. Please try again.");
    }
}

// Event Listeners
chatbotToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    // Only open the chat, don't toggle
    if (!chatbotContainer.classList.contains('active')) {
        toggleChat();
    }
});

closeChat.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleChat(true); // Force close
});

// Send message on button click
sendButton.addEventListener('click', handleUserInput);

// Send message on Enter key
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserInput();
    }
});

// Close chat when clicking outside
window.addEventListener('click', (e) => {
    const isClickInsideChat = chatbotContainer.contains(e.target);
    const isClickOnToggle = e.target === chatbotToggle || chatbotToggle.contains(e.target);
    
    // Only close if clicking outside both the chat container and the toggle button
    if (!isClickInsideChat && !isClickOnToggle) {
        toggleChat(true);
    }
});

// Load chat history
function loadChatHistory() {
    chatHistory.forEach(msg => {
        if (msg.role === 'user') {
            addMessage(msg.content, true);
        } else {
            addMessage(msg.content, false);
        }
    });
}

// Initialize
function init() {
    // Load chat history if any
    if (chatHistory.length > 0) {
        loadChatHistory();
    } else {
        // Add welcome message if it's a new chat
        addMessage("Hello! I'm your Studyocean assistant. How can I help you today? 😊");
    }
}

// Initialize the chat
init();
