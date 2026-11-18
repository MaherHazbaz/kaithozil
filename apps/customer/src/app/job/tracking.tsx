import { useRouter } from 'expo-router';

import { TrackingScreen } from '@/features/job/screens/TrackingScreen';

// Route "/job/tracking". Everything below is the sample data shown in
// design/source/Tracking.dc.html; in Sprint 2 it comes from the accepted job on
// the server (both door codes are generated there, never in the app; the stage
// follows the codes the worker enters). Call and Message open the job chat
// until masked calling exists.
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
      // Sample job id until the job comes from the server.
      onCall={() => router.push({ pathname: '/job/[id]/chat', params: { id: 'KT-20517' } })}
      onMessage={() => router.push({ pathname: '/job/[id]/chat', params: { id: 'KT-20517' } })}
      onCancel={() => router.push({ pathname: '/job/[id]/cancel', params: { id: 'KT-20517' } })}
      onReportProblem={() =>
        router.push({ pathname: '/job/[id]/problem', params: { id: 'KT-20517' } })
      }
      // Design v3: Check the bill first, then Pay and rate, then the receipt.
      onPay={() => router.push({ pathname: '/job/[id]/bill', params: { id: 'KT-20517' } })}
    />
  );
}
