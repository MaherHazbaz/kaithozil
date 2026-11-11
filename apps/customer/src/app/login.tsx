import { useRouter } from 'expo-router';

import { LoginScreen } from '@/features/auth/screens/LoginScreen';

// Route "/login". UI only in this step: the sample number and code below are
// the state shown in design/source/Login.dc.html. They are removed when real
// phone OTP is wired up in Sprint 2.
export default function LoginRoute() {
  const router = useRouter();
  return (
    <LoginScreen
      initialMobile="98400 12345"
      initialCode="48271"
      resendIn="0:24"
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/welcome'))}
      onVerify={() => router.replace('/home')}
      // Worker sign-up (WSignup) is built in Sprint 2.
    />
  );
}
