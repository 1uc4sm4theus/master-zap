---
name: web-search
description: Search the web and fetch content from URLs. Use for real-time information, API documentation, and current events.
---

# Web Search Skill

Search the web and retrieve content from URLs for current information.

## When to Use

Use this skill when:

- You need real-time information (news, prices, events)
- Looking up API documentation or SDK guides
- Accessing current technical information beyond training data
- Verifying facts from authoritative sources

## When NOT to Use

- Replit-specific features (use the replit-docs skill)
- Image/media downloads (use media-generation skill)
- Code search within the project (use grep/glob tools)

## Available Functions

### webSearch(query)

Search the web for current information.

**Parameters:**

- `query` (str, required): Natural language search query phrased as a complete question

**Returns:** Dict with `searchAnswer` and `resultPages` (list of title/url dicts)

**Example:**

```javascript
const results = await webSearch({ query: "OpenAI API rate limits 2026" });
console.log(results.searchAnswer);
for (const page of results.resultPages) {
    console.log(`${page.title}: ${page.url}`);
}
```

### webFetch(url)

Fetch and extract content from a URL as markdown.

**Parameters:**

- `url` (str, required): Full HTTPS URL to fetch

**Returns:** Dict with `markdown` key containing page content

**Example:**

```javascript
const content = await webFetch({ url: "https://platform.openai.com/docs/guides/rate-limits" });
console.log(content.markdown.slice(0, 1000));
```

## Best Practices

1. **Use natural language queries**: Write queries as complete questions with context
2. **Chain search and fetch**: Search first, then fetch specific pages for details
3. **Be specific**: Include dates, versions, or other specifics in queries
4. **Verify with fetch**: Don't rely only on search snippets for critical information

## Example Workflow

```javascript
// Find information about a topic
const searchResults = await webSearch({ query: "FastAPI dependency injection tutorial 2026" });

// Get full content from the most relevant result
if (searchResults.resultPages.length > 0) {
    const bestUrl = searchResults.resultPages[0].url;
    const fullContent = await webFetch({ url: bestUrl });
    console.log(fullContent.markdown);
}
```

## Limitations

- Cannot access social media platforms (LinkedIn, Twitter, Instagram, Facebook, Reddit, YouTube)
- Cannot download media files (images, videos, audio)
- Paywalled or authenticated content may be inaccessible

## Copyright

- Respect copyright for media content from websites
- You can reference or link to public content
- Do not copy media files (images, videos, audio) directly from websites
- Use the media-generation skill for images and videos instead
