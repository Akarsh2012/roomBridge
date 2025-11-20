## Front-End Component Structure

Whenever you add a new UI component in `client/app/components`, follow the folder-first convention so markup, styles, and tests stay co-located:

```
ComponentNameComponent/
  ComponentName.tsx         // JSX + logic
  ComponentName.module.css  // scoped styles
  ComponentName.test.tsx    // node:test specs
```

Guidelines:

- No Tailwind utility strings in JSX—style everything through the component’s CSS module.
- Import sibling components with relative paths (e.g., `import ConnectSection from "../ConnectSection";`).
- Only export the component from `ComponentName.tsx`, then import it wherever it’s used (e.g., `app/page.tsx`).
- Smoke tests use Node’s built-in runner (`node --test`), so keep specs colocated as `*.test.tsx`.

Use this pattern for every new surface (Signup, Profile, etc.) so the team has a consistent, discoverable structure.
