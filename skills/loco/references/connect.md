# Connecting LOCO

If the LOCO tools are not available in this conversation, the person needs to
connect the server. Give them the block for the client they are actually using —
and until it is connected, do not pretend to save anything.

**Claude Code**
```
claude mcp add --transport http loco https://mcp.loco.careers/mcp
```
Then `/mcp` in a session to sign in.

**Claude (claude.ai or desktop)**
Settings → Connectors → Add custom connector → paste `https://mcp.loco.careers/mcp`
→ Connect. Works on every plan including Free.

**Cursor** — Settings → MCP → Add → Streamable HTTP → `https://mcp.loco.careers/mcp`

**VS Code**
```
code --add-mcp '{"name":"loco","url":"https://mcp.loco.careers/mcp"}'
```

**ChatGPT** — needs developer mode (Plus/Pro/Business, web) → Settings →
Connectors → Advanced → Developer mode → Add → `https://mcp.loco.careers/mcp`

Signing in happens in their browser, against `loco.careers`. The consent screen asks
only for identity, profile and email — LOCO reads no other data from their account.
