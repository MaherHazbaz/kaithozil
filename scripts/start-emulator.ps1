# Starts the Android emulator (if it is not already running) and places its
# window neatly in the bottom-right corner of the screen, sized to fit.
#
#   pnpm emulator                      from the repo root
#   pnpm emulator -- -HeightPercent 70 smaller window
#
# WHY this script: the emulator remembers its last window position and opens
# at an automatic size. On a 720-point-tall screen that window is taller than
# the screen, so Windows pushes it up and its title bar ends up off-screen.
# Placing it ourselves after it opens is reliable whatever it remembered.
param(
  [string]$Avd = 'Medium_Phone_API_37.0',
  # Phone window height as a percentage of the usable screen height.
  [ValidateRange(40, 100)][int]$HeightPercent = 90,
  # Gap from the screen edges, in points.
  [int]$Margin = 8
)

$ErrorActionPreference = 'Stop'

$sdk = if ($env:ANDROID_HOME) { $env:ANDROID_HOME } else { Join-Path $env:LOCALAPPDATA 'Android\Sdk' }
$emulatorExe = Join-Path $sdk 'emulator\emulator.exe'
$adb = Join-Path $sdk 'platform-tools\adb.exe'

Add-Type -AssemblyName System.Windows.Forms
Add-Type @'
using System;
using System.Runtime.InteropServices;
using System.Text;
public static class KtWindows {
  public delegate bool EnumProc(IntPtr h, IntPtr l);
  [DllImport("user32.dll")] public static extern bool EnumWindows(EnumProc cb, IntPtr l);
  [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);
  [DllImport("user32.dll")] public static extern bool SetWindowPos(IntPtr h, IntPtr after, int x, int y, int w, int hgt, uint flags);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int cmd);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
  public struct RECT { public int L, T, R, B; }
}
'@

function Find-EmulatorWindows {
  $found = @{}
  $callback = [KtWindows+EnumProc]{
    param($handle, $unused)
    $title = New-Object System.Text.StringBuilder 512
    [void][KtWindows]::GetWindowText($handle, $title, 512)
    $text = $title.ToString()
    if ([KtWindows]::IsWindowVisible($handle)) {
      if ($text -like 'Android Emulator -*') { $found.phone = $handle }
      elseif ($text -eq 'Emulator') { $found.toolbar = $handle }
    }
    return $true
  }
  [void][KtWindows]::EnumWindows($callback, [IntPtr]::Zero)
  return $found
}

function Get-Size($handle) {
  $rect = New-Object KtWindows+RECT
  [void][KtWindows]::GetWindowRect($handle, [ref]$rect)
  return @{ Width = $rect.R - $rect.L; Height = $rect.B - $rect.T }
}

# 1. Start the emulator unless it is already running.
$windows = Find-EmulatorWindows
if (-not $windows.phone) {
  Write-Host "Starting emulator $Avd..."
  Start-Process -FilePath $emulatorExe -ArgumentList '-avd', $Avd -WindowStyle Minimized
  $deadline = (Get-Date).AddMinutes(3)
  do {
    Start-Sleep -Milliseconds 500
    $windows = Find-EmulatorWindows
  } while (-not $windows.phone -and (Get-Date) -lt $deadline)
  if (-not $windows.phone) { throw 'The emulator window did not appear within 3 minutes.' }
  # Let the window settle at its initial size before we move it.
  Start-Sleep -Seconds 2
  $windows = Find-EmulatorWindows
}

# 2. Size it to fit and place it in the bottom-right corner, keeping the
#    phone's proportions. The emulator's side toolbar goes to its left.
$area = [System.Windows.Forms.Screen]::PrimaryScreen.WorkingArea
$current = Get-Size $windows.phone
$height = [int](($area.Height - 2 * $Margin) * $HeightPercent / 100)
$width = [int]($current.Width * $height / $current.Height)
$x = $area.Right - $width - $Margin
$y = $area.Bottom - $height - $Margin

$SWP_SHOWWINDOW = 0x0040
[void][KtWindows]::ShowWindow($windows.phone, 9)  # 9 = restore if minimised
[void][KtWindows]::SetWindowPos($windows.phone, [IntPtr]::Zero, $x, $y, $width, $height, $SWP_SHOWWINDOW)

if ($windows.toolbar) {
  $toolbar = Get-Size $windows.toolbar
  [void][KtWindows]::SetWindowPos($windows.toolbar, [IntPtr]::Zero, $x - $toolbar.Width - 4, $y, $toolbar.Width, $toolbar.Height, $SWP_SHOWWINDOW)
}
[void][KtWindows]::SetForegroundWindow($windows.phone)
Write-Host "Emulator window placed at bottom-right ($width x $height)."

# 3. Wait for Android to finish booting so `pnpm start` + `a` works straight away.
& $adb wait-for-device | Out-Null
$deadline = (Get-Date).AddMinutes(5)
do {
  $booted = (& $adb shell getprop sys.boot_completed 2>$null)
  if ($booted -ne '1') { Start-Sleep -Seconds 2 }
} while ($booted -ne '1' -and (Get-Date) -lt $deadline)

if ($booted -eq '1') {
  Write-Host 'Android is ready. Next: cd apps/customer; pnpm start; then press a.'
} else {
  Write-Host 'Android is still booting; wait for the home screen before pressing a.'
}
