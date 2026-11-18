import { useLocalSearchParams, useRouter } from 'expo-router';

import { parseOrderStage } from '@/features/tailor/orderTimeline';
import { SAMPLE_ORDER } from '@/features/tailor/sampleData';
import { OrderStatusScreen } from '@/features/tailor/screens/OrderStatusScreen';

// Route "/order/[id]": a tailor order. Shows the design's sample order whatever
// the id, until orders come from Supabase. For review, `?stage=stitching`,
// `ready` or `delivered` picks which of the design's three states is shown
// (default stitching); later the stage comes from the order itself.
//
// NOT WIRED YET:
// - "Fits well, pay …" opens Pay and rate, which still shows the sample
//   fan-repair job and moves no money: payments wait on the owner's decision
//   (gateway or direct UPI, CLAUDE.md "Trust rules").
//
// "Pickup and delivery" opens Handover at the delivery step once the order is
// ready or delivered, and at the pickup step before that.
export default function OrderRoute() {
  const router = useRouter();
  const { id, stage } = useLocalSearchParams<{ id: string; stage?: string }>();
  const orderStage = parseOrderStage(stage) ?? 'stitching';
  return (
    <OrderStatusScreen
      order={SAMPLE_ORDER}
      stage={orderStage}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/bookings'))}
      onMeasurements={() => router.push('/measurements')}
      onMessage={() => router.push({ pathname: '/job/[id]/chat', params: { id } })}
      onHandover={() =>
        router.push({
          pathname: '/order/[id]/handover',
          params: { id, step: orderStage === 'stitching' ? 'pickup' : 'delivery' },
        })
      }
      onPay={() => router.push({ pathname: '/job/[id]/pay', params: { id } })}
      onReportProblem={() => router.push({ pathname: '/job/[id]/problem', params: { id } })}
      onRequestAlteration={() => router.push({ pathname: '/job/[id]/change', params: { id } })}
    />
  );
}
