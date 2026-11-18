import { useRouter } from 'expo-router';

import { LanguageScreen } from '@/features/settings/screens/LanguageScreen';

// Route "/language". The starting values are the design's defaults.
//
// NOT WIRED YET: the choice is not stored or applied. Saving needs MMKV (a
// native module, so a new development build) and switching the language needs
// i18next; both are on the planned library list. Save only closes the screen.
export default function LanguageRoute() {
  const router = useRouter();
  const close = () => (router.canGoBack() ? router.back() : router.replace('/profile'));
  return (
    <LanguageScreen
      initial={{ language: 'en', showBoth: true, readAloud: true, largerText: false }}
      onBack={close}
      onSave={close}
    />
  );
}
