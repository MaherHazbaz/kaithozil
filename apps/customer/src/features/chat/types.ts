/**
 * The other person in the chat. There is deliberately no phone number here:
 * calls go through the masked-calling provider, so neither side ever sees
 * the other's number (CLAUDE.md "Privacy").
 */
export type ChatContact = {
  name: string;
  /** Used in "Call Murugan…" and "Calling Murugan…". */
  firstName: string;
  initials: string;
};

export type ChatAuthor = 'me' | 'them';

export type ChatMessage =
  | { id: string; from: ChatAuthor; kind: 'text'; text: string; time: string }
  | {
      id: string;
      from: ChatAuthor;
      kind: 'voice';
      /** e.g. "0:12". */
      duration: string;
    };
