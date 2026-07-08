import { Octokit } from '@octokit/rest'

function getClient() {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN belum di-set di environment variables.')
  }
  return new Octokit({ auth: process.env.GITHUB_TOKEN })
}

const owner = () => process.env.GITHUB_OWNER
const repo = () => process.env.GITHUB_REPO
const branch = () => process.env.GITHUB_BRANCH || 'main'

// Create or update a file in the repo. Vercel auto-deploys on push, so this
// is effectively "publish" for non-technical users filling the admin form.
export async function commitFile(filePath, content, message) {
  const octokit = getClient()
  let sha
  try {
    const existing = await octokit.repos.getContent({
      owner: owner(),
      repo: repo(),
      path: filePath,
      ref: branch(),
    })
    if (!Array.isArray(existing.data)) sha = existing.data.sha
  } catch (err) {
    if (err.status !== 404) throw err
  }

  const res = await octokit.repos.createOrUpdateFileContents({
    owner: owner(),
    repo: repo(),
    path: filePath,
    message,
    content: Buffer.from(content, 'utf-8').toString('base64'),
    branch: branch(),
    sha,
  })
  return res.data
}

export async function deleteFile(filePath, message) {
  const octokit = getClient()
  const existing = await octokit.repos.getContent({
    owner: owner(),
    repo: repo(),
    path: filePath,
    ref: branch(),
  })
  if (Array.isArray(existing.data)) throw new Error('Path is a directory')
  return octokit.repos.deleteFile({
    owner: owner(),
    repo: repo(),
    path: filePath,
    message,
    sha: existing.data.sha,
    branch: branch(),
  })
}

export async function commitBinaryFile(filePath, base64Content, message) {
  const octokit = getClient()
  const res = await octokit.repos.createOrUpdateFileContents({
    owner: owner(),
    repo: repo(),
    path: filePath,
    message,
    content: base64Content,
    branch: branch(),
  })
  return res.data
}
