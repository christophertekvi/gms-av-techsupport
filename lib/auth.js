import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { cookies } from 'next/headers'

export const SESSION_COOKIE_NAME = 'av_admin_session'
export const SESSION_MAX_AGE = 60 * 60 * 5 // 5 jam

const USERS_FILE = path.join(process.cwd(), 'data', 'admin-users.json')

function getAuthSecret() {
  return (
    process.env.AUTH_SECRET ||
    process.env.ADMIN_PASSWORD ||
    'av-docs-admin-session-secret'
  )
}

function sha256Buffer(value) {
  return crypto.createHash('sha256').update(String(value)).digest()
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const derived = crypto.scryptSync(String(password), salt, 64).toString('hex')
  return `${salt}:${derived}`
}

function verifyPassword(password, user) {
  if (typeof password !== 'string' || !password) return false

  if (typeof user.passwordHash === 'string' && user.passwordHash.includes(':')) {
    const [salt, expectedHex] = user.passwordHash.split(':')
    if (!salt || !expectedHex) return false
    const derived = crypto.scryptSync(password, salt, 64)
    const expected = Buffer.from(expectedHex, 'hex')
    if (derived.length !== expected.length) return false
    return crypto.timingSafeEqual(derived, expected)
  }

  if (typeof user.password === 'string' && user.password.length > 0) {
    return crypto.timingSafeEqual(sha256Buffer(password), sha256Buffer(user.password))
  }

  return false
}

export function loadAdminUsers() {
  if (process.env.ADMIN_USERS_JSON) {
    try {
      const parsed = JSON.parse(process.env.ADMIN_USERS_JSON)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  if (!fs.existsSync(USERS_FILE)) {
    return []
  }

  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function verifyUserCredentials(username, password) {
  if (typeof username !== 'string' || !username.trim()) return null
  if (typeof password !== 'string' || !password) return null

  const normalizedUsername = username.trim().toLowerCase()
  const users = loadAdminUsers()

  for (const user of users) {
    if (typeof user?.username !== 'string') continue
    if (user.username.trim().toLowerCase() !== normalizedUsername) continue
    if (user.disabled) return null
    if (verifyPassword(password, user)) {
      return {
        username: user.username.trim(),
        name: user.name || user.username.trim(),
        role: user.role || 'admin',
      }
    }
  }

  return null
}

export function createSessionToken(user) {
  const payload = {
    username: user.username,
    name: user.name || user.username,
    role: user.role || 'admin',
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  }
  const encodedPayload = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  const signature = crypto
    .createHmac('sha256', getAuthSecret())
    .update(encodedPayload)
    .digest('base64url')
  return `${encodedPayload}.${signature}`
}

export function verifySessionToken(token) {
  if (typeof token !== 'string' || !token.includes('.')) return null

  const [encodedPayload, signature] = token.split('.')
  if (!encodedPayload || !signature) return null

  const expectedSig = crypto
    .createHmac('sha256', getAuthSecret())
    .update(encodedPayload)
    .digest('base64url')

  const sigBuf = Buffer.from(signature, 'utf8')
  const expectedBuf = Buffer.from(expectedSig, 'utf8')
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'))
    if (!payload?.username || !payload?.exp || Date.now() > payload.exp) {
      return null
    }
    return {
      username: payload.username,
      name: payload.name || payload.username,
      role: payload.role || 'admin',
    }
  } catch {
    return null
  }
}

export async function getSessionUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  return verifySessionToken(token)
}

export async function isAuthed() {
  const user = await getSessionUser()
  return !!user
}
