import { fireEvent, screen } from '@testing-library/react-native';

import { renderScreen } from '@/test/renderScreen';

import { formatChatTime } from './chatTime';
import { ChatScreen, type ChatScreenProps } from './screens/ChatScreen';

const props: ChatScreenProps = {
  contact: { name: 'Murugan K.', firstName: 'Murugan', initials: 'MK' },
  status: 'On the way · about 9 min',
  messages: [
    {
      id: 'm1',
      from: 'them',
      kind: 'text',
      text: "Vanakkam! I'm on my way. Reaching in about 10 minutes.",
      time: '4:21 PM',
    },
    { id: 'm2', from: 'me', kind: 'text', text: 'Okay, thank you.', time: '4:22 PM' },
    { id: 'm3', from: 'them', kind: 'voice', duration: '0:12' },
  ],
  calling: false,
  onBack: jest.fn(),
  // 4:25 PM, so sent messages get a predictable stamp.
  now: () => new Date(2026, 10, 18, 16, 25),
};

describe('formatChatTime', () => {
  it('uses a 12-hour clock with AM/PM', () => {
    expect(formatChatTime(new Date(2026, 0, 1, 0, 5))).toBe('12:05 AM');
    expect(formatChatTime(new Date(2026, 0, 1, 12, 0))).toBe('12:00 PM');
    expect(formatChatTime(new Date(2026, 0, 1, 16, 22))).toBe('4:22 PM');
  });
});

describe('ChatScreen', () => {
  it('shows the exact design wording', async () => {
    await renderScreen(<ChatScreen {...props} />);
    for (const text of [
      'Murugan K.',
      'MK',
      'On the way · about 9 min',
      'Chat is open during your job. Numbers stay private.',
      "Vanakkam! I'm on my way. Reaching in about 10 minutes.",
      '4:21 PM',
      'Okay, thank you.',
      '4:22 PM',
      '0:12',
      'Please come to the back gate',
      'Call me when you arrive',
      'My neighbour will open the door',
      'Running 5 minutes late',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.getByPlaceholderText('Type a message')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Play voice message' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Record a voice message' })).toBeOnTheScreen();
    expect(screen.queryByTestId('chat-calling')).toBeNull();
  });

  it('never shows a phone number, and calls through the masked call', async () => {
    const onCall = jest.fn();
    await renderScreen(<ChatScreen {...props} onCall={onCall} />);
    expect(screen.queryByText(/\d{5}/)).toBeNull();
    await fireEvent.press(
      screen.getByRole('button', { name: 'Call Murugan (your number stays private)' }),
    );
    expect(onCall).toHaveBeenCalledTimes(1);
  });

  it('shows the calling banner while a call rings, with End call', async () => {
    const onEndCall = jest.fn();
    await renderScreen(<ChatScreen {...props} calling onEndCall={onEndCall} />);
    expect(screen.getByText('Calling Murugan…')).toBeOnTheScreen();
    expect(
      screen.getByText("Through Kaithozhil. Neither of you sees the other's number."),
    ).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'End call' }));
    expect(onEndCall).toHaveBeenCalledTimes(1);
  });

  it('sends the typed message, stamps it and clears the field', async () => {
    const onSend = jest.fn();
    await renderScreen(<ChatScreen {...props} onSend={onSend} />);
    // Blank messages are not sent.
    await fireEvent.changeText(screen.getByTestId('chat-message'), '   ');
    await fireEvent.press(screen.getByRole('button', { name: 'Send message' }));
    expect(onSend).not.toHaveBeenCalled();

    await fireEvent.changeText(screen.getByTestId('chat-message'), ' The gate is blue ');
    await fireEvent.press(screen.getByRole('button', { name: 'Send message' }));
    expect(onSend).toHaveBeenCalledWith('The gate is blue');
    expect(screen.getByText('The gate is blue')).toBeOnTheScreen();
    expect(screen.getByText('4:25 PM')).toBeOnTheScreen();
    expect(screen.getByTestId('chat-message')).toHaveDisplayValue('');
  });

  it('sends a quick reply in one tap', async () => {
    const onSend = jest.fn();
    await renderScreen(<ChatScreen {...props} onSend={onSend} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Running 5 minutes late' }));
    expect(onSend).toHaveBeenCalledWith('Running 5 minutes late');
    // Once as the chip, once as the sent bubble.
    expect(screen.getAllByText('Running 5 minutes late')).toHaveLength(2);
  });
});
