import { useRef, useState } from 'react';

import type { TicketMessage } from '../types';

export type TicketRepliesState = {
  messages: readonly TicketMessage[];
  draft: string;
  setDraft: (text: string) => void;
  /** Sends the draft if it has any text. Returns true when something was sent. */
  send: () => boolean;
};

/**
 * The ticket's messages plus the replies sent from this screen. A sent reply
 * is shown straight away (without a time, as drawn), and the draft is cleared.
 */
export function useTicketReplies(
  initial: readonly TicketMessage[],
  onSend?: (text: string) => void,
): TicketRepliesState {
  const [sent, setSent] = useState<TicketMessage[]>([]);
  const [draft, setDraft] = useState('');
  // A counter, not Date.now(): two quick sends must still get distinct keys.
  const nextId = useRef(0);

  const send = () => {
    const text = draft.trim();
    if (text === '') return false;
    nextId.current += 1;
    setSent((current) => [...current, { id: `local-${nextId.current}`, from: 'customer', text }]);
    setDraft('');
    onSend?.(text);
    return true;
  };

  return { messages: [...initial, ...sent], draft, setDraft, send };
}
