# Smart Home App

An Expo app with drawer navigation for a dashboard, device controls, sensor readings, and settings. The IoT backend is simulated in memory, including request delays and a 15% failure rate. Device state resets when the app reloads; settings switches are local UI state.

## Run

Use Node.js 22.13 or later, then run:

```sh
npm install
npm start
```

Use `npm run android` or `npm run ios` with an available device or simulator. The app does not require backend credentials or environment variables.

## Validate

```sh
npm run typecheck
```

No automated test suite or lint command is configured. On Windows PowerShell with restricted script execution, use `npm.cmd` in place of `npm`.

## Structure

```text
index.ts                         Expo entry point
App.tsx                          Root providers and navigation container
src/
  navigation/                    Drawer routes and drawer content
  features/
    iot/
      screens/                   Dashboard, devices, and sensors
      IoTContext.tsx             Shared IoT state and actions
      IoTTypes.ts                Device and sensor types
      simulatedIoTService.ts     Simulated requests and in-memory devices
    settings/                    Settings screen
  shared/time/                   Time formatting used by IoT screens
assets/                          App icons and splash artwork
```

Screens consume `useIoT`; the provider calls the simulator. Navigation composes the feature screens. Keep styles with their screens and add shared modules only when multiple consumers need them.
