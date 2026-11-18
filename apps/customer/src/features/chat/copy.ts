// Exact wording from design/source/Chat.dc.html.
// English first. These move into en.json / ta.json when i18next is added.

export const chatCopy = {
  back: 'Back',
  // aria-label in the design (the call button shows only an icon).
  callLabel: (firstName: string) => `Call ${firstName} (your number stays private)`,
  calling: (firstName: string) => `Calling ${firstName}…`,
  callingDetail: "Through Kaithozhil. Neither of you sees the other's number.",
  endCall: 'End call',
  privacy: 'Chat is open during your job. Numbers stay private.',
  playVoice: 'Play voice message',
  quickRepliesLabel: 'Quick replies',
  quickReplies: [
    'Please come to the back gate',
    'Call me when you arrive',
    'My neighbour will open the door',
    'Running 5 minutes late',
  ],
  messageLabel: 'Message',
  messagePlaceholder: 'Type a message',
  recordVoice: 'Record a voice message',
  send: 'Send message',
} as const;
