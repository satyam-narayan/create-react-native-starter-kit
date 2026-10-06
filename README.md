# create-react-native-starter-kit

[![npm version](https://img.shields.io/npm/v/create-react-native-starter-kit.svg)](https://www.npmjs.com/package/create-react-native-starter-kit)
[![license](https://img.shields.io/npm/l/create-react-native-starter-kit.svg)](./LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-satyam--narayan-181717?logo=github)](https://github.com/satyam-narayan/create-react-native-starter-kit)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-FFDD00?logo=buymeacoffee&logoColor=black)](https://www.buymeacoffee.com/satyamnarayan)

Create a React Native CLI app that is ready for screen design on day one.

One command gives you a new React Native project with a ready folder structure, shared UI components, theming, i18n, navigation, an API layer with a built-in mock backend, offline handling, and all native (Android / iOS) setup already done.

```bash
npx create-react-native-starter-kit MyApp
```

---

## Table of contents

- [Requirements](#requirements)
- [Create a project](#create-a-project)
  - [First run walkthrough](#first-run-walkthrough)
- [What the CLI does](#what-the-cli-does)
- [Folder structure](#folder-structure)
- [Included libraries](#included-libraries)
- [Shared components](#shared-components)
- [Important patterns](#important-patterns)
  - [Screen data: OfflineQueryBoundary + shimmer](#1-screen-data-offlinequeryboundary--shimmer)
  - [Blocking actions: global loader](#2-blocking-actions-global-loader)
  - [API calls and the mock backend](#3-api-calls-and-the-mock-backend)
  - [Query and mutation hooks](#4-query-and-mutation-hooks)
  - [Toasts and errors](#5-toasts-and-errors)
  - [Theme, fonts and icons](#6-theme-fonts-and-icons)
  - [Translations](#7-translations)
  - [Forms](#8-forms)
- [Environment variables](#environment-variables)
- [Useful scripts](#useful-scripts)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

---

## Requirements

Your machine must be set up for React Native CLI development (see the [official environment setup](https://reactnative.dev/docs/set-up-your-environment)):

- Node.js 22.13 or newer (required by the latest React Native; check with `node -v`)
- Yarn (default) or npm
- Android Studio, Android SDK and JDK 17 for Android
- Xcode and CocoaPods for iOS (macOS only)
- Internet connection (the React Native template and all libraries are downloaded from npm)

> **Note:** If you previously installed a global `react-native-cli` or `@react-native-community/cli` package, remove it first, as recommended in the [React Native docs](https://reactnative.dev/docs/getting-started-without-a-framework). A global install can cause unexpected issues.
>
> ```bash
> npm uninstall -g react-native-cli @react-native-community/cli
> ```
>
> This CLI creates the base app with `npx @react-native-community/cli@latest init`, the same command the docs use, so you always start on the latest stable React Native.

## Create a project

```bash
# with npx (recommended)
npx create-react-native-starter-kit MyApp

# or install globally
npm install -g create-react-native-starter-kit
create-react-native-starter-kit MyApp
```

Run without a name to be asked for one.

| Option | Description |
| --- | --- |
| `--npm` | Use npm instead of yarn |
| `--yarn` | Use yarn (default) |
| `--skip-install` | Create files only, do not install packages or pods |
| `--skip-pods` | Skip `pod install` on macOS |
| `--dry-run` | Print the steps without writing anything |
| `-h`, `--help` | Show help |

The project name must start with a letter and contain only letters, numbers or underscores (`MyApp`, `my_app`).

Then run it:

```bash
cd MyApp
yarn android
yarn ios
```

### First run walkthrough

Everything in the generated app is a working **reference**. No backend or real account is needed, so you can click through all screens right away.

1. **Login** — type any email and password that pass the form validation, then tap Login. Nothing is sent to a server; a dummy token is saved and you are logged in.
   - Email: any valid format, e.g. `test@example.com`
   - Password: 8–16 characters with an uppercase letter, a lowercase letter, a number and a special character, e.g. `Test@1234`
2. **Profile Setup** — shown once after the first login. Fill every field with anything you like (name, phone, gender, date of birth, time, address) and tap Continue. The values are only logged to the console; the screen exists to show every `FormInput` variant in use.
3. **Bottom tabs**
   - **Home** — `OfflineQueryBoundary` + shimmer reference and the `AvatarPicker` with the camera / gallery sheet.
   - **Profile** — global loader reference (shows for 2 seconds on first open). "Go to Main Tab" opens a screen with **Logout**, which uses the `AlertModal` confirm dialog and returns you to Login.

The login state is persisted (Redux + MMKV), so after a restart you stay logged in until you log out.

Replace the dummy parts with your real logic when you are ready: `handleLogin` in `screens/auth/login`, `handleContinue` in `screens/app/profile-setup`, and the API functions in `services/api`.

## What the CLI does

1. Creates a bare app with `@react-native-community/cli init` (latest stable React Native).
2. Copies the starter `src/`, `patches/` and `.env.example` into it.
3. Installs the starter libraries (latest versions).
4. Writes `babel.config.js` (`@/` alias, env variables, worklets), `metro.config.js` (SVG as components), `tsconfig.json` paths, `react-native.config.js` (fonts), `declarations.d.ts` and `App.tsx`.
5. Applies the native setup:
   - Android: `MainActivity` (screens fragment factory), permissions in `AndroidManifest.xml`, `build.gradle`, Gradle network timeout.
   - iOS: permission texts and fonts in `Info.plist`, Podfile deployment target.
6. Links the fonts and generates the icon map.
7. Runs `pod install` on macOS.

## Folder structure

```text
src/
├── app/                    App.tsx, providers, navigation (root, auth stack, app stack, bottom tabs)
├── assets/
│   ├── fonts/              InterTight font family (linked automatically)
│   ├── icons/              SVG icons + generated index.ts (Icons map, IconName type)
│   └── images/             Static images (placeholder avatar, etc.)
├── components/shared/      Reusable UI (see "Shared components")
├── constants/              device sizes, API endpoints, query keys, limits, regex
├── context/                ThemeContext (light / dark), NetworkContext (online / offline)
├── hooks/                  useAppDispatch, useAppSelector, useDebounce, useImagePicker, useDocumentPicker
│   └── app/                API hooks: useGetProfile (query), useUpdateProfile (mutation)
├── i18n/                   i18next setup and locales (en, ru)
├── redux/                  slices (auth, user, settings, loader) and selectors
├── screens/                auth/, app/, tab/ — one folder per screen with index.tsx + styles.ts
├── services/
│   ├── api/                axios instance + interceptors, mock backend, feature APIs (auth, user)
│   ├── errors/             ErrorHandler and status / backend error maps
│   ├── network/            TanStack Query online manager
│   ├── query/              QueryClient
│   └── toast/              Success / Error / Info toasts and custom ToastCard
├── storage/ store/         MMKV storage, Redux store with redux-persist
├── theme/                  palette, light / dark colors, spacing, typography, fonts, layout helpers
├── types/                  API, navigation and env types
├── utils/                  normalize, date, image compress, pickers, initials, masking
└── validation/             yup rules, schemas and translated messages
```

Import anything from `src` with the `@/` alias:

```tsx
import CustomButton from '@/components/shared/CustomButton';
import { useAppTheme } from '@/context/ThemeContext';
```

## Included libraries

| Area | Library |
| --- | --- |
| Navigation | `@react-navigation/native`, `native-stack`, `bottom-tabs`, `react-native-screens`, `react-native-safe-area-context` |
| State | `@reduxjs/toolkit`, `react-redux`, `redux-persist`, `react-native-mmkv` |
| Server data | `@tanstack/react-query`, `axios`, `@react-native-community/netinfo` |
| Forms | `react-hook-form`, `yup`, `@hookform/resolvers` |
| UI | `@gorhom/bottom-sheet`, `react-native-reanimated`, `react-native-gesture-handler`, `react-native-svg`, `react-native-linear-gradient`, `react-native-reanimated-skeleton`, `react-native-toast-message`, `@d11/react-native-fast-image` |
| Inputs | `react-native-element-dropdown`, `@react-native-community/datetimepicker`, `rn-international-phone-number`, `react-native-walkthrough-tooltip` |
| Media | `react-native-image-picker`, `@react-native-documents/picker`, `@bam.tech/react-native-image-resizer` |
| Other | `i18next`, `react-i18next`, `moment`, `@mhpdev/react-native-haptics` |

## Shared components

All live in `src/components/shared/`.

| Component | Use it for |
| --- | --- |
| `text/CustomText` | Every text. Props: `variant` (`display`, `header`, `title`, `titleMd`, `titleSm`, `body`, `callout`, `label`, `subtitle`, `footnote`, `caption`, `micro`), `weight`, `textColor`, `textAlign` |
| `text/ShimmerText` | Text that shows a shimmer while `isLoading` |
| `CustomButton` | Buttons with variants, icons, `loading`, haptics and `requiresNetwork` (shows an offline toast instead of running) |
| `PressableIcon` | Tappable icon with haptic feedback, press animation and double-tap protection |
| `Icon` | Render any SVG from `assets/icons` by `name` |
| `AppImage` | Fast image with loader, placeholder, initials or icon fallback |
| `AvatarPicker` | Avatar with edit button that opens the camera / gallery sheet |
| `DocumentPicker` | Ref-based picker for files or camera |
| `form-input/FormInput` | react-hook-form field with variants: `text`, `dropdown`, `date`, `time`, `country-phone`, `toggle` |
| `form-input/FullNameInput` | First / last name pair |
| `bottom-sheet/BaseBottomSheet`, `BaseBottomSheetModal` | Themed bottom sheets controlled by a ref (`open`, `close`) |
| `bottom-sheet/sheets/ImagePickerSheet` | Ready camera / gallery chooser |
| `modal/BaseModal` | Centered modal with overlay |
| `modal/common/AlertModal` | Confirm / alert dialog with icon, title, description and two buttons |
| `navigation/StackHeader`, `HeaderBackButton`, `HeaderActionButton` | Custom stack headers |
| `navigation/AnimatedTabIcon`, `tabIconRender` | Animated bottom tab icons |
| `offline/OfflineQueryBoundary` | Chooses between content, loading UI and offline UI (see below) |
| `offline/OfflineState` | Full offline screen with animated broken-wifi icon and retry |
| `skelton/BaseSkelton` | Themed skeleton wrapper |
| `skelton/ShimmerHolder` | Registry of full-screen shimmers (`ShimmerHolder.Home`) |
| `GlobalLoader` | Full-screen loader driven by Redux (`showLoader` / `hideLoader`) |

## Important patterns

### 1. Screen data: OfflineQueryBoundary + shimmer

Wrap the content of any screen that loads data. It decides what to render:

| Has data? | Network | Renders |
| --- | --- | --- |
| yes | online or offline | your content (cached data still shows offline) |
| no | online | `loading` (a shimmer) |
| no | offline | `OfflineState` with retry |

```tsx
import { OfflineQueryBoundary } from '@/components/shared/offline';
import { ShimmerHolder } from '@/components/shared/skelton/ShimmerHolder';
import { useGetProfile } from '@/hooks/app';

const Home = () => {
  const { data } = useGetProfile();

  return (
    <OfflineQueryBoundary hasData={!!data} loading={<ShimmerHolder.Home />}>
      {/* screen content */}
    </OfflineQueryBoundary>
  );
};
```

Try it: in `src/screens/tab/home/index.tsx` set `HAS_DATA = false`. With internet on you see the shimmer; turn on airplane mode and you see the offline screen.

**Add a shimmer for a new screen** (same three steps every time):

1. `skelton/layouts/<screen>.layout.ts` — return the blocks (width, height, borderRadius, margins) that match your screen.
2. `skelton/holders/<Screen>Shimmer.tsx` — render `BaseSkelton` with that layout; export it from `holders/index.ts`.
3. Register it in `skelton/ShimmerHolder.ts` and use `<ShimmerHolder.<Screen> />`.

### 2. Blocking actions: global loader

Use the global loader when the user must wait for an action (submit, upload, delete). For first-time screen data, use a shimmer instead.

```tsx
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { hideLoader, showLoader } from '@/redux/slice/loader.slice';

const dispatch = useAppDispatch();

const onSave = async () => {
  dispatch(showLoader());
  try {
    await updateProfile(values);
  } finally {
    dispatch(hideLoader());
  }
};
```

See `src/screens/tab/profile/index.tsx` for a running example.

### 3. API calls and the mock backend

- `services/api/axios` — one `apiClient` with base URL, timeout, auth token and error interceptors.
- `constants/endpoint.ts` — all endpoint paths.
- `services/api/<feature>/` — plain async functions per feature (`getProfile`, `updateProfile`, `login`, ...). They unwrap the standard response `{ result, message, payload }`.

While `API_BASE_URL` is **not** set in `.env`, every request is answered by `services/api/mock/mockAdapter.ts` after a short delay. You can build and click through every screen without a server. To add a fake endpoint, add a handler there:

```ts
[`get ${ENDPOINTS.app.orders}`]: () => ({
  message: 'Orders loaded',
  payload: [{ id: 1, title: 'First order' }],
}),
```

When your backend is ready, set `API_BASE_URL` in `.env` and restart Metro with `yarn start --reset-cache`. No screen code changes.

### 4. Query and mutation hooks

Screens never call axios directly. They use hooks from `src/hooks/app/`:

- `useGetProfile()` — `useQuery` with a key from `constants/queryKey.ts`, caches the profile and mirrors it into Redux.
- `useUpdateProfile()` — `useMutation` that uploads (compressing images), shows a success toast and invalidates the profile query so every screen refreshes.

Copy these two files as the template for every new feature.

### 5. Toasts and errors

```ts
import { SuccessToast, ErrorToast, InfoToast } from '@/services/toast';
import { ErrorHandler } from '@/services/errors';

SuccessToast({ message: 'Saved' });
ErrorHandler(error); // maps HTTP / backend errors to a readable toast
```

Going offline shows a toast automatically (`NetworkContext`). Read the network state anywhere with `useNetwork()` (`isOffline`, `refresh`).

### 6. Theme, fonts and icons

```tsx
const { color, mode, setMode } = useAppTheme(); // mode: 'light' | 'dark' | 'system'
<View style={{ backgroundColor: color.background_primary }} />
```

- Colors: `theme/light.ts` and `theme/dark.ts` (same token names), built from `theme/palette.ts`.
- Spacing and layout helpers: `theme/spacing.ts`, `theme/layout.ts`.
- Fonts: InterTight, used through `CustomText` `weight`.
- Responsive sizes: `normalize()` from `utils/normalize`.
- Icons: drop an `.svg` into `src/assets/icons`, run `yarn generate:icons`, then `<Icon name="my-icon" size={20} color={color.primary} />`.

### 7. Translations

Add keys to `src/i18n/locales/en.json` (and other locales), then:

```tsx
const { t } = useTranslation();
<CustomText>{t('profile.editProfile')}</CustomText>
```

Keys are type-checked.

### 8. Forms

```tsx
const { control, handleSubmit, formState: { errors } } = useForm({
  resolver: yupResolver(loginSchema),
});

<FormInput control={control} name="email" label="Email" variant="text" error={errors.email?.message} />
```

Schemas live in `src/validation/schema/`, shared rules and translated messages in `src/validation/`. See the Login and Sign up screens.

## Environment variables

`.env.example` is copied into the project. Create `.env` next to it:

```bash
# leave unset to use the mock backend
API_BASE_URL=https://api.yourserver.com
```

Values are inlined at build time (`process.env.API_BASE_URL`). Restart Metro with `--reset-cache` after changing them. `.env` is git-ignored.

## Useful scripts

| Command | What it does |
| --- | --- |
| `yarn android` / `yarn ios` | Run the app |
| `yarn start --reset-cache` | Start Metro with a clean cache (after `.env` or babel changes) |
| `yarn generate:icons` | Rebuild `src/assets/icons/index.ts` from the SVG files |
| `npx react-native-asset` | Re-link fonts after adding new ones to `src/assets/fonts` |

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `init` fails or creates an old React Native version | Remove global CLIs: `npm uninstall -g react-native-cli @react-native-community/cli`, then run again |
| Node version error during `init` or install | Upgrade Node to 22.13 or newer (`node -v`) |
| `pod install` failed at the end | `cd ios && bundle install && bundle exec pod install` |
| `patch-package` warning about `react-native-element-dropdown` | A newer version of that library was installed. The app still works; delete the old file in `patches/` or recreate it with `npx patch-package react-native-element-dropdown` |
| `@/...` import or `.env` value not found | Restart Metro with a clean cache: `yarn start --reset-cache` |
| Fonts missing after adding new ones | `npx react-native-asset`, then rebuild the app |
| Android build cannot download Gradle | Check your network / proxy and run `cd android && ./gradlew clean`, then build again |

---

## Contributing

Bug reports and pull requests are welcome on [GitHub](https://github.com/satyam-narayan/create-react-native-starter-kit/issues). See [CONTRIBUTING.md](https://github.com/satyam-narayan/create-react-native-starter-kit/blob/main/CONTRIBUTING.md) for the project layout and how to test changes locally.

## Support

If this starter kit saves you time, you can support its development:

<a href="https://www.buymeacoffee.com/satyamnarayan" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me a Coffee" height="50"></a>

## License

[MIT](./LICENSE) © [Satyam Narayan](https://github.com/satyam-narayan)
