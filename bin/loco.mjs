#!/usr/bin/env node
/**
 * npx loco-careers
 *
 * Installs LOCO into whichever agent clients are already on this machine.
 *
 * This script edits configuration files that belong to the person running it, so
 * it is deliberately readable, deliberately boring, and deliberately conservative:
 *
 *   - It only ever ADDS a server named "loco". Every other key in every file it
 *     touches is preserved, because those files hold other people's work.
 *   - It refuses to overwrite an existing "loco" entry that points somewhere else
 *     without --force, since that is more likely a name collision than an upgrade.
 *   - It writes atomically (temp file + rename), so an interrupted run cannot
 *     leave someone with a truncated config and a broken client.
 *   - It backs up any file it modifies to <file>.loco-backup once.
 *   - --dry-run prints every change and writes nothing.
 *
 * There is no telemetry and no network call. The skill ships inside this package.
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync, renameSync, readdirSync, statSync } from 'node:fs'
import { homedir, platform, tmpdir } from 'node:os'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const MCP_URL = 'https://mcp.loco.careers/mcp'
const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const HOME = process.env.LOCO_TEST_HOME || homedir()

const argv = process.argv.slice(2)
const has = (f) => argv.includes(f)
const DRY = has('--dry-run')
const FORCE = has('--force')
const YES = has('--yes') || has('-y') || !process.stdin.isTTY

// ---------------------------------------------------------------- output ---
const c = process.stdout.isTTY && !process.env.NO_COLOR
const dim = (s) => (c ? `\x1b[2m${s}\x1b[0m` : s)
const bold = (s) => (c ? `\x1b[1m${s}\x1b[0m` : s)
const green = (s) => (c ? `\x1b[32m${s}\x1b[0m` : s)
const yellow = (s) => (c ? `\x1b[33m${s}\x1b[0m` : s)
const say = (s = '') => console.log(s)

// ------------------------------------------------------------ json utils ---
function readJson(file) {
  if (!existsSync(file)) return null
  try {
    const raw = readFileSync(file, 'utf8').trim()
    return raw ? JSON.parse(raw) : {}
  } catch {
    return undefined // present but unparseable — caller must not clobber it
  }
}

/** Atomic write, with a one-time backup of whatever was there before. */
function writeJson(file, data) {
  if (DRY) return
  mkdirSync(dirname(file), { recursive: true })
  const backup = `${file}.loco-backup`
  if (existsSync(file) && !existsSync(backup)) copyFileSync(file, backup)
  const tmp = join(tmpdir(), `loco-${process.pid}-${Math.abs(hash(file))}.json`)
  writeFileSync(tmp, `${JSON.stringify(data, null, 2)}\n`)
  renameSync(tmp, file)
}

function hash(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return h
}

/**
 * Clients disagree on what the URL field is called — Cursor and Claude Desktop use
 * `url`, Windsurf uses `serverUrl`. Comparing only `url` made a second run report
 * every Windsurf install as a name conflict, which tells someone their config is
 * broken at the exact moment it is fine.
 */
const urlOf = (e) => e?.url ?? e?.serverUrl ?? e?.endpoint ?? null

/**
 * Merge the loco server into an mcpServers-shaped config.
 * Returns 'added' | 'present' | 'conflict' | 'unreadable'.
 */
function addServer(file, { key = 'mcpServers', entry } = {}) {
  const cfg = readJson(file)
  if (cfg === undefined) return 'unreadable'
  const next = cfg ?? {}
  const servers = next[key] ?? {}
  const existing = servers.loco

  if (existing) {
    if (urlOf(existing) === MCP_URL) return 'present'
    if (!FORCE) return 'conflict'
  }
  servers.loco = entry
  next[key] = servers
  writeJson(file, next)
  return 'added'
}

// ----------------------------------------------------------- skill files ---
function copyDir(from, to) {
  if (DRY) return
  mkdirSync(to, { recursive: true })
  for (const name of readdirSync(from)) {
    const src = join(from, name)
    const dst = join(to, name)
    if (statSync(src).isDirectory()) copyDir(src, dst)
    else copyFileSync(src, dst)
  }
}

function installSkill(dir) {
  const src = join(PKG_ROOT, 'skills', 'loco')
  if (!existsSync(src)) return 'missing'
  copyDir(src, join(dir, 'loco'))
  return 'installed'
}

// --------------------------------------------------------------- targets ---
const P = platform()
const appSupport =
  P === 'darwin'
    ? join(HOME, 'Library', 'Application Support')
    : P === 'win32'
      ? process.env.APPDATA || join(HOME, 'AppData', 'Roaming')
      : join(HOME, '.config')

/**
 * Each target reports whether it is present, then configures itself.
 *
 * Claude Code is driven through its own CLI rather than by editing ~/.claude.json
 * directly: that file also holds project state and history, and a third party
 * rewriting it is exactly how someone loses their sessions.
 */
const TARGETS = [
  {
    id: 'claude-code',
    label: 'Claude Code',
    detect: () => which('claude'),
    apply() {
      if (DRY) return { status: 'added', note: 'via claude mcp add' }
      const r = spawnSync('claude', ['mcp', 'add', '--transport', 'http', 'loco', MCP_URL], {
        encoding: 'utf8',
      })
      const out = `${r.stdout ?? ''}${r.stderr ?? ''}`
      if (r.status === 0) return { status: 'added', note: 'via claude mcp add' }
      if (/already exists/i.test(out)) return { status: 'present' }
      return { status: 'failed', note: out.trim().split('\n')[0] }
    },
    skillDir: join(HOME, '.claude', 'skills'),
  },
  {
    id: 'claude-desktop',
    label: 'Claude Desktop',
    detect: () => existsSync(join(appSupport, 'Claude')),
    apply() {
      const file = join(appSupport, 'Claude', 'claude_desktop_config.json')
      return { status: addServer(file, { entry: { type: 'http', url: MCP_URL } }), file }
    },
  },
  {
    id: 'cursor',
    label: 'Cursor',
    detect: () => existsSync(join(HOME, '.cursor')),
    apply() {
      const file = join(HOME, '.cursor', 'mcp.json')
      return { status: addServer(file, { entry: { url: MCP_URL } }), file }
    },
  },
  {
    id: 'windsurf',
    label: 'Windsurf',
    detect: () => existsSync(join(HOME, '.codeium', 'windsurf')),
    apply() {
      const file = join(HOME, '.codeium', 'windsurf', 'mcp_config.json')
      return { status: addServer(file, { entry: { serverUrl: MCP_URL } }), file }
    },
  },
  {
    id: 'vscode',
    label: 'VS Code',
    detect: () => which('code'),
    apply() {
      if (DRY) return { status: 'added', note: 'via code --add-mcp' }
      const r = spawnSync('code', ['--add-mcp', JSON.stringify({ name: 'loco', url: MCP_URL })], {
        encoding: 'utf8',
      })
      return r.status === 0
        ? { status: 'added', note: 'via code --add-mcp' }
        : { status: 'failed', note: (r.stderr || '').trim().split('\n')[0] }
    },
  },
]

function which(bin) {
  const cmd = P === 'win32' ? 'where' : 'which'
  return spawnSync(cmd, [bin], { encoding: 'utf8' }).status === 0
}

// ------------------------------------------------------------------ main ---
function main() {
  if (has('--help') || has('-h')) return usage()

  say()
  say(bold('  LOCO') + dim(' — the career layer your agent talks through'))
  say(dim(`  ${MCP_URL}`))
  if (DRY) say(yellow('  dry run — nothing will be written'))
  say()

  const found = TARGETS.filter((t) => {
    try {
      return t.detect()
    } catch {
      return false
    }
  })

  if (found.length === 0) {
    say('  No supported agent clients found on this machine.')
    say()
    say('  LOCO works with any MCP client. Point yours at:')
    say(`    ${bold(MCP_URL)}`)
    say()
    say(dim('  Instructions per client: https://github.com/LOCO-Careers/loco'))
    say()
    return
  }

  let anySkill = false
  const results = []

  for (const t of found) {
    const r = t.apply()
    let skill = null
    if (t.skillDir) {
      skill = installSkill(t.skillDir)
      if (skill === 'installed') anySkill = true
    }
    results.push({ label: t.label, ...r, skill })
  }

  for (const r of results) {
    const mark =
      r.status === 'added' ? green('✓') : r.status === 'present' ? green('✓') : yellow('!')
    const what =
      r.status === 'added'
        ? 'connected'
        : r.status === 'present'
          ? 'already connected'
          : r.status === 'conflict'
            ? 'a different server named "loco" exists — rerun with --force'
            : r.status === 'unreadable'
              ? 'config file is not valid JSON, left untouched'
              : `could not configure${r.note ? ` (${r.note})` : ''}`
    say(`  ${mark} ${bold(r.label.padEnd(16))} ${what}`)
    if (r.skill === 'installed') say(`    ${dim('POTS skill installed')}`)
  }

  say()
  say(bold('  Next:'))
  say('    1. Restart your client so it picks up the new server.')
  say('    2. Say to your agent: ' + bold('"Set up my LOCO."'))
  say('    3. Sign in when a browser window opens.')
  if (!anySkill) {
    say()
    say(dim('    No skill directory for these clients — LOCO still works, and the'))
    say(dim('    tool descriptions carry the rules, but the methodology is thinner.'))
  }
  say()
  say(dim('  Your record stays private. Nothing is public unless you publish it.'))
  say()
}

function usage() {
  say(`
  ${bold('npx loco-careers')} — install LOCO into the agents on this machine

  Options
    --dry-run   show what would change, write nothing
    --force     replace an existing server named "loco"
    --yes, -y   no prompts
    --help      this

  Connects ${MCP_URL} and installs the POTS skill where the client supports one.
  Only ever adds a server named "loco"; every other key is preserved, and any file
  it edits is backed up to <file>.loco-backup first.
`)
}

main()
