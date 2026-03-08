---
name: deployment
description: Configure and publish your project. Use to set deployment settings and suggest publishing when the app is ready.
---

# Deployment Skill

Configure deployment settings and publish your project to make it live and accessible.

## When to Use

Use this skill when:

- Configuring how the project should run in production
- The project is in a working state and ready for publishing
- The user explicitly asks to publish or deploy the project
- You've completed implementing a feature and verified it works
- Setting up deployment for different project types (websites, bots, scheduled jobs)

## When NOT to Use

- Project has known errors or incomplete features
- You haven't validated that the project works
- The user is just testing or prototyping
- **You are a task agent running in a subrepl context and want to suggest publishing** — only the main repl can trigger a publish. However, `deployConfig()` is allowed because it only modifies `.replit` configuration. If you call `deployConfig()` from a task agent, remind the user that they will need to publish from the main version of the project after the current task is merged

## Available Functions

### deployConfig(deploymentTarget, run, build, publicDir)

Configure how the project should be deployed to production.

**Parameters:**

- `deploymentTarget` (str, required): "autoscale", "vm", "scheduled", or "static"
- `run` (list[str], optional): Production run command. First entry is binary/script, rest are arguments
- `build` (list[str], optional): Build/compile command before deployment
- `publicDir` (str, required for "static"): Directory containing static files

**Returns:** Dict with `success`, `message`, and configuration details

**Example:**

```javascript
// Configure a Python web app
const result = await deployConfig({
    deploymentTarget: "autoscale",
    run: ["gunicorn", "--bind=0.0.0.0:5000", "--reuse-port", "main:app"]
});

// Configure a static site
const result2 = await deployConfig({
    deploymentTarget: "static",
    build: ["npm", "run", "build"],
    publicDir: "dist"
});

// Configure an always-running bot
const result3 = await deployConfig({
    deploymentTarget: "vm",
    run: ["python", "bot.py"]
});
```

## Deployment Targets

Choose the appropriate deployment target based on your project type:

### autoscale (Recommended Default)

Use for stateless websites and APIs that don't need persistent server memory.

- **Best for:** Web applications, REST APIs, stateless services
- **Behavior:** Scales up/down based on traffic, only runs when requests arrive
- **State:** Use databases for persistent state (not server memory)
- **Cost:** Most cost-effective for variable traffic

```javascript
await deployConfig({
    deploymentTarget: "autoscale",
    run: ["gunicorn", "--bind=0.0.0.0:5000", "app:app"]
});
```

### vm (Always Running)

Use for applications that need persistent server-side state or long-running processes.

- **Best for:** Discord/Telegram bots, WebSocket servers, web scrapers, background workers
- **Behavior:** Always running, maintains state in server memory
- **State:** Can use in-memory databases, local files, or external databases

```javascript
await deployConfig({
    deploymentTarget: "vm",
    run: ["python", "bot.py"]
});
```

### scheduled

Use for cron-like jobs that run on a schedule.

- **Best for:** Data processing, cleanup tasks, periodic reports, batch jobs
- **Behavior:** Runs on configured schedule, not continuously
- **Note:** Do NOT use for websites or APIs

```javascript
await deployConfig({
    deploymentTarget: "scheduled",
    run: ["python", "daily_report.py"]
});
```

### static

Use for client-side websites with no backend server.

- **Best for:** Static HTML sites, SPAs (React, Vue, etc.), documentation sites
- **Behavior:** Serves static files directly, no server-side processing
- **Note:** The `run` command is ignored; must specify `publicDir`

```javascript
await deployConfig({
    deploymentTarget: "static",
    build: ["npm", "run", "build"],
    publicDir: "dist"
});
```

## Run Command Examples

Use production-ready servers, not development servers:

```toml
# Python with Gunicorn
run=["gunicorn", "--bind=0.0.0.0:5000", "--reuse-port", "main:app"]

# Python with Streamlit
run=["streamlit", "run", "main.py"]

# Node.js
run=["node", "server.js"]

# Multiple processes with bash
run=["bash", "-c", "gunicorn --reuse-port -w 4 -b 0.0.0.0:8000 app:app & npm run dev"]
```

## Build Command Examples

Only use build commands when compilation is needed:

```toml
# TypeScript/bundler
build=["npm", "run", "build"]

# Multiple build steps
build=["bash", "-c", "make assets && make compile"]

# Rust
build=["cargo", "build", "--release"]
```

## Best Practices

1. **Validate before publishing**: Always verify the project works before suggesting publish
2. **Use production servers**: Avoid insecure development servers in production
3. **Choose the right target**: Match deployment type to your application's needs
4. **Configure once**: Set up deployment config early, then suggest publishing when ready
5. **Check workflows first**: Ensure workflows are running without errors before publishing

## Important Notes

1. **User-initiated publishing**: The user must click the Publish button to actually deploy
2. **Automatic handling**: Publishing handles building, hosting, TLS, and health checks automatically
3. **Domain**: Published apps are available at a `.replit.app` domain or custom domain if configured

## Example Workflow

```javascript
// 1. Configure deployment settings for a web app
await deployConfig({
    deploymentTarget: "autoscale",
    run: ["gunicorn", "--bind=0.0.0.0:5000", "app:app"]
});

// 2. After verifying the app works, suggest publishing to the user
```
