# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Implementation Plan

I have successfully implemented the full application with the following:

- **Authentication Flow**: Complete email/password sign-in, sign-up, and sign-out flows using Supabase Auth with email confirmation.
- **Dashboard**: Central hub with user greeting, navigation links, stats cards, and recent activity feed.
- **Task Lists Management**: CRUD operations for lists and tasks, including filtering (Active, Completed, All) and sorting.
- **Settings**: Profile management, email updates, password change, theme toggle, and logout.
- **Data Persistence**: All data (tasks, lists, user info) is stored in Supabase Database.
- **UI/UX**: Grayscale aesthetic with glassmorphism effects, smooth transitions, and responsive layout.
- **Notifications**: Local push notifications for new tasks (using Expo Notifications API).
- **Security**: Row Level Security (RLS) policies in Supabase to ensure data privacy.


## Walkthrough

### 1. Authentication Flow
- **Login**: Users can sign in with email and password.
- **Sign Up**: New users can register with their email and password.
- **Sign Out**: Users can sign out of their account.
- **Email Confirmation**: Users will receive an email to confirm their email address.

### 2. Dashboard
- **Greeting**: Displays a welcome message with the user's name.
- **Navigation Links**: Links to the lists and profile sections.
- **Stats Cards**: Shows active lists, tasks done, and growth.
- **Recent Activity**: A feed of recent activities.

### 3. Task Lists Management
- **Create List**: Users can create new task lists.
- **Create Task**: Users can add tasks to a list.
- **Edit Task**: Users can edit the title of a task.
- **Toggle Task**: Users can mark tasks as completed or incomplete.
- **Delete Task**: Users can delete tasks.
- **Filter**: Users can filter tasks by Active, Completed, or All.
- **Sort**: Users can sort tasks by date created.

### 4. Settings
- **Profile**: Users can update their name.
- **Email**: Users can update their email address.
- **Password**: Users can change their password.
- **Theme**: Users can toggle between dark and light mode.
- **Logout**: Users can sign out of their account.

### 5. Data Persistence
- **Supabase Database**: All data is stored in Supabase Database.
- **Supabase Auth**: All authentication is handled by Supabase Auth.

### 6. Notifications
- **Local Push Notifications**: Users will receive notifications for new tasks.

### 7. Security
- **Row Level Security (RLS)**: All data is protected by RLS policies.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
