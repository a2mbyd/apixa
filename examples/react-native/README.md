# Apixa × React Native (Expo)

Same `defineApi` client as the web examples, running in Expo.

## Prerequisites

1. `pnpm install` and `pnpm --filter @apixa/core build`
2. FastAPI backend: `./scripts/macos/run-backend.sh` (or linux/win)
3. Expo Go app on a device, or iOS Simulator / Android Emulator

## Run

```bash
# macOS
./scripts/macos/run-frontend-react-native.sh

# Linux
./scripts/linux/run-frontend-react-native.sh

# Windows
scripts\win\run-frontend-react-native.bat
```

Or: `pnpm example:react-native`

Then press `i` (iOS), `a` (Android), or scan the QR code.

## API URL

- iOS simulator / web: `http://127.0.0.1:8787`
- Android emulator: `http://10.0.2.2:8787`
- Physical device: set `EXPO_PUBLIC_API_URL` to your machine’s LAN IP, e.g. `http://192.168.1.10:8787`
