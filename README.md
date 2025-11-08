# Studyocean Chatbot Widget

A friendly and intelligent chatbot widget for Studyocean, designed to help users access study materials, practice work, revision work, and live classes.

## Features

- 🎓 Interactive chatbot interface
- 💬 Real-time responses using Pollinations.ai API
- 📱 Responsive design for all devices
- 🔒 Local storage for chat history
- 🎨 Modern UI with smooth animations
- 🔌 Easy to integrate with any website

## Getting Started

### Prerequisites

- A web server to host the widget files
- Basic knowledge of HTML/JavaScript

### Installation

1. **Host the files**: Upload the following files to your web server:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `widget.js`

2. **Update the widget URL**: In `widget.js`, update the `widgetUrl` variable to point to your hosted files:
   ```javascript
   const config = {
       widgetUrl: 'https://your-netlify-site.netlify.app', // Update this with your actual URL
       widgetId: 'studyocean-chatbot',
       version: '1.0.0'
   };
   ```

3. **Embed the widget**: Add the following script tag to your website's HTML, just before the closing `</body>` tag:
   ```html
   <script src="https://your-domain.com/path/to/widget.js" data-bot-id="studyocean"></script>
   ```

## Customization

### Styling

You can customize the appearance of the chatbot by modifying the CSS variables in `styles.css`:

```css
:root {
    --primary-gradient: linear-gradient(135deg, #22d3ee 0%, #6366f1 100%);
    --primary-color: #22d3ee;
    --secondary-color: #6366f1;
    --bg-color: #ffffff;
    --text-color: #1f2937;
    --bot-bg: #f3f4f6;
    --user-bg: #e0f2fe;
    --shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    --border-radius: 12px;
}
```

### Behavior

You can control the chatbot's behavior using the following JavaScript methods:

```javascript
// Show the chat widget
window.StudyoceanChatbot.show();

// Hide the chat widget
window.StudyoceanChatbot.hide();

// Send a message programmatically
window.StudyoceanChatbot.sendMessage('Hello, Studyocean!');
```

## Deployment

### Netlify (Recommended)

1. Push your code to a GitHub/GitLab repository
2. Log in to [Netlify](https://www.netlify.com/)
3. Click "New site from Git"
4. Select your repository and branch
5. Set the build command to empty (leave it blank)
6. Set the publish directory to the root directory
7. Click "Deploy site"

### Vercel

1. Push your code to a GitHub/GitLab repository
2. Log in to [Vercel](https://vercel.com/)
3. Click "Import Project"
4. Select your repository
5. Configure the project with default settings
6. Click "Deploy"

## Local Development

1. Clone the repository
2. Open `index.html` in a web browser
3. Start making changes to the code

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please contact the developer team at support@studyocean.com
