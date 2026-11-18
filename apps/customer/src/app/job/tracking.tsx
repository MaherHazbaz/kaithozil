import { useRouter } from 'expo-router';

import { TrackingScreen } from '@/features/job/screens/TrackingScreen';

// Route "/job/tracking". Everything below is the sample data shown in
// design/source/Tracking.dc.html; in Sprint 2 it comes from the accepted job on
// the server (both door codes are generated there, never in the app; the stage
// follows the codes the worker enters). Call, Message and Report a problem are
// wired when those screens are built.
export default function TrackingRoute() {
  const router = useRouter();
  return (
    <TrackingScreen
      worker={{
        name: 'Murugan K.',
        firstName: 'Murugan',
        initials: 'MK',
        detail: 'Verified Level 2 · ★ 4.8 · 280 jobs',
      }}
      titleTamil="முருகன் வந்து கொண்டிருக்கிறார்"
      etaMinutes={9}
      progress={{ stage: 'onTheWay' }}
      arrivalCode="4827"
      workStartCode="3159"
      jobSummary="Fan not working"
      estimateRange="₹400 – 700"
      // Opened by a deep link there is nothing to go back to, so go to Home.
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/home'))}
      // Back to Home, closing the screens that led here, as the design's link does.
      onCancel={() => router.dismissTo('/home')}
      // Design v3 goes to "Check the bill" first; until it is built, straight to Pay.
      onPay={() => router.push('/job/pay')}
    />
  );
}
