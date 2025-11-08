// Widget Loader for Studyocean Chatbot
(function() {
    // Configuration
    const config = {
        widgetUrl: 'https://your-netlify-site.netlify.app', // Update this with your Netlify URL
        widgetId: 'studyocean-chatbot',
        version: '1.0.0'
    };

    // Create widget container
    function createWidget() {
        // Check if widget already exists
        if (document.getElementById(config.widgetId)) {
            console.log('Studyocean Chatbot widget is already loaded');
            return;
        }

        // Create iframe
        const iframe = document.createElement('iframe');
        iframe.id = config.widgetId;
        iframe.src = `${config.widgetUrl}/index.html`;
        iframe.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 350px;
            height: 500px;
            border: none;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            display: none;
            transition: all 0.3s ease;
        `;

        // Create toggle button
        const toggleButton = document.createElement('button');
        toggleButton.id = `${config.widgetId}-toggle`;
        toggleButton.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            border: none;
            border-radius: 50%;
            background: linear-gradient(135deg, #22d3ee 0%, #6366f1 100%);
            color: white;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            transition: all 0.3s ease;
        `;
        
        // Add icon to toggle button
        const icon = document.createElement('i');
        icon.className = 'fas fa-comment-dots';
        toggleButton.appendChild(icon);

        // Toggle chat visibility
        let isOpen = false;
        function toggleChat() {
            isOpen = !isOpen;
            if (isOpen) {
                iframe.style.display = 'block';
                toggleButton.style.transform = 'scale(0.8)';
                toggleButton.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                // Focus the iframe when opened
                setTimeout(() => {
                    iframe.focus();
                }, 100);
            } else {
                iframe.style.display = 'none';
                toggleButton.style.transform = 'scale(1)';
                toggleButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }
        }

        // Add event listeners
        toggleButton.addEventListener('click', toggleChat);

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (isOpen && 
                !iframe.contains(e.target) && 
                e.target !== toggleButton && 
                !toggleButton.contains(e.target)) {
                toggleChat();
            }
        });

        // Add elements to the page
        document.body.appendChild(iframe);
        document.body.appendChild(toggleButton);

        // Add Font Awesome if not already loaded
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const fontAwesome = document.createElement('link');
            fontAwesome.rel = 'stylesheet';
            fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
            document.head.appendChild(fontAwesome);
        }

        console.log('Studyocean Chatbot widget loaded successfully');
    }

    // Initialize widget when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createWidget);
    } else {
        createWidget();
    }

    // Expose public API
    window.StudyoceanChatbot = {
        version: config.version,
        show: function() {
            const iframe = document.getElementById(config.widgetId);
            const toggleButton = document.getElementById(`${config.widgetId}-toggle`);
            if (iframe && toggleButton) {
                iframe.style.display = 'block';
                toggleButton.style.transform = 'scale(0.8)';
                toggleButton.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                iframe.focus();
            }
        },
        hide: function() {
            const iframe = document.getElementById(config.widgetId);
            const toggleButton = document.getElementById(`${config.widgetId}-toggle`);
            if (iframe && toggleButton) {
                iframe.style.display = 'none';
                toggleButton.style.transform = 'scale(1)';
                toggleButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }
        },
        sendMessage: function(message) {
            const iframe = document.getElementById(config.widgetId);
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({
                    type: 'studyocean_chatbot_message',
                    message: message
                }, '*');
            }
        }
    };
})();
