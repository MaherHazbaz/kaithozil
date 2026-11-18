import { act, fireEvent, screen } from '@testing-library/react-native';

import { renderScreen } from '@/test/renderScreen';

import { DeleteAccountScreen } from './screens/DeleteAccountScreen';
import { LanguageScreen, type LanguageSettings } from './screens/LanguageScreen';
import { LegalScreen } from './screens/LegalScreen';
import { SafetyScreen, type SafetyScreenProps } from './screens/SafetyScreen';

const languageDefaults: LanguageSettings = {
  language: 'en',
  showBoth: true,
  readAloud: true,
  largerText: false,
};

describe('LanguageScreen', () => {
  it('shows the exact design wording and default choices', async () => {
    await renderScreen(<LanguageScreen initial={languageDefaults} onBack={jest.fn()} />);
    expect(screen.getByRole('header', { name: 'Language' })).toBeOnTheScreen();
    // The Tamil title also appears inside the hint line below it.
    expect(screen.getAllByText('மொழி').length).toBeGreaterThan(0);
    for (const text of [
      'Choose the language shown first · முதலில் காட்டப்படும் மொழி',
      'Aa',
      'English first, Tamil underneath',
      'அ',
      'தமிழ் முதலில், ஆங்கிலம் கீழே · Tamil first',
      'Reading and listening',
      'Keep the second language in small text',
      'Voice in your chosen language',
      'Easier to read on small phones',
      'You can change this any time from Profile.',
      'Save',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.getByRole('radio', { name: 'English' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'தமிழ்' })).not.toBeChecked();
    expect(screen.getByRole('switch', { name: 'Show both languages' })).toBeChecked();
    expect(screen.getByRole('switch', { name: 'Read job details aloud' })).toBeChecked();
    expect(screen.getByRole('switch', { name: 'Larger text' })).not.toBeChecked();
  });

  it('saves only what was changed, on Save', async () => {
    const onSave = jest.fn();
    await renderScreen(
      <LanguageScreen initial={languageDefaults} onBack={jest.fn()} onSave={onSave} />,
    );
    await fireEvent.press(screen.getByRole('radio', { name: 'தமிழ்' }));
    await fireEvent.press(screen.getByRole('switch', { name: 'Larger text' }));
    expect(onSave).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('button', { name: 'Save' }));
    expect(onSave).toHaveBeenCalledWith({ ...languageDefaults, language: 'ta', largerText: true });
  });
});

const safetyData: SafetyScreenProps = {
  contacts: [
    { id: 'c1', initials: 'RR', label: 'Ravi R. · husband', phoneMasked: '+91 98410 ••221' },
  ],
  initialSettings: { shareLocation: true, preferWomen: false },
  onBack: jest.fn(),
};

describe('SafetyScreen', () => {
  it('shows the exact design wording', async () => {
    await renderScreen(<SafetyScreen {...safetyData} />);
    expect(screen.getByRole('header', { name: 'Safety' })).toBeOnTheScreen();
    for (const text of [
      'பாதுகாப்பு',
      'If you ever feel unsafe',
      'Leave first, then call. Our safety line answers 24 hours, in Tamil and English.',
      'Call the safety line · [SAFETY NUMBER]',
      'Emergency contacts · அவசரத் தொடர்புகள்',
      'RR',
      'Ravi R. · husband',
      '+91 98410 ••221',
      'Edit',
      'Add another contact',
      'During jobs · வேலையின் போது',
      'Good to know',
      'Everyone is ID-verified, and jobs start with door codes',
      'Never pay or take money outside the app',
      'Every Help tap is reviewed by our safety team',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(
      screen.getByRole('switch', { name: 'Share my live location with my contacts' }),
    ).toBeChecked();
    expect(
      screen.getByRole('switch', { name: 'Prefer women workers or customers' }),
    ).not.toBeChecked();
  });

  it('reports each toggle straight away', async () => {
    const onSettingsChange = jest.fn();
    await renderScreen(<SafetyScreen {...safetyData} onSettingsChange={onSettingsChange} />);
    await fireEvent.press(
      screen.getByRole('switch', { name: 'Prefer women workers or customers' }),
    );
    expect(onSettingsChange).toHaveBeenCalledWith({ shareLocation: true, preferWomen: true });
  });

  it('adds a contact only once both fields are filled', async () => {
    const onAddContact = jest.fn();
    await renderScreen(<SafetyScreen {...safetyData} onAddContact={onAddContact} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Add another contact' }));
    expect(screen.getByRole('button', { name: 'Save contact' })).toBeDisabled();

    await fireEvent.changeText(screen.getByTestId('safety-contact-name'), 'Kavya R.');
    await fireEvent.changeText(screen.getByTestId('safety-contact-phone'), '+91 98400 55555');
    await fireEvent.press(screen.getByRole('button', { name: 'Save contact' }));
    expect(onAddContact).toHaveBeenCalledWith({ name: 'Kavya R.', phone: '+91 98400 55555' });
    expect(screen.getByRole('button', { name: 'Add another contact' })).toBeOnTheScreen();
  });
});

describe('LegalScreen', () => {
  it('shows the Terms tab first', async () => {
    await renderScreen(<LegalScreen onBack={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Terms' })).toBeSelected();
    for (const text of [
      'விதிமுறைகள் · தனியுரிமை',
      'The key points in plain words. The full terms decide if anything is unclear.',
      "We connect, we don't employ",
      'Cancelling before a worker accepts is free. After that, [CANCELLATION RULE].',
      'Safety and conduct',
      'Read the full terms and privacy policy',
      'Version [VERSION] · last updated [DATE] · English and Tamil',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
  });

  it('switches to Privacy and Your data', async () => {
    const onDataAction = jest.fn();
    await renderScreen(<LegalScreen onBack={jest.fn()} onDataAction={onDataAction} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Privacy' }));
    expect(screen.getByText('What we collect')).toBeOnTheScreen();
    expect(
      screen.getByText(
        'Grievance officer: [GRIEVANCE OFFICER], [EMAIL]. We reply within [RESPONSE TIME].',
      ),
    ).toBeOnTheScreen();
    expect(screen.queryByText("We connect, we don't employ")).toBeNull();

    await fireEvent.press(screen.getByRole('button', { name: 'Your data' }));
    expect(
      screen.getByText('Your data belongs to you. You can see it, correct it, or delete it.'),
    ).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Delete my account' }));
    expect(onDataAction).toHaveBeenCalledWith('delete');
  });
});

describe('DeleteAccountScreen', () => {
  const render = (onConfirm = jest.fn(() => Promise.resolve())) =>
    renderScreen(
      <DeleteAccountScreen
        maskedPhone="+91 98400 ••345"
        onBack={jest.fn()}
        onConfirm={onConfirm}
      />,
    );

  it('shows the exact design wording', async () => {
    await render();
    expect(screen.getByRole('header', { name: 'Log out or delete' })).toBeOnTheScreen();
    for (const text of [
      'வெளியேறு · கணக்கை நீக்கு',
      'Your account stays. Log in again any time.',
      'Delete my account · கணக்கை நீக்கு',
      'Before you go',
      'No active bookings or unpaid jobs',
      'No open disputes',
      'Both are needed before an account can be deleted.',
      'What happens',
      'Payment records are kept for [RETENTION PERIOD] because the law requires it, then deleted.',
      'Why are you leaving? (optional)',
      "I don't need it any more",
      'I understand my account will be deleted',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
  });

  it('needs the tick, then a 6-digit code, before deleting', async () => {
    const onConfirm = jest.fn(() => Promise.resolve());
    await render(onConfirm);
    const continueButton = screen.getByTestId('delete-continue');
    expect(continueButton).toBeDisabled();

    await fireEvent.press(screen.getByRole('button', { name: 'Privacy concerns' }));
    await fireEvent.press(
      screen.getByRole('checkbox', { name: 'I understand my account will be deleted' }),
    );
    expect(screen.getByRole('checkbox')).toBeChecked();
    await fireEvent.press(continueButton);

    expect(screen.getByRole('header', { name: "Confirm it's you" })).toBeOnTheScreen();
    expect(screen.getByText('We sent a 6-digit code to +91 98400 ••345')).toBeOnTheScreen();
    expect(screen.getByTestId('delete-confirm')).toBeDisabled();

    // Letters are dropped and the code stops at six digits.
    await fireEvent.changeText(screen.getByTestId('delete-code'), '12a34567');
    expect(screen.getByTestId('delete-code')).toHaveDisplayValue('123456');
    await act(async () => {
      await fireEvent.press(screen.getByTestId('delete-confirm'));
    });
    expect(onConfirm).toHaveBeenCalledWith({ code: '123456', reason: 'privacy' });
    expect(screen.getByRole('header', { name: 'Deletion scheduled' })).toBeOnTheScreen();
    expect(
      screen.getByText(
        'Your account will be deleted on [DATE + 30 DAYS]. Changed your mind? Just log in before then.',
      ),
    ).toBeOnTheScreen();
  });

  it('stays on the code step when the code is refused', async () => {
    await render(jest.fn(() => Promise.reject(new Error('wrong code'))));
    await fireEvent.press(screen.getByRole('checkbox'));
    await fireEvent.press(screen.getByTestId('delete-continue'));
    await fireEvent.changeText(screen.getByTestId('delete-code'), '000000');
    await act(async () => {
      await fireEvent.press(screen.getByTestId('delete-confirm'));
    });
    expect(screen.getByRole('header', { name: "Confirm it's you" })).toBeOnTheScreen();
  });
});
