import { useRouter } from 'expo-router';

import { WelcomeScreen } from '@/features/start/screens/WelcomeScreen';

// Route "/welcome". In the design both role cards lead to Log in.
export default function WelcomeRoute() {
  const router = useRouter();
  return (
    <WelcomeScreen
      onNeedWorker={() => router.push('/login')}
      onAmWorker={() => router.push('/login')}
      // The design's links point nowhere yet (href="#"); Terms and privacy is the closest screen.
      onTerms={() => router.push('/legal')}
      onPrivacy={() => router.push({ pathname: '/legal', params: { tab: 'privacy' } })}
    />
  );
}
