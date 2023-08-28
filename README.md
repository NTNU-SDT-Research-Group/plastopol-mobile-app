# PlastOPol
Data collection app for the PlastOPol project.

## Setup
```bash
npm install
npx expo install

npm install -g sharp-cli
```

To start the app in development mode, run:
```bash
npm run dev
```
This assumes you have the Expo Go app installed on your phone. Expo Go app is not supported on IOS so you will need to run the app on a custom dev client.

If you would like to run the app on a custom dev client, run:
```bash
npm run dev:custom-client
```
Note: You will need to create a custom dev client using EAS or locally for this to work.

## Build
### Android
```bash
eas build -p android --profile preview
```