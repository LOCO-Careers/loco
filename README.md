# LOCO

**The career layer your agent talks through.**

LOCO is a career record your existing AI agent can read and write. No new app, no
new tab. Your agent proposes; you decide what's accurate; you choose what, if
anything, becomes visible to anyone else.

This repository is both the **POTS methodology** as an installable agent skill and
a **Claude Code plugin** bundling that skill with the server. The server lives at
`https://mcp.loco.careers/mcp`.

---

## Install

```bash
npx loco-careers
```

Finds the agent clients on your machine — Claude Code, Claude Desktop, Cursor,
Windsurf, VS Code — connects the server and installs the skill. Restart your
client, then say **"Set up my LOCO."**

It only ever adds a server named `loco`, backs up any file it edits, and refuses
to overwrite a different server that already has that name. `--dry-run` shows you
every change first. The whole thing is one readable file: [`bin/loco.mjs`](bin/loco.mjs).

### Claude Code — as a plugin instead

```bash
claude plugin marketplace add LOCO-Careers/loco
```

```bash
claude plugin install loco@loco
```

Same result, through Claude Code's own packaging.

### By hand

The plugin format is Claude Code's. Everywhere else, connect the server and add
the skill separately.

**1. Connect the server:**

```bash
code --add-mcp '{"name":"loco","url":"https://mcp.loco.careers/mcp"}'
```

For Claude (claude.ai or desktop): **Settings → Connectors → Add custom
connector** → `https://mcp.loco.careers/mcp`. Works on every plan including Free.
Cursor: **Settings → MCP → Add → Streamable HTTP**. ChatGPT requires developer
mode.

**2. Add the skill:**

```bash
npx skills add LOCO-Careers/loco
```

Or copy `skills/loco/` into your client's skills directory. If your client has no
skill mechanism at all, LOCO still works — the tool descriptions carry the rules,
though the methodology is thinner without the skill.

### Then say to your agent

> Set up my LOCO.

Then, whenever you finish something:

> Log this to LOCO.

---

## POTS

**Phase → Objectives → Tasks → SEDOs.**

- **Phase** — where you are: Education, Early Career, Mid Career, Leadership,
  Executive, Legacy. Every phase has the same meta-objective: *become a credible
  candidate for the next one.*
- **Objectives** — one to three outcomes that would make that true. Outcomes, not
  activities.
- **Tasks** — actions with an end state.
- **SEDOs** — Skills & Experience Development Opportunities: the tangible proof. A
  project, case study, presentation, deliverable, publication, launch.

Credibility is **Competence** (can do the work), **Character** (trusted in how you
do it), **Chemistry** (people want you around). Most people capture only the first.

Full detail in [`skills/loco/references/pots.md`](skills/loco/references/pots.md).

---

## What the skill enforces

The rules exist because an agent writing on your behalf is only useful if it can
be trusted not to embellish.

- **Propose, don't assert.** Everything lands as a proposal you confirm. An agent
  never says "logged" for something you haven't seen.
- **Never quantify what you didn't quantify.** "A lot faster" stays "a lot faster",
  never "40% faster".
- **"We" gets a follow-up.** LOCO records individual contribution.
- **Work, evidence and capability stay separate.** "I built X" is work. "Here's the
  PR" is evidence. "This shows I can do Y" is a claim — a deliberate, separate step.
- **Publication is not the agent's to perform.** There is no publish tool. Only you,
  in the web app, can make anything visible.
- **Zero evidence is not zero value.** Direction with nothing logged yet is a
  *complete* record, not an empty one.

---

## What LOCO can and cannot do

**Can:** read and write your career record; propose phases, objectives, work and
evidence; draft a redacted public headline for confidential work.

**Cannot:** publish anything, change visibility, or edit what the world sees. Your
agent has no tool for any of it.

Your evidence — the detailed answers behind each piece of work — is never public.
There is no setting for it; the column does not exist.

---

## Why this is open

LOCO's premise is a *shared* language between the people building talent, the people
supporting them, and the people hiring them. A shared language nobody can read isn't
shared. POTS is open so any agent, any client, and anyone assessing a LOCO profile
can reason about the same structure.

---

Apache-2.0. Built by [Ese Kpeji](https://github.com/Altra0) · [loco.careers](https://loco.careers)
