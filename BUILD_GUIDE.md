# Building the APK

This PC doesn't have the Android build tools (Java JDK, npm, Android SDK build tools) installed, and bash commands are restricted. Here are three options to build the APK:

## Option 1: Expo Go (Fastest — No APK needed)

The simplest way to test the app. No building required.

1. Install the **Expo Go** app on your Android phone (from the Play Store)
2. On a machine with Node.js/npm, run:
   ```bash
   npm install
   npm start
   ```
3. Scan the QR code with Expo Go
4. The app runs directly on your phone

**Limitations**: Native modules (app blocking, usage tracking) won't work in Expo Go. You need a standalone build for those.

## Option 2: Google Colab (Free APK build)

Use Google Colab to build the APK in the cloud.

### Step 1: Upload the project to Google Drive or GitHub

- **GitHub**: Push the project to a GitHub repo
- **Google Drive**: Zip the project and upload to Drive

### Step 2: Use this Colab notebook

Create a new Colab notebook and run this in the first cell:

```python
# Install build tools
!apt-get update -qq
!apt-get install -y -qq openjdk-17-jdk nodejs npm
!npm install -g expo-cli

# Set up Java
import os
os.environ['JAVA_HOME'] = '/usr/lib/jvm/java-17-openjdk-amd64'
os.environ['PATH'] = os.environ['JAVA_HOME'] + '/bin:' + os.environ['PATH']

# Clone from GitHub (or mount Drive)
!git clone https://github.com/YOUR_USERNAME/focusbloom.git
%cd focusbloom

# Install dependencies
!npm install

# Prebuild native code
!npx expo prebuild --platform android

# Build APK
!npx expo run:android --mode release 2>&1 | tail -30

# Find and download the APK
import glob
apk_files = glob.glob('android/app/build/outputs/apk/**/*.apk', recursive=True)
if apk_files:
    from google.colab import files
    files.download(apk_files[0])
else:
    print("Build may have failed. Check output above.")
```

### Step 3: Install the APK on your phone

1. Download the APK from Colab
2. On your phone, enable "Install unknown apps" for your browser
3. Open the APK file and install

## Option 3: EAS Build (Expo Cloud Build)

Expo's cloud build service. Requires a free Expo account.

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

### Step 2: Login to Expo
```bash
eas login
```

### Step 3: Build
```bash
eas build --platform android --profile production
```

### Step 4: Download
- EAS will email you when the build is ready
- Or check the Expo dashboard for the download link

## Option 4: Build on Your Own Machine

If you have a machine with the Android SDK:

```bash
# Install dependencies
npm install

# Install Expo CLI globally
npm install -g expo-cli

# Prebuild native code
npx expo prebuild --platform android

# Build APK
npx expo run:android --mode release

# The APK will be at:
# android/app/build/outputs/apk/release/app-release.apk
```

## Native Module Notes

The app includes native Android modules for:
- **AppBlockerModule** — App blocking via AccessibilityService
- **UsageTrackerModule** — Usage tracking via UsageStatsManager
- **FocusBloomDeviceAdmin** — Anti-uninstall protection

These require the native Android code in the `android/` directory to be properly integrated. When using `expo prebuild`, Expo will generate the native project structure. The Kotlin files in `android/app/src/main/java/com/focusbloom/` need to be registered as React Native modules.

For EAS Build, add this to your `app.json`:
```json
{
  "plugins": [
    "./plugins/focusbloom-native"
  ]
}
```

And create a config plugin at `plugins/focusbloom-native/index.js` to register the native modules.
