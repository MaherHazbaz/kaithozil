import { Linking, Platform } from 'react-native';

/** Opens Android's network settings; elsewhere, this app's settings page. */
export async function openNetworkSettings() {
  if (Platform.OS === 'android') {
    try {
      await Linking.sendIntent('android.settings.WIRELESS_SETTINGS');
      return;
    } catch {
      // Some phones hide that screen; fall through to the app's own settings.
    }
  }
  await Linking.openSettings();
}
