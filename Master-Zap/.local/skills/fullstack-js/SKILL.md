---
name: fullstack-js
description: Guidelines for implementing hover/elevation interactions, layout constraints, sidebar setup, and visual styling.
---

Always follow these guidelines when building a full-stack JavaScript application:

## Architecture

- Follow modern web application patterns and best-practices.
- Put as much of the app in the frontend as possible. The backend should only be responsible for data persistence and making API calls.
- Minimize the number of files. Collapse similar components into a single file.
- If the app is complex and requires functionality that can't be done in a single request, it is okay to stub out the backend and implement the frontend first.

## Types

- Always think through and generate the data model first in `shared/schema.ts` to ensure consistency between frontend and backend. Do this before writing any other code.
- Keep the data model as simple as possible (e.g. don't add createdAt and updatedAt fields unless it is strictly necessary).
- For each model, additionally write:
  - The insert schema using `createInsertSchema` from `drizzle-zod`. Use `.omit` to exclude any auto-generated fields.
  - The insert type using `z.infer<typeof insertSchema>`
  - The select type using `typeof table.$inferSelect`.
- Common pitfalls to avoid:
  - When writing array columns in the Drizzle schema, always call `.array()` as a method on the column type, not as a wrapper function. That is, do `text().array()` instead of `array(text())`.

## Storage

- Make sure to update `IStorage` in `server/storage.ts` to accommodate any storage CRUD operations you need in the application.
- Ensure that storage interface uses the types from `@shared/schema.ts`.

## Backend

- After writing the storage interface, write the API routes in the `server/routes.ts` file.
- Always use the storage interface to do any CRUD operations. Keep the routes as thin as possible.
- Validate the request body using Zod schemas from `drizzle-zod` before passing it to the storage interface.

## Frontend

- Use `wouter` for routing on the frontend.
  - If you need to add a new page, add them to the `client/src/pages` directory and register them in `client/src/App.tsx`.
  - If there are multiple pages, use a sidebar for navigation. Use the `Link` component or the `useLocation` hook from `wouter` instead of modifying the window directly.
- For forms, always use shadcn's `useForm` hook and `Form` component from `@/components/ui/form` which wraps `react-hook-form`.
  - When appropriate, use the `zodResolver` from `@hookform/resolvers/zod` to validate the form data using the appropriate insert schema from `@shared/schema.ts`.
  - Use `.extend` to add validation rules to the insert schema.
  - Remember that the form component is controlled, ensure you pass default values to the `useForm` hook.
- Always use `@tanstack/react-query` when fetching data.
  - When appropriate, ensure you strongly type the query using the appropriate select type from `@shared/schema.ts`.
  - Queries should not define their own queryFn as the default fetcher is already set up to work with the backend.
  - Mutations should use apiRequest from `@lib/queryClient` to make POST/PATCH/DELETE requests to the backend.
    - Always make sure to invalidate the cache by queryKey after a mutation is made. Don't forget to import `queryClient` from `@lib/queryClient`!
    - For hierarchical or variable query keys use an array for cache segments so cache invalidation works properly. That is, do queryKey: ['/api/recipes', id] instead of queryKey: [`/api/recipes/${id}`].
  - Show a loading or skeleton state while queries (via `.isLoading`) or mutations (via `.isPending`) are being made
  - The template uses TanStack Query v5 which only allows the object form for query related functions. e.g. `useQuery({ queryKey: ['key'] })` instead of `useQuery(['key'])`
- Common pitfalls to avoid:
  - The `useToast` hook is exported from `@/hooks/use-toast`.
  - If a form is failing to submit, try logging out `form.formState.errors` to see if there are form validation errors for fields that might not have associated form fields.
  - DO NOT explicitly import React as the existing Vite setup has a JSX transformer that does it automatically.
  - Use `import.meta.env.<ENV_VAR>` to access environment variables on the frontend instead of `process.env.<ENV_VAR>`. Note that variables must be prefixed with `VITE_` in order for the env vars to be available on the frontend.
  - <SelectItem> will throw an error if it has no value prop. Provide a value prop like this <SelectItem value="option1">
- Add a `data-testid` attribute to every HTML element that users can interact with (buttons, inputs, links, etc.) and to elements displaying meaningful information (user data, status messages, dynamic content, key values).
  - Use unique, descriptive identifiers following this pattern:
    - Interactive elements: `{action}-{target}` (e.g., `button-submit`, `input-email`, `link-profile`)
    - Display elements: `{type}-{content}` (e.g., `text-username`, `img-avatar`, `status-payment`)
  - For dynamically generated elements (lists, grids, repeated components), append a unique identifier at the end: `{type}-{description}-{id}`
    - Examples: `card-product-${productId}`, `row-user-${index}`, `text-price-${itemId}`
    - The dynamic identifier can be any unique value (database ID, index, key) as long as it's unique within that group
  - Keep test IDs stable and descriptive of the element's purpose rather than its appearance or implementation details.

## Styling and Theming

- When defining custom properties in `index.css` that will be used by a tailwind config, always use H S% L% (space separated with percentages after Saturation and Lightness) (and do not wrap in hsl()).
  - For example:
     --my-var: 23 10% 23%;
- Analyze the comments inside of `index.css` to determine how to set colors - replacing every `red` placeholder with an appropriate color. Do NOT forget to replace every single instance of `red`. Pay attention to what you see in index.css.
- Use the `@`-prefixed paths to import shadcn components and hooks.
- Use icons from `lucide-react` to signify actions and provide visual cues. Use `react-icons/si` for company logos.
- User may attach assets (images, etc.) in their request.
  - If the user asks you to include attached assets in the app, you can reference them in the frontend with the `@assets/...` import syntax.
  - For example, if the user attached asset is at `attached_assets/example.png`, you can reference it in the frontend with `import examplePngPath from "@assets/example.png"`.

## Dark Mode

1. Set `darkMode: ["class"]` in tailwind.config.ts and define color variables in :root and .dark CSS classes
2. Create ThemeProvider with useState("light"), useEffect to toggle "dark" class on document.documentElement, and localStorage sync
3. When not using utility class names configured in `tailwind.config.ts`, always use explicit light/dark variants for ALL visual properties: `className="bg-white dark:bg-black text-black dark:text-white"`. When using utility classes configured in tailwind config, you can assume these already been configured to automatically adapt to dark mode.

## SEO

- Ensure every page has a unique, descriptive title tag (e.g., "Product Name - Category | Site Name")
- Add meta descriptions that summarize page content concisely
- Implement Open Graph tags for better social media sharing appearance

## Running the Project

- The workflow named 'Start application' is already setup and runs `npm run dev` which starts an Express server for the backend and a Vite server for the frontend.
- After making edits, the workflow will automatically be restarted for you.

## Forbidden Changes

- NEVER edit `package.json`:
  - If you find yourself stuck and need to modify the scripts, ask the user before doing so.
  - If you need to install packages, use the packager_install_tool.

## Config File Guidance

- Do NOT modify the Vite setup (`server/vite.ts` and `vite.config.ts`) unless absolutely necessary. It is already configured to serve the frontend and backend on the same port and handles all the necessary setup for you. Don't add a proxy to the Vite server. All the aliases are already set up for you to import.
- Do NOT modify `drizzle.config.ts` unless absolutely necessary. It is pre-configured correctly.

## References

Before writing code, identify whether any reference below applies to the task. If it does, read it first.

- `references/hover_and_elevation.md` - Use this reference when adding or changing hover/active/toggle interaction behavior, elevation effects, or overflow-sensitive interactive styling.
- `references/shadcn_component_rules.md` - Use this reference when building or modifying UI with Shadcn components (especially Button, Card, Badge, Avatar, and Textarea).
- `references/layout_and_spacing.md` - Use this reference when structuring page layouts, sections, spacing rhythm, and component alignment.
- `references/sidebar_rules.md` - Use this reference when building or modifying a sidebar.
- `references/visual_style_and_contrast.md` - Use this reference when choosing contrast, borders, shadows, pane/panel treatment, and hero image presentation.
