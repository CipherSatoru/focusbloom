# Google Colab Build Script for FocusBloom APK

# Copy this entire script into a Google Colab notebook cell and run it.
# This will install all dependencies and build the APK.

# ─── Step 1: Install Java and Android SDK ─────────────────────────
print("Installing Java and Android SDK...")
!apt-get update -qq
!apt-get install -y -qq openjdk-17-jdk
!apt-get install -y -qq nodejs npm
!npm install -g expo-cli eas-cli

# Set up Java
import os
os.environ['JAVA_HOME'] = '/usr/lib/jvm/java-17-openjdk-amd64'
os.environ['PATH'] = os.environ['JAVA_HOME'] + '/bin:' + os.environ['PATH']

# ─── Step 2: Clone the project ────────────────────────────────────
print("Cloning project...")
!git clone https://github.com/your-username/focusbloom.git /content/focusbloom 2>/dev/null || echo "No git repo — using local files"

# If no git repo, copy from mounted drive or upload files
# You can also upload the project as a zip file

# ─── Step 3: Install dependencies ─────────────────────────────────
print("Installing npm dependencies...")
%cd /content/focusbloom
!npm install

# ─── Step 4: Build the APK ────────────────────────────────────────
print("Building APK...")

# Option A: EAS Build (requires Expo account)
# !eas build --platform android --profile production --non-interactive

# Option B: Expo CLI build (simpler, no account needed for basic builds)
!npx expo prebuild --platform android
!npx expo run:android --mode release

# ─── Step 5: Download the APK ─────────────────────────────────────
print("Finding APK...")
import glob
apk_files = glob.glob('/content/focusbloom/android/app/build/outputs/apk/**/*.apk', recursive=True)
if apk_files:
    print(f"APK found: {apk_files[0]}")
    from google.colab import files
    files.download(apk_files[0])
else:
    print("APK not found. Check the build output above for errors.")
