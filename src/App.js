import React from 'react';
import Editor from "@monaco-editor/react";
import { requestAIForCode } from './services/openai';
import { commitToGitHub } from './services/github';

/**
 * App - Main React arrow function component.
 * Manages prompt input, code generation, and GitHub commits.
 */
const GITHUB_TOKEN_HELP = `To get your GitHub token:
1. Go to GitHub.com → Settings → Developer Settings
2. Click "Personal access tokens" → "Tokens (classic)"
3. Generate new token with "repo" scope
4. Copy token immediately after generation`;

const App = () => {
    // Persistent storage (localStorage)
    const [openAIApiKey, setOpenAIApiKey] = React.useState(
        localStorage.getItem('openai_key') || ''
    );
    const [githubToken, setGithubToken] = React.useState(
        localStorage.getItem('github_token') || ''
    );
    const [githubOwner, setGithubOwner] = React.useState(
        localStorage.getItem('github_owner') || ''
    );

    // Temporary storage (session)
    const [repoName, setRepoName] = React.useState('');
    const [prompt, setPrompt] = React.useState('');
    const [generatedCode, setGeneratedCode] = React.useState('');
    const [packageJson, setPackageJson] = React.useState('');
    
    // UI state
    const [showSettings, setShowSettings] = React.useState(
        !openAIApiKey || !githubToken || !githubOwner
    );

    // Add loading states
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [isCommitting, setIsCommitting] = React.useState(false);
    const [statusMessage, setStatusMessage] = React.useState('');

    const handleSaveSettings = () => {
        localStorage.setItem('openai_key', openAIApiKey);
        localStorage.setItem('github_token', githubToken);
        localStorage.setItem('github_owner', githubOwner);
        setShowSettings(false);
    };

    const handleGenerateCode = async () => {
        if (!openAIApiKey) {
            alert('Please configure your OpenAI API key in settings.');
            setShowSettings(true);
            return;
        }
        if (!prompt.trim()) {
            alert('Please enter a prompt.');
            return;
        }

        setIsGenerating(true);
        setStatusMessage('Generating code...');

        try {
            const response = await requestAIForCode(prompt, openAIApiKey);
            setGeneratedCode(response.appCode);
            setPackageJson(response.packageJson);
            setStatusMessage('Code generated successfully!');
        } catch (error) {
            console.error('Error fetching AI code:', error);
            setStatusMessage('Failed to generate code. Check console for details.');
        } finally {
            setIsGenerating(false);
            // Clear success message after 3 seconds
            setTimeout(() => {
                setStatusMessage('');
            }, 3000);
        }
    };

    const handleCommitCode = async () => {
        if (!githubToken || !githubOwner) {
            alert('Please configure your GitHub settings.');
            setShowSettings(true);
            return;
        }
        if (!repoName) {
            alert('Please enter repository name.');
            return;
        }
        if (!generatedCode.trim()) {
            alert('No generated code to commit.');
            return;
        }

        setIsCommitting(true);
        setStatusMessage('Committing files to GitHub...');

        try {
            const files = [
                {
                    path: 'src/App.js',
                    content: generatedCode
                }
            ];

            if (packageJson) {
                files.push({
                    path: 'package.json',
                    content: packageJson
                });
            }

            await commitToGitHub({
                token: githubToken,
                owner: githubOwner,
                repo: repoName,
                files,
                commitMessage: 'Update App.js and package.json with AI-generated code'
            });

            setStatusMessage('Code committed successfully!');
        } catch (error) {
            console.error('Error committing to GitHub:', error);
            setStatusMessage('Failed to commit code. Check console for details.');
        } finally {
            setIsCommitting(false);
            // Clear success message after 3 seconds
            setTimeout(() => {
                setStatusMessage('');
            }, 3000);
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Micro Apps AI Generator</h1>
                <button 
                    className="settings-button"
                    onClick={() => setShowSettings(!showSettings)}
                >
                    ⚙️ Settings
                </button>
            </div>

            {showSettings && (
                <div className="settings-modal">
                    <div className="settings-content">
                        <h2>Settings</h2>
                        <div className="settings-form">
                            <label>
                                OpenAI API Key:
                                <input
                                    type="password"
                                    value={openAIApiKey}
                                    onChange={(e) => setOpenAIApiKey(e.target.value)}
                                />
                                <span className="help-text">
                                    Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI Dashboard</a>
                                </span>
                            </label>
                            <label>
                                GitHub Token:
                                <input
                                    type="password"
                                    value={githubToken}
                                    onChange={(e) => setGithubToken(e.target.value)}
                                />
                                <span className="help-text">
                                    <details>
                                        <summary>How to get GitHub token?</summary>
                                        <pre>{GITHUB_TOKEN_HELP}</pre>
                                        <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">
                                            Go to GitHub Tokens Page
                                        </a>
                                    </details>
                                </span>
                            </label>
                            <label>
                                GitHub Owner:
                                <input
                                    type="text"
                                    value={githubOwner}
                                    onChange={(e) => setGithubOwner(e.target.value)}
                                />
                            </label>
                            <div className="settings-buttons">
                                <button onClick={handleSaveSettings}>Save Settings</button>
                                <button 
                                    className="cancel-button"
                                    onClick={() => setShowSettings(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="section">
                <h2>GitHub Repository Details</h2>
                <div className="repo-details">
                    <input
                        type="text"
                        placeholder="Repository Name"
                        value={repoName}
                        onChange={(e) => setRepoName(e.target.value)}
                    />
                </div>
            </div>

            <div className="section">
                <h2>Prompt</h2>
                <textarea
                    rows="10"
                    placeholder="Enter your AI prompt..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isGenerating}
                />
                <button 
                    onClick={handleGenerateCode} 
                    disabled={isGenerating}
                    className={isGenerating ? 'loading' : ''}
                >
                    {isGenerating ? 'Generating...' : 'Generate Code'}
                </button>
            </div>

            <div className="section">
                <h2>Generated Code</h2>
                <div className="editor-container">
                    <Editor
                        height="400px"
                        defaultLanguage="javascript"
                        theme="vs-dark"
                        value={generatedCode}
                        onChange={setGeneratedCode}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            wordWrap: 'on',
                            automaticLayout: true,
                            formatOnPaste: true,
                            formatOnType: true,
                            readOnly: isCommitting
                        }}
                    />
                </div>
                {packageJson && (
                    <div className="editor-container">
                        <h3>package.json</h3>
                        <Editor
                            height="200px"
                            defaultLanguage="json"
                            theme="vs-dark"
                            value={packageJson}
                            onChange={setPackageJson}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                wordWrap: 'on',
                                automaticLayout: true,
                                formatOnPaste: true,
                                formatOnType: true,
                                readOnly: isCommitting
                            }}
                        />
                    </div>
                )}
                <button 
                    onClick={handleCommitCode} 
                    disabled={isCommitting}
                    className={isCommitting ? 'loading' : ''}
                >
                    {isCommitting ? 'Committing...' : 'Commit to GitHub'}
                </button>
            </div>

            {statusMessage && (
                <div className={`status-message ${statusMessage.includes('Failed') ? 'error' : 'success'}`}>
                    {statusMessage}
                </div>
            )}
        </div>
    );
};

export default App;