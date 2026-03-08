# Hover and Active Interactions

If elements transform (scale, etc.) on hover or press down (active state), the transform should be **extremely subtle**—just enough to notice. Don't overdo it.

For `<Button>` and `<Badge>` (Shadcn components), hover and active states are already preconfigured automatically regardless of variant. You do **not** need to supply additional classes.

## Elevation Utility Classes

Two special Tailwind utility classes are defined in `index.css`:

| Class              | Purpose                                                                       |
|--------------------|-------------------------------------------------------------------------------|
| `hover-elevate`    | Applies subtle elevation on hover that respects the current theme             |
| `active-elevate-2` | Applies more dramatic elevation on press-down that respects the current theme |

**Important constraints:**

- These utility classes will **not** work with `overflow-hidden` or `overflow-scroll` and **must not** be used with them.
- They compose well with any background color (or even no background).

```tsx
// Good
<AnyComponentThatHasOverflowVisible className="hover-elevate" />

// Bad - has overflow-hidden
<AnyComponentThatHasOverflowHidden className="hover-elevate" />

// Bad - forcing overflow-hidden with elevate utility
<AnyComponent className="overflow-hidden hover-elevate" />
```

## Built-in Component Behavior

`<Button>` and `<Badge>` already apply `hover-elevate` and `active-elevate-2`. Therefore:

- **Never** apply hover/active states that change their background/foreground colors.
- If you see `hover:bg-*` on a button or interactable control, that is a **red flag**.

```tsx
// Bad - don't need hover states on sidebar buttons
<SidebarMenuButton className="data-[active=true]:bg-sidebar-accent hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">

// Good - styling 'currently selected' without hover interactions
<MyCustomButton className="data-[active=true]:bg-sidebar-accent hover-elevate active-elevate-2">

// Bad - Button already has hover/active elevations
<Button className="hover-elevate">

// Good - disabling default elevations when needed
<Badge className="no-default-active-elevate" />
```

## Toggle Elements

Turn any element into a toggle using the elevate system:

```tsx
// Add toggle-elevate class, then add toggle-elevated when "on"
<Button type="icon" variant="ghost" className="toggle-elevate toggle-elevated" />
```
