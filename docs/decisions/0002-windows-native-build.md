# 0002: Making the native Android build work on Windows

Date: 2026-11-11. Status: accepted.

The first native builds failed three times on the owner's Windows 11 machine. Each cause and fix is
recorded here because a new Windows machine will hit the same ones.

## 1. pnpm must use the hoisted layout

**Symptom.** `ninja: error: manifest 'build.ninja' still dirty after 100 tries` in the C++ step of
`@shopify/react-native-skia` and `react-native-worklets`.

**Cause.** pnpm's default layout links packages through directory junctions on Windows. CMake sees the
same files under two paths and regenerates its build files forever.

**Fix.** `nodeLinker: hoisted` in `pnpm-workspace.yaml`, which gives every package a real folder. Expo's
monorepo guide documents this as the fallback when the isolated layout causes problems.

## 2. Ninja 1.12 or newer for long paths

**Symptom.** `ninja: error: mkdir(CMakeFiles/reanimated.dir/C_/Users/...): No such file or directory`
in `react-native-reanimated`. The folder's full path was 268 characters.

**Cause.** Windows limits paths to 260 characters unless both the registry setting `LongPathsEnabled`
is on and the program opts in. Ninja opts in from version 1.12.0. The Android SDK's default CMake
(3.22.1) ships Ninja 1.10.2. None of the native modules pin a CMake version, so Reanimated's documented
`CMAKE_VERSION` variable has no effect here.

**Fix (per machine).**

1. Enable long paths (administrator PowerShell):
   `New-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem' -Name LongPathsEnabled -Value 1 -PropertyType DWord -Force`
2. Install CMake 3.31.6 from the SDK manager (it bundles Ninja 1.12.1).
3. In `%LOCALAPPDATA%\Android\Sdk\cmake\3.22.1\bin`, keep the original as
   `ninja-1.10.2.original.exe` and copy `..\..\3.31.6\bin\ninja.exe` over `ninja.exe`.

Source: Reanimated's "Building for Android on Windows" guide (use Ninja 1.12.0 or newer; enable long
paths; keep the project path short).

**Alternative.** Moving the repository to a short path such as `C:\kt` avoids the limit without
touching the SDK. Not done, to leave the owner's folder where it is.

**Risk.** The SDK manager may restore the old `ninja.exe` if it repairs CMake 3.22.1. Repeat step 3.

## 3. JDK 17, not Android Studio's bundled JDK

Android Studio bundles JDK 25. Expo and React Native document JDK 17, and React Native warns that newer
JDKs may cause problems. Microsoft OpenJDK 17 is installed and `JAVA_HOME` points to it.

## Other machine setup

- `ANDROID_HOME` = `%LOCALAPPDATA%\Android\Sdk`; `platform-tools` and `emulator` on the user PATH.
- Android SDK command-line tools installed (for `sdkmanager`).
- pnpm through corepack, pinned by `packageManager` in the root `package.json`.
- Builds for the emulator pass `-PreactNativeArchitectures=x86_64` to compile one CPU type instead of
  four. The first build takes about 20 minutes on 8 GB of RAM; later builds are incremental.
