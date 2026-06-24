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

## Verification Plan

### Automated Verification

- Run standard TypeScript type checking (`npx tsc --noEmit`) to verify all components compile correctly.
- Run Metro bundle verification if possible.

### Manual Verification

- Deploy the Expo application and review layout transitions.
- Check the visual styling of custom inputs, buttons, cards, and grayscale palette alignment.
- Verify authentication guard: typing in `/` redirects to `/login`, and signing in correctly takes the user to `/`.
