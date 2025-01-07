# Micro Apps

A React-based web application that automates the creation and deployment of micro applications using AI code generation and GitHub integration. Try it live at [soivigol.github.io/micro-apps](https://soivigol.github.io/micro-apps)!

## 🌟 Live Demo

Visit [soivigol.github.io/micro-apps](https://soivigol.github.io/micro-apps) to use the application directly in your browser.

## 💡 What is Micro Apps?

Micro Apps is an all-in-one tool that streamlines the process of creating and deploying small React applications. It combines AI code generation, code editing, and GitHub deployment into a single, seamless workflow.

### Key Features:
- AI-powered code generation
- Built-in Monaco code editor (same as VS Code)
- Direct GitHub integration
- Automated deployment to GitHub Pages
- Real-time code editing and validation

## 🚀 How to Use

### 1. Create a Template Repository
Before using Micro Apps, you need to set up a template repository:

1. Visit [template-npm-deployment-react](https://github.com/soivigol/template-npm-deployment-react)
2. Click "Use this template" > "Create a new repository"
3. Name your repository and create it
   - This template includes all necessary configurations for React development and GitHub Pages deployment
4. Activate a GitHub Pages from the github actions.

### 2. Configure Settings
After setting up your template, click the ⚙️ Settings button in Micro Apps and configure:
- **OpenAI API Key**: Get it from [OpenAI Dashboard](https://platform.openai.com/api-keys)
- **GitHub Token**: Generate from [GitHub Settings](https://github.com/settings/tokens)
  - Requires 'repo' scope permissions
- **GitHub Owner**: Your GitHub username
This data is stored in the browser's local storage, so it's secure and won't be shared with anyone else.

### 3. Create a New Micro App
1. **Enter Repository Name**
   - Type the name of your repository created from the template
   - Make sure it matches exactly with your GitHub repository name

2. **Write Your Prompt**
   - Describe the React application you want to create
   - Be specific about functionality, components, and styling
   - Example: "Create a React todo list app with local storage and dark mode"

3. **Generate Code**
   - Click "Generate Code" to create your application
   - The AI will generate both the application code and required package.json

4. **Review and Edit**
   - The generated code appears in the Monaco editor
   - Make any necessary adjustments
   - Syntax highlighting and error checking included

5. **Deploy to GitHub**
   - Click "Commit to GitHub" to deploy
   - Your code will be pushed to your template-based repository
   - GitHub Actions will automatically build and deploy to GitHub Pages

### 4. Access Your App
- Once deployed, your app will be available at:
  `https://[your-github-username].github.io/[repository-name]`

## 🛠️ Development

If you want to run Micro Apps locally:

1. Clone the repository:
```bash
git clone https://github.com/soivigol/micro-apps.git
cd micro-apps
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open `http://localhost:3000` in your browser

## 🛠 Project Structure

```
micro-apps/
├── src/
│   ├── index.js        # Application entry point
│   ├── App.js          # Main App component
│   ├── styles.css      # Global styles
│   └── services/       # API services
│       ├── github.js   # GitHub integration
│       └── openai.js   # OpenAI integration
├── public/             # Static assets
└── webpack.config.js   # Webpack configuration
```

## 🔧 Configuration

### For Development

1. Clone and install as described above
2. Make your changes
3. Test locally using `npm run dev`
4. Build using `npm run build`

### For Deployment

If you want to deploy your own version:

1. Fork the repository
2. Update `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/micro-apps"
}
```
3. Deploy using:
```bash
npm run deploy
```

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Monaco Editor team for the powerful editor component
- OpenAI for the AI capabilities
- All contributors and users of this project

## 🤔 Need Help?

- Check out the [Issues](https://github.com/soivigol/micro-apps/issues) section
- Create a new issue if you find a bug or have a feature request
- Contact the maintainer through GitHub

---

Made with ❤️ by [soivigol](https://github.com/soivigol)
