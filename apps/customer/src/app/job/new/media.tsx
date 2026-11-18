import { useRouter } from 'expo-router';

import { useJobMedia } from '@/features/job/hooks/useJobMedia';
import { MediaScreen } from '@/features/job/screens/MediaScreen';

// Route "/job/new/media". The two photos are the design's sample state
// (design/source/Media.dc.html), drawn as its lavender placeholder tiles.
//
// NOT WIRED YET: taking or picking a photo needs expo-image-picker, and
// recording and playing the voice note need expo-audio. Neither is installed,
// so those buttons do nothing and the voice note stays in its first state.
// Uploading the files to Supabase Storage with the job comes in Sprint 2.
export default function MediaRoute() {
  const router = useRouter();
  const media = useJobMedia([{ id: 'sample-1' }, { id: 'sample-2' }]);
  const back = () => (router.canGoBack() ? router.back() : router.replace('/home'));
  return (
    <MediaScreen
      photos={media.photos}
      voiceNote={{ status: 'idle' }}
      onRemovePhoto={media.removePhoto}
      onBack={back}
      // The photos belong to the job being described; until a shared job
      // draft exists (Sprint 2), Done only returns to it.
      onDone={back}
    />
  );
}
