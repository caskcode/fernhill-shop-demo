# Fernhill shop: a demo repository for Living Context

This is a demo repository for Living Context, a Jira app that gives coding agents the decisions, gotchas and workarounds a team has recorded on its Jira work items, and lets agents record new ones. It is not a real shop. Fernhill is a fictional outdoor-gear shop, and the code here is a small stand-in for its checkout and its payment provider's webhooks (`services/payments/webhooks/`). It doesn't build or run on its own; it is here so a coding agent has real files to read and change.

## Before you start

- Living Context must be installed on your Jira site. Each person connects their own coding agent and signs in with their own Atlassian account.
- Clone this repository and start your agent in the clone. Living Context ties Entries to code paths in a repository, and the agent names the repository from `git remote get-url origin`, so the clone's `origin` must be `caskcode/fernhill-shop-demo`. A fork names a different repository.

## Claude Code

Install the plugin from the CaskCode marketplace:

```sh
claude plugin marketplace add caskcode/claude-plugins
claude plugin install living-context@caskcode
```

Then sign in: in Claude Code, run `/mcp`, choose `plugin:living-context:living-context`, and complete the Atlassian sign-in in the browser. The token lasts 8 hours and refreshes itself; run `/mcp` again if Claude Code reports Living Context needs authentication.

Connect Living Context only through the plugin. Don't add the server yourself with `claude mcp add`: that makes a second, separate server, which the plugin's hooks and skill never use.

Claude Code asks the first time each tool is used. `get_context` and `search_context` only read, so you can allow them permanently. Leave `record_context` on ask, so you see every Entry before it is recorded and can turn it down.

## Cursor

Cursor connects through [mcp-remote](https://github.com/geelen/mcp-remote), a small open-source bridge; needs Node 18+. Tested once with Cursor 3.29.15; no hooks; not covered by automated tests. Install Node 18 or later before you start, so `npx` is on the path Cursor sees.

1. Open the "Add to Cursor" link and click **Install**:

    [Add to Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=living-context&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIm1jcC1yZW1vdGVAMC4xNi41IiwiaHR0cHM6Ly9tY3AuYXRsYXNzaWFuLmNvbS9mb3JnZS9lN2FmYWFhNC01NTJiLTQ1NTgtOTk5OS0yOTQyZTM3MDUxZWMiXX0%3D)

    If the link does nothing (GitHub drops `cursor://` links), paste it into your browser's address bar:

    ```text
    cursor://anysphere.cursor-deeplink/mcp/install?name=living-context&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIm1jcC1yZW1vdGVAMC4xNi41IiwiaHR0cHM6Ly9tY3AuYXRsYXNzaWFuLmNvbS9mb3JnZS9lN2FmYWFhNC01NTJiLTQ1NTgtOTk5OS0yOTQyZTM3MDUxZWMiXX0%3D
    ```

2. Complete the Atlassian sign-in that opens in the browser. To sign in again, restart the `living-context` server in Cursor Settings, MCP (switch it off and on).

The Living Context rule is already committed in this repository, at `.cursor/rules/living-context.mdc`, and is always applied, so there is nothing else to add.
