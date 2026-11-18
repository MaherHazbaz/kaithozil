import { useRef, useState } from 'react';

import { formatChatTime } from '../chatTime';
import type { ChatMessage } from '../types';

export type ChatMessagesState = {
  messages: readonly ChatMessage[];
  draft: string;
  setDraft: (text: string) => void;
  /** Sends `text` (a quick reply) or else the draft. Returns true when something was sent. */
  send: (text?: string) => boolean;
};

/**
 * The job's messages plus the ones sent from this screen. A sent message is
 * shown straight away with the current time, and the draft is cleared.
 * `now` is injectable so tests get a fixed time.
 */
export function useChatMessages(
  initial: readonly ChatMessage[],
  onSend?: (text: string) => void,
  now: () => Date = () => new Date(),
): ChatMessagesState {
  const [sent, setSent] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  // A counter, not Date.now(): two quick sends must still get distinct keys.
  const nextId = useRef(0);

  const send = (text?: string) => {
    const message = (text ?? draft).trim();
    if (message === '') return false;
    nextId.current += 1;
    setSent((current) => [
      ...current,
      {
        id: `local-${nextId.current}`,
        from: 'me',
        kind: 'text',
        text: message,
        time: formatChatTime(now()),
      },
    ]);
    // As in the design, any send (a quick reply too) clears the draft.
    setDraft('');
    onSend?.(message);
    return true;
  };

  return { messages: [...initial, ...sent], draft, setDraft, send };
}
