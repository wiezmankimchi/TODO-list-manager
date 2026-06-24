# Expo App with Expo-Router & Shadcn-Style Grayscale Theme

A premium, modern React Native Expo application built with `expo-router` featuring a mock authentication flow, modern grayscale styling, and a clean Shadcn-inspired custom component library.

## User Review Required

> [!IMPORTANT]
> The app will use custom, highly flexible UI components styled with React Native's `StyleSheet` instead of `nativewind`/Tailwind CSS. This approach ensures maximum stability across Expo versions, avoids Babel/Metro configuration issues, and perfectly mimics Shadcn UI's look-and-feel (zinc palette, border treatments, custom buttons/inputs).

## Proposed Changes

We will generate a new Expo app in the current directory and reorganize/create files as detailed below.

### Setup and Configuration

#### [NEW] [package.json](file:///Users/wiezmankimchi/Documents/antigravity/GreenZincGrayhound/package.json)

We will initialize the workspace by running `create-expo-app` with the default template.

### Theme & Styled Components

#### [NEW] [theme.ts](file:///Users/wiezmankimchi/Documents/antigravity/GreenZincGrayhound/constants/theme.ts)

A design system file containing the Zinc color palette for both light and dark modes:

- Primary/background/border/foreground/muted palettes using clean zinc tones.
- Dark/Light mode color scheme hook integration.

#### [NEW] [Button.tsx](file:///Users/wiezmankimchi/Documents/antigravity/GreenZincGrayhound/components/ui/Button.tsx)

Shadcn-style button component supporting:

- Variants: `default` (zinc-900), `secondary` (zinc-100), `outline` (border zinc-200), `ghost`, `destructive` (red-600).
- Sizes: `default`, `sm`, `lg`.
- Custom interactive press states with smooth scale animations.

#### [NEW] [Input.tsx](file:///Users/wiezmankimchi/Documents/antigravity/GreenZincGrayhound/components/ui/Input.tsx)

Shadcn-style input component with:

- Rounded corners, thin zinc-200 border, and placeholder coloring.
- Focus state representation (zinc-900 border / ring representation).
- Error and label support.

#### [NEW] [Card.tsx](file:///Users/wiezmankimchi/Documents/antigravity/GreenZincGrayhound/components/ui/Card.tsx)

Shadcn-style card containers:

- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
- Rendered with thin borders, clean borders, and a beautiful background.

---

### Routing & Screens

#### [NEW] [auth.tsx](file:///Users/wiezmankimchi/Documents/antigravity/GreenZincGrayhound/context/auth.tsx)

A simple React Context Provider to handle mock authentication state (login/logout) and redirect users using `expo-router`'s router.

#### [MODIFY] [\_layout.tsx](file:///Users/wiezmankimchi/Documents/antigravity/GreenZincGrayhound/app/_layout.tsx)

Root layout that loads custom fonts/icons, establishes the `AuthProvider`, and handles root theme configuration.

#### [NEW] [login.tsx](file:///Users/wiezmankimchi/Documents/antigravity/GreenZincGrayhound/app/login.tsx)

Login screen styled with modern gray shades containing:

- App logo/icon design.
- Email and Password fields.
- Submit button that sets the auth token and redirects.

#### [NEW] [(app)/\_layout.tsx](<file:///Users/wiezmankimchi/Documents/antigravity/GreenZincGrayhound/app/(app)/_layout.tsx>)

Protected layout utilizing `expo-router` stack or tabs, checking the auth context. If unauthorized, automatically redirects to `/login`.

#### [NEW] [(app)/index.tsx](<file:///Users/wiezmankimchi/Documents/antigravity/GreenZincGrayhound/app/(app)/index.tsx>)

Main dashboard screen with links/buttons to Profile/Settings and Lists, beautiful dashboard summary cards, and quick actions.

#### [NEW] [(app)/profile.tsx](<file:///Users/wiezmankimchi/Documents/antigravity/GreenZincGrayhound/app/(app)/profile.tsx>)

Profile and settings screen styled in modern grays with mock user details, switch options, and a logout button.

#### [NEW] [(app)/lists.tsx](<file:///Users/wiezmankimchi/Documents/antigravity/GreenZincGrayhound/app/(app)/lists.tsx>)

A beautiful list view demonstrating scrolling list items, pull-to-refresh, filters, and custom badge elements.

---

### Data Persistence

#### [NEW] [use-profile-storage.ts](src/hooks/use-profile-storage.ts)

A custom hook using `@react-native-async-storage/async-storage` to persist profile data (display name, email, notifications preference) across app sessions. Loads saved data on mount, exposes `saveProfile` and `clearProfile` methods.

#### [MODIFY] [auth.tsx](src/context/auth.tsx)

Updated to persist the auth session in AsyncStorage so users stay logged in across app restarts:

- Session saved on `signIn`, removed on `signOut`.
- Added `isLoading` state to prevent navigation flicker while restoring the stored session.

#### [MODIFY] [profile.tsx](src/app/(main)/profile.tsx)

Updated to use the `useProfileStorage` hook:

- Text fields (display name, email) use local editing state and persist only when "Save Details" is pressed.
- Notifications toggle persists immediately on change.
- Sign out clears stored profile data alongside the auth session.

---

### Shared Task Data Layer & Dashboard Live Stats

#### [NEW] [task.ts](src/types/task.ts)

Shared `Task` interface with `createdAt` timestamp field for tracking when tasks are added.

#### [NEW] [task-stats.ts](src/utils/task-stats.ts)

Pure utility functions for dashboard statistics:

- `getActiveTasks(tasks)` — count of incomplete tasks.
- `getCompletedTasks(tasks)` — count of completed tasks.
- `getWeekOverWeekGrowth(tasks)` — formatted percentage string showing week-over-week change in tasks added (Monday-based weeks).

#### [NEW] [tasks.tsx](src/context/tasks.tsx)

`TaskProvider` React Context with `useTasks()` hook:

- Shared task state consumed by both dashboard and lists screens.
- Persists tasks to AsyncStorage (`@tasks_data`).
- API: `addTask`, `toggleTask`, `deleteTask`, `tasks`, `isLoaded`.
- Default 5 mock tasks with dynamic `createdAt` timestamps spread across last 2 weeks.

#### [MODIFY] [_layout.tsx](src/app/_layout.tsx)

Wrapped app with `<TaskProvider>` inside `<AuthProvider>`.

#### [MODIFY] [index.tsx](src/app/(main)/index.tsx)

Dashboard now shows live data instead of hardcoded mock stats:

- Greeting uses display name from profile storage instead of raw session email.
- "Active Tasks" card shows count of incomplete tasks from context.
- "Tasks Done" card shows count of completed tasks from context.
- "Growth" card shows week-over-week growth percentage in tasks added.

#### [MODIFY] [lists.tsx](src/app/(main)/lists.tsx)

Migrated from local `useState` to shared `useTasks()` context:

- Removed local `Task` interface — imports from `@/types/task`.
- Task operations (`addTask`, `toggleTask`, `deleteTask`) now use context methods.
- Tasks are persisted across sessions via AsyncStorage.
- All existing UI behavior (filters, add, delete, toggle) preserved.

---

### Test Infrastructure

#### [NEW] Jest test setup

- Installed `jest`, `jest-expo`, `@testing-library/react-native`, `@types/jest`.
- Configured `jest-expo` preset with CSS mock and `@/` path alias resolution.
- Added `npm test` script.

#### Test Suites (34 tests total)

- `src/utils/__tests__/task-stats.test.ts` — unit tests for active/completed counts and growth % edge cases.
- `src/context/__tests__/tasks.test.tsx` — TaskProvider add/toggle/delete behavior and AsyncStorage persistence.
- `src/context/__tests__/auth.test.tsx` — auth signIn/signOut and session restoration.
- `src/hooks/__tests__/use-profile-storage.test.tsx` — profile load/save/clear and email-to-name fallback.
- `src/app/(main)/__tests__/index.test.tsx` — dashboard integration: greeting, stat cards, nav links.

---

## Verification Plan

### Automated Verification

- `npx tsc --noEmit` — TypeScript type checking.
- `npx expo export --platform web` — verify build succeeds.
- `npm test` — run all 34 tests (5 suites).

### Manual Verification

- Deploy the Expo application and review layout transitions.
- Check the visual styling of custom inputs, buttons, cards, and grayscale palette alignment.
- Verify authentication guard: typing in `/` redirects to `/login`, and signing in correctly takes the user to `/`.
- Dashboard greeting shows display name, not email.
- Add/complete/delete tasks in lists, verify dashboard stat cards update.
- Restart app and verify tasks and profile persist.
