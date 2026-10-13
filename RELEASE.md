# GlowLog iOS release checklist

This app stores routine, product, hydration, and profile data locally in SQLite. It has no HTTP API or cloud account. Vercel is only needed if we publish a public website, privacy policy, or support page.

## Before the first TestFlight build

1. Replace the Expo starter app icon in `assets/images/icon.png`. Check the splash screen and favicon too.
2. Test on a physical iPhone: fresh install and onboarding; add/edit/archive/delete products; product photo after app restart; remove a product photo; morning/evening routine; reminders at selected times; water tracking; history/reports; theme and language; backup export and restore.
3. Verify a backup on a second device before relying on it. The current JSON backup includes image URI strings, not image file contents, so product photos may not survive restore on another device.
4. Prepare a public privacy policy URL and support contact. The app's current local-data behavior should be described accurately; recheck if analytics, accounts, or cloud sync are added.
5. Choose App Store screenshots and description after testing the production build.

## Expo and Apple setup

The iOS bundle identifier is `com.irmakari.glowlog`, and the first release targets iPhone. Do not change this identifier after creating the App Store Connect app record.

```bash
npx eas-cli@latest login
npx eas-cli@latest whoami
npx eas-cli@latest init
npx eas-cli@latest build --platform ios --profile production
```

The `init` command links this repository to an Expo project and adds its project ID. Log in to the correct Expo account before running it. For the first iOS build, sign in to the Apple Developer account when prompted and let EAS create the distribution certificate and provisioning profile. Keep credentials out of Git.

Once the production build succeeds:

```bash
npx eas-cli@latest submit --platform ios --profile production
```

In App Store Connect, wait for Apple to process the build, complete TestFlight test information, then add an internal tester. For external testers, submit the build for Beta App Review. TestFlight upload does not publish the app to the App Store.

## Release checks

```bash
npm ci
npx expo install --check
npx tsc --noEmit
npm run lint
npm test -- --runInBand
npx expo export --platform web
```

The web export checks bundle compilation; it is not a substitute for an iPhone TestFlight smoke test. The `production` EAS profile uses store distribution and remote build number increments, so each upload gets a new iOS build number.

## Web and Vercel

The iOS app is built by EAS and uploaded to App Store Connect. Vercel does not host the native app. If a website is wanted later, Expo can export the web build to `dist/`; test browser behavior before publishing because this app relies on SQLite and native APIs.
