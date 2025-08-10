# Zendesk Customer Intelligence Sidebar App

A comprehensive Zendesk sidebar application built with ZAF v2 and React that provides intelligent customer insights and automated reply generation.

## 🚀 Features

### Core Functionality
- **Ticket Data Integration**: Automatically fetches ticket requester email, subject, and description using ZAF v2
- **Customer Profile Lookup**: Retrieves customer information from JSONPlaceholder API
- **Recent Activity**: Shows the customer's last 3 posts/activities
- **Smart Reply Generation**: Creates contextual reply drafts with customizable tone

### UI Features
- **Copy to Clipboard**: One-click copy functionality for reply drafts
- **Tone Selection**: Switch between Friendly and Concise reply styles
- **Refresh Controls**: Reload individual sections or entire app data
- **Error Handling**: Graceful error states with retry mechanisms
- **Loading States**: Skeleton loaders for better user experience

### Advanced Features
- **CSP Compliant**: Follows Zendesk security requirements
- **Responsive Design**: Works across different screen sizes
- **TypeScript**: Full type safety and better development experience
- **Error Boundaries**: Prevents app crashes with graceful error handling

## 🛠️ Installation & Development

### Prerequisites
- Node.js 16+ and npm
- Zendesk CLI Tools (ZAT)
- Zendesk instance for testing

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Zendesk Development**
   ```bash
   # Install ZAT if not already installed
   gem install zendesk_apps_tools
   
   # Validate app
   npm run validate
   
   # Run local Zendesk server
   npm run serve
   
   # Package for upload
   npm run package
   ```

## 📁 Project Structure

```
├── manifest.json              # Zendesk app configuration
├── assets/
│   ├── iframe.html           # App iframe entry point
│   └── main.css             # Global styles
├── src/
│   ├── components/          # React components
│   │   ├── CustomerProfile.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   ├── RecentPosts.tsx
│   │   ├── ReplyDraft.tsx
│   │   └── TicketSummary.tsx
│   ├── hooks/
│   │   └── useZendeskData.ts # Custom hook for data management
│   ├── services/            # Business logic
│   │   ├── apiService.ts    # External API integration
│   │   ├── replyService.ts  # Reply generation logic
│   │   └── zafService.ts    # Zendesk ZAF integration
│   ├── types/
│   │   └── zendesk.ts       # TypeScript type definitions
│   ├── App.tsx              # Main application component
│   └── main.tsx             # React entry point
├── vite.config.ts           # Vite configuration
└── package.json
```

## 🔧 Configuration

### Environment Setup
The app automatically configures itself for Zendesk environment. Key configurations:

- **ZAF Framework**: v2.0 for modern Zendesk integration
- **API Timeout**: 5 seconds (configurable via app parameters)
- **Domain Whitelist**: JSONPlaceholder API allowed
- **CSP Compliance**: All external resources properly configured

### Customization Options
- **Reply Templates**: Edit `src/services/replyService.ts` to customize reply formats
- **API Endpoints**: Modify `src/services/apiService.ts` for different data sources
- **Styling**: Update Tailwind classes or add custom CSS
- **Timeouts**: Adjust API timeout in manifest.json parameters

## 🧪 Testing

### Test Emails (JSONPlaceholder)
Use these emails for testing customer lookup:
- `Sincere@april.biz`
- `Shanna@melissa.tv`
- `Nathan@yesenia.net`
- `Julianne.OConner@kory.org`
- `Lucio_Hettinger@annie.ca`

### Local Development
1. **Install Zendesk CLI Tools (ZAT)**
   ```bash
   gem install zendesk_apps_tools
   ```

2. **Start Development Server**
   ```bash
   npm run serve
   ```
   This starts the ZAT server on `https://localhost:4567`

3. **Access in Zendesk**
   - Navigate to any ticket in your Zendesk instance
   - Add `?zat=true` to the URL
   - The sidebar should appear with the app

4. **Alternative: Direct Development**
   ```bash
   npm run dev
   ```
   - Access at `http://localhost:3000`
   - Will use simulated data for development

### Troubleshooting ZAF Issues

**"ZAF client not initialized" Error:**
1. Ensure you're accessing from within Zendesk (not standalone)
2. Check that ZAF SDK loads properly (check browser console)
3. Verify you have proper Zendesk permissions
4. Try adding `?zat=true` to the ticket URL

**Development Mode:**
- The app detects development mode automatically
- Uses simulated ticket data when ZAF is not available
- Check browser console for debug information

### Production Testing
1. Build the app: `npm run build`
2. Package: `npm run package`
3. Upload to Zendesk and test in real environment

## 🔐 Security & CSP Compliance

The app follows Zendesk Content Security Policy requirements:

- **No Inline Scripts**: All JavaScript is in separate files
- **Whitelisted Domains**: Only approved external domains
- **Secure API Calls**: Proper CORS and timeout handling
- **Data Sanitization**: All user input is properly escaped

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚀 Deployment

### To Zendesk Marketplace
1. Run `npm run build`
2. Run `npm run package`
3. Upload the generated ZIP file to Zendesk
4. Configure app parameters in Zendesk admin

### Private Installation
1. Build and package the app
2. Upload to your Zendesk instance
3. Install in desired locations (ticket sidebar)
4. Configure permissions and settings

## 🛠️ Troubleshooting

### Common Issues

**ZAF Not Loading**
- Ensure you're accessing from a valid Zendesk ticket
- Check browser console for errors
- Verify manifest.json configuration

**API Timeouts**
- Check network connectivity
- Increase timeout in manifest.json
- Verify domain whitelist includes external APIs

**Copy Function Not Working**
- Ensure HTTPS context (required for clipboard API)
- Check browser permissions
- Fallback method available for older browsers

### Debug Mode
Enable debug logging by opening browser dev tools and setting:
```javascript
localStorage.setItem('zaf_debug', 'true');
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in this repository
- Contact your Zendesk administrator
- Review Zendesk ZAF v2 documentation