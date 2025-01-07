/**
 * Sends a prompt to the OpenAI API and returns the generated code.
 *
 * @param {string} prompt - The user's prompt.
 * @param {string} apiKey - The OpenAI API key.
 * @returns {Promise<string>} - The AI-generated code or text.
 */
export const requestAIForCode = async (prompt, apiKey) => {
    const endpoint = 'https://api.openai.com/v1/chat/completions';

    const initialPrompt = `
    You are a helpful coding assistant.
    You need to generate two files:
    1. src/App.js - A React component with the requested functionality. Use TailwindCSS for styling. Not use other CSS and not import any other CSS files.
    2. package.json - With all required dependencies for the App.js code

    The package.json should be based on this template:
    {
      "name": "task-list-app",
      "version": "1.0.0",
      "description": "Task List Application",
      "private": true,
      "scripts": {
        "build": "webpack --mode production",
        "dev": "webpack serve --mode development",
        "start": "webpack serve --mode development --open"
      },
      "dependencies": {
        "react": "18.2.0",
        "react-dom": "18.2.0",
        "tailwindcss": "3.3.2"
      },
      "devDependencies": {
        "@babel/core": "7.23.3",
        "@babel/preset-env": "7.23.3",
        "@babel/preset-react": "7.23.3",
        "autoprefixer": "10.4.16",
        "babel-loader": "9.1.3",
        "css-loader": "6.8.1",
        "html-webpack-plugin": "5.5.3",
        "postcss": "8.4.31",
        "postcss-loader": "7.3.3",
        "style-loader": "3.3.3",
        "webpack": "5.89.0",
        "webpack-cli": "5.1.4",
        "webpack-dev-server": "4.15.1"
      }
    }

    Add any additional dependencies needed for the App.js code.
    Return the response in JSON format with the following structure. Return only the code, no other text:
    {
      "appCode": "js code here",
      "packageJson": "json code here"
    }
    `;

    const messages = [
        { role: 'system', content: initialPrompt },
        { role: 'user', content: prompt }
    ];

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                response_format: { type: 'json_object' },
                messages
            })
        });

        const data = await response.json();
        if (!data.choices || !data.choices.length) {
            throw new Error('No AI response received.');
        }

        const aiText = data.choices[0].message.content || '';

        console.log(JSON.parse(aiText));

        const aiJson = JSON.parse(aiText);
        
        // Parse the response to separate App.js and package.json
        const appMatch = aiJson?.appCode;
        const packageMatch = aiJson?.packageJson;

        return {
           appCode: appMatch,
           packageJson: packageMatch
        };
    } catch (error) {
        console.error('OpenAI error:', error);
        throw error;
    }
}; 