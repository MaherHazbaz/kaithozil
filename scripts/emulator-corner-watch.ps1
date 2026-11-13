# Keeps the Android emulator window in the bottom-right corner, however it was started
# (`emulator -avd ...`, Android Studio, `pnpm android`, `pnpm emulator`).
#
#   pwsh scripts/emulator-corner-watch.ps1              run the watcher in this console
#   ... -Install                                        start it now and at every Windows sign-in
#   ... -Uninstall                                      stop it and remove it from sign-in
#
# WHY a watcher: on this 1280x720 screen the emulator opens a 737-point-tall window at an
# off-screen position (title bar above the top edge). It also ignores the position saved in
# emulator-user.ini and overwrites that file with defaults when it exits, so no setting can
# fix it. The only reliable fix is to move the window once it exists.
#
# The window is placed ONCE each time it opens, then left alone, so you can still drag it.
param(
  [switch]$Install,
  [switch]$Uninstall,
  # Phone window height as a percentage of the usable screen height.
  [ValidateRange(40, 100)][int]$HeightPercent = 90,
  # Gap from the screen edges, in points.
  [int]$Margin = 8
)

$ErrorActionPreference = 'Stop'
$startupFile = Join-Path ([Environment]::GetFolderPath('Startup')) 'kaithozhil-emulator-corner.vbs'
$thisScript = $MyInvocation.MyCommand.Path

if ($Uninstall) {
  if (Test-Path $startupFile) { Remove-Item $startupFile }
  Get-CimInstance Win32_Process -Filter "Name = 'powershell.exe'" |
    Where-Object { $_.CommandLine -like '*emulator-corner-watch.ps1*' -and $_.ProcessId -ne $PID } |
    ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
  Write-Host 'Emulator corner watcher stopped and removed from sign-in.'
  return
}

if ($Install) {
  # A tiny .vbs launcher runs PowerShell with no visible window at each sign-in.
  $command = "powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File """"$thisScript"""""
  Set-Content -Path $startupFile -Encoding ascii -Value "CreateObject(""WScript.Shell"").Run ""$command"", 0, False"
  Start-Process powershell -WindowStyle Hidden -ArgumentList '-NoProfile', '-ExecutionPolicy', 'Bypass', '-WindowStyle', 'Hidden', '-File', "`"$thisScript`""
  Write-Host "Installed. Running now and at every sign-in. Remove with: -Uninstall ($startupFile)"
  return
}

# Only one watcher at a time.
$mutex = New-Object System.Threading.Mutex($false, 'Local\KaithozhilEmulatorCorner')
if (-not $mutex.WaitOne(0)) { return }

Add-Type -AssemblyName System.Windows.Forms
Add-Type @'
using System;
using System.Runtime.InteropServices;
using System.Text;
public static class Em {
  delegate bool EnumProc(IntPtr h, IntPtr l);
  [DllImport("user32.dll")] static extern bool EnumWindows(EnumProc cb, IntPtr l);
  [DllImport("user32.dll")] static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
  [DllImport("user32.dll")] static extern bool IsWindowVisible(IntPtr h);
  [DllImport("user32.dll")] static extern bool IsIconic(IntPtr h);
  [DllImport("user32.dll")] static extern bool GetWindowRect(IntPtr h, out RECT r);
  [DllImport("user32.dll")] static extern bool SetWindowPos(IntPtr h, IntPtr after, int x, int y, int w, int hh, uint flags);
  struct RECT { public int L, T, R, B; }

  // Handles as long so PowerShell can compare them with -eq / -ne.
  public static long Phone, Toolbar;

  public static void Scan() {
    Phone = 0; Toolbar = 0;
    EnumWindows((h, l) => {
      if (!IsWindowVisible(h) || IsIconic(h)) return true;
      var s = new StringBuilder(256);
      GetWindowText(h, s, 256);
      var t = s.ToString();
      if (t.StartsWith("Android Emulator -")) Phone = h.ToInt64();
      else if (t == "Emulator") Toolbar = h.ToInt64();
      return true;
    }, IntPtr.Zero);
  }

  public static int[] Rect(long h) {
    RECT r; GetWindowRect(new IntPtr(h), out r);
    return new[] { r.L, r.T, r.R - r.L, r.B - r.T };
  }

  // 0x0040 = show window, 0x0004 = keep z-order.
  public static void Place(long h, int x, int y, int w, int hh) {
    SetWindowPos(new IntPtr(h), IntPtr.Zero, x, y, w, hh, 0x0044);
  }
}
'@

$placed = 0L
while ($true) {
  [Em]::Scan()
  $phone = [Em]::Phone
  if ($phone -ne 0 -and $phone -ne $placed) {
    # Wait until the window has finished opening (its size stops changing).
    $before = [Em]::Rect($phone)
    Start-Sleep -Seconds 2
    [Em]::Scan()
    if ([Em]::Phone -eq $phone -and (([Em]::Rect($phone)[2..3] -join 'x') -eq ($before[2..3] -join 'x'))) {
      $area = [System.Windows.Forms.Screen]::PrimaryScreen.WorkingArea
      $height = [int](($area.Height - 2 * $Margin) * $HeightPercent / 100)
      $width = [int]($before[2] * $height / $before[3])
      $x = $area.Right - $width - $Margin
      $y = $area.Bottom - $height - $Margin
      [Em]::Place($phone, $x, $y, $width, $height)

      # The emulator re-docks its toolbar after the phone moves; wait, then put it to the left.
      Start-Sleep -Milliseconds 1500
      [Em]::Scan()
      if ([Em]::Toolbar -ne 0) {
        $bar = [Em]::Rect([Em]::Toolbar)
        [Em]::Place([Em]::Toolbar, [Math]::Max($area.Left, $x - $bar[2] - 4), $y, $bar[2], $bar[3])
      }
      $placed = $phone
    }
  }
  Start-Sleep -Milliseconds 1000
}
