/**
 * Commits multiple files to a GitHub repository in a single commit.
 *
 * @param {Object} params - Parameters needed for the commit.
 * @param {string} params.token - GitHub personal access token.
 * @param {string} params.owner - GitHub username or org.
 * @param {string} params.repo - Repository name.
 * @param {Array<{path: string, content: string}>} params.files - Array of files to commit.
 * @param {string} params.commitMessage - The commit message.
 */
export const commitToGitHub = async ({
    token,
    owner,
    repo,
    files,
    commitMessage
}) => {
    // First, get the latest commit SHA and tree SHA
    const baseUrl = `https://api.github.com/repos/${owner}/${repo}`;
    
    const refResponse = await fetch(`${baseUrl}/git/refs/heads/main`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!refResponse.ok) {
        throw new Error(`Failed to get ref: ${refResponse.statusText}`);
    }

    const refData = await refResponse.json();
    const latestCommitSha = refData.object.sha;

    // Get the tree of the latest commit
    const treeResponse = await fetch(`${baseUrl}/git/commits/${latestCommitSha}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!treeResponse.ok) {
        throw new Error(`Failed to get tree: ${treeResponse.statusText}`);
    }

    const treeData = await treeResponse.json();
    const baseTreeSha = treeData.tree.sha;

    // Create blobs for each file
    const blobPromises = files.map(async file => {
        const blobResponse = await fetch(`${baseUrl}/git/blobs`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: file.content,
                encoding: 'utf-8'
            })
        });

        if (!blobResponse.ok) {
            throw new Error(`Failed to create blob: ${blobResponse.statusText}`);
        }

        const blobData = await blobResponse.json();
        return {
            path: file.path,
            mode: '100644',
            type: 'blob',
            sha: blobData.sha
        };
    });

    const blobs = await Promise.all(blobPromises);

    // Create a new tree
    const treeResponse2 = await fetch(`${baseUrl}/git/trees`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            base_tree: baseTreeSha,
            tree: blobs
        })
    });

    if (!treeResponse2.ok) {
        throw new Error(`Failed to create tree: ${treeResponse2.statusText}`);
    }

    const newTreeData = await treeResponse2.json();

    // Create a new commit
    const commitResponse = await fetch(`${baseUrl}/git/commits`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: commitMessage,
            tree: newTreeData.sha,
            parents: [latestCommitSha]
        })
    });

    if (!commitResponse.ok) {
        throw new Error(`Failed to create commit: ${commitResponse.statusText}`);
    }

    const newCommitData = await commitResponse.json();

    // Update the reference
    const updateRefResponse = await fetch(`${baseUrl}/git/refs/heads/main`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sha: newCommitData.sha,
            force: false
        })
    });

    if (!updateRefResponse.ok) {
        throw new Error(`Failed to update ref: ${updateRefResponse.statusText}`);
    }
}; 