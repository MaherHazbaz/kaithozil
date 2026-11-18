import { useRouter } from 'expo-router';
import { useState } from 'react';

import { ChatScreen } from '@/features/chat/screens/ChatScreen';

// Route "/job/[id]/chat", e.g. "/job/KT-20517/chat". `[id]` is a dynamic
// segment: Expo Router passes it as a search param (useLocalSearchParams), which
// will load this job's chat from the server. Static siblings such as "/job/new"
// and "/job/tracking" still win over it.
//
// SAMPLE DATA from design/source/Chat.dc.html until Supabase (Sprint 2): the
// messages come from the job's chat on the server, and sent messages go
// nowhere yet.
// NOT WIRED YET:
// - Calling. A masked-calling provider (not chosen yet) connects the two
//   phones through a proxy number, so neither side ever sees the other's real
//   number. Until then the button only shows the "Calling…" banner; no call
//   is placed.
// - Voice messages need audio recording and playback (a native module).
export default function ChatRoute() {
  const router = useRouter();
  const [calling, setCalling] = useState(false);
  return (
    <ChatScreen
      contact={{ name: 'Murugan K.', firstName: 'Murugan', initials: 'MK' }}
      status="On the way · about 9 min"
      messages={[
        {
          id: 'm1',
          from: 'them',
          kind: 'text',
          text: "Vanakkam! I'm on my way. Reaching in about 10 minutes.",
          time: '4:21 PM',
        },
        { id: 'm2', from: 'me', kind: 'text', text: 'Okay, thank you.', time: '4:22 PM' },
        { id: 'm3', from: 'them', kind: 'voice', duration: '0:12' },
      ]}
      calling={calling}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/job/tracking'))}
      onCall={() => setCalling(true)}
      onEndCall={() => setCalling(false)}
    />
  );
}
