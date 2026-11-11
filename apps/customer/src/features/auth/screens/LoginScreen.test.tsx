import { fireEvent, screen } from '@testing-library/react-native';

import { renderScreen } from '@/test/renderScreen';

import { LoginScreen } from './LoginScreen';

const designState = { initialMobile: '98400 12345', initialCode: '48271' };

describe('LoginScreen', () => {
  it('shows the exact design wording', async () => {
    await renderScreen(<LoginScreen onBack={jest.fn()} onVerify={jest.fn()} {...designState} />);
    for (const text of [
      'Log in',
      'Enter your mobile number',
      'Mobile number',
      '+91',
      "We'll send a 6-digit code by SMS.",
      'Enter the code',
      'Change',
      'Resend code in 0:24',
      'Verify and continue',
      'Joining as a worker? Set up your profile',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.getByText('உள்நுழைக')).toBeOnTheScreen();
    expect(screen.getByText(/Sent to \+91 98400 12345 ·/)).toBeOnTheScreen();
  });

  it('shows the design state: number filled, five of six code digits entered', async () => {
    await renderScreen(<LoginScreen onBack={jest.fn()} onVerify={jest.fn()} {...designState} />);
    expect(screen.getByTestId('login-mobile')).toHaveDisplayValue('98400 12345');
    expect(
      ['0', '1', '2', '3', '4', '5'].map((i) => screen.getByTestId(`otp-${i}`).props.value),
    ).toEqual(['4', '8', '2', '7', '1', '']);
  });

  it('accepts a typed code digit and ignores non-digits', async () => {
    await renderScreen(<LoginScreen onBack={jest.fn()} onVerify={jest.fn()} {...designState} />);
    await fireEvent.changeText(screen.getByTestId('otp-5'), 'x');
    expect(screen.getByTestId('otp-5')).toHaveDisplayValue('');
    await fireEvent.changeText(screen.getByTestId('otp-5'), '9');
    expect(screen.getByTestId('otp-5')).toHaveDisplayValue('9');
  });

  it('labels every code box for screen readers', async () => {
    await renderScreen(<LoginScreen onBack={jest.fn()} onVerify={jest.fn()} />);
    for (let position = 1; position <= 6; position++) {
      expect(screen.getByLabelText(`Digit ${position}`)).toBeOnTheScreen();
    }
  });

  it('reports Back, Verify and the worker link', async () => {
    const onBack = jest.fn();
    const onVerify = jest.fn();
    const onWorkerSignup = jest.fn();
    await renderScreen(
      <LoginScreen onBack={onBack} onVerify={onVerify} onWorkerSignup={onWorkerSignup} />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Back' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Verify and continue' }));
    await fireEvent.press(screen.getByTestId('login-worker-link'));
    expect(onBack).toHaveBeenCalledTimes(1);
    expect(onVerify).toHaveBeenCalledTimes(1);
    expect(onWorkerSignup).toHaveBeenCalledTimes(1);
  });
});
