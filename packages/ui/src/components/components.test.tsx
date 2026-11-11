import { fireEvent, render, screen } from '@testing-library/react-native';

import { AppText } from './AppText';
import { BottomNav } from './BottomNav';
import { Chip } from './Chip';
import { Stepper } from './Stepper';

describe('Chip', () => {
  it('exposes its selected state to screen readers and reports presses', async () => {
    const onPress = jest.fn();
    await render(<Chip label="English" selected onPress={onPress} />);
    const chip = screen.getByRole('button', { name: 'English' });
    expect(chip).toBeSelected();
    await fireEvent.press(chip);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('Stepper', () => {
  it('steps within its limits', async () => {
    const onChange = jest.fn();
    await render(
      <Stepper
        value={1}
        min={1}
        max={60}
        onChange={onChange}
        decreaseLabel="Fewer days"
        increaseLabel="More days"
      />,
    );
    // At the minimum the minus button is disabled.
    expect(screen.getByRole('button', { name: 'Fewer days' })).toBeDisabled();
    await fireEvent.press(screen.getByRole('button', { name: 'More days' }));
    expect(onChange).toHaveBeenCalledWith(2);
  });
});

describe('BottomNav', () => {
  it('marks the active tab and reports the tapped one', async () => {
    const onSelect = jest.fn();
    await render(
      <BottomNav
        items={[
          { key: 'home', label: 'Home', icon: 'home' },
          { key: 'bookings', label: 'Bookings', icon: 'calendar' },
        ]}
        activeKey="home"
        onSelect={onSelect}
      />,
    );
    expect(screen.getByRole('tab', { name: 'Home' })).toBeSelected();
    expect(screen.getByRole('tab', { name: 'Bookings' })).not.toBeSelected();
    await fireEvent.press(screen.getByRole('tab', { name: 'Bookings' }));
    expect(onSelect).toHaveBeenCalledWith('bookings');
  });
});

describe('AppText', () => {
  it('renders Tamil characters in the Tamil font and the rest in the body font', async () => {
    await render(<AppText weight={800}>நேரடி UPI பணம்</AppText>);
    const tamil = screen.getByText('நேரடி');
    expect(tamil).toHaveStyle({ fontFamily: 'Noto Sans Tamil', fontWeight: '700' });
  });
});
