---
name: code_review
description: Spawn a code review (architect) subagent for deep analysis, planning, and debugging. The architect specializes in strategic guidance rather than implementation. Architect should be called after building major features. Relies on `delegation` skill.
---

# Architect Skill

Spawn an code review (a.k.a architect) subagent for analysis and planning. The architect specializes in analysis and strategic guidance rather than implementation.

## When to Use

Use this skill when:

- You need deep architectural analysis or code understanding
- You want strategic recommendations about system design or patterns
- You need comprehensive analysis of code quality or technical debt
- You want root cause analysis and debugging assistance

## When NOT to Use

- Simple tasks that you can complete directly
- Tasks that require file edits or implementation (use delegation skill instead)
- Read-only operations (use grep/glob/read tools instead)

## Available Functions

### architect(task, relevantFiles, ...)

Spawn an architect subagent for analysis and planning.

**Parameters:**

- `task` (str, required): The analytical task or question for the architect
- `relevantFiles` (list[str], required): Full file paths to analyze
- `responsibility` (str, default "evaluate_task"): Focus area: "debug", "plan", or "evaluate_task"
- `includeGitDiff` (bool, default False): Include current unstaged git diff
- `relevantGitCommits` (str, optional): Git commit range to analyze (e.g., "HEAD~3..HEAD")

**Returns:** Dict with analysis results

```json
{
    "success": true,
    "message": "Analysis summary",
    "subagentAlias": "architect_1",
    "result": "Full analysis output..."
}
```

**Responsibilities:**

- **evaluate_task**: Assess completed or ongoing work against goals
- **plan**: Create implementation plans with task decomposition and sequencing
- **debug**: Root cause analysis, reproduction steps, and recommended fixes

**Example:**

```javascript
// Plan a new feature
const result = await architect({
    task: "Create a plan for implementing rate limiting on API endpoints.",
    relevantFiles: ["src/middleware/index.ts", "src/routes/api.ts"],
    responsibility: "plan"
});
console.log(result.result);

// Debug an issue
const result2 = await architect({
    task: "The UserAuthService.validateSession() returns false for valid tokens.",
    relevantFiles: ["src/services/UserAuthService.ts", "src/utils/jwt.ts"],
    responsibility: "debug",
    includeGitDiff: true
});
```

## Best Practices

1. **Be specific in your task description**: Include concrete function names, error messages, or design goals
2. **Provide relevant files**: The architect can only analyze files you pass in `relevantFiles`
3. **Choose the right responsibility**: Use "plan" for new work, "debug" for issues, "evaluate_task" for reviewing progress
4. **Use `includeGitDiff`**: When debugging regressions, include the diff to help the architect identify recent changes
5. **Use `relevantGitCommits`**: When you need the architect to understand recent history (e.g., "HEAD~3..HEAD")
