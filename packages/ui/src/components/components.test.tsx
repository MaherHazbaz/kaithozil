import { fireEvent, render, screen } from '@testing-library/react-native';

import { AppText } from './AppText';
import { BottomNav } from './BottomNav';
import { SecondaryButton } from './Button';
import { Chip } from './Chip';
import { ListRow } from './ListRow';
import { ScreenHeader } from './ScreenHeader';
import { SegmentedControl } from './SegmentedControl';
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

describe('SecondaryButton', () => {
  it('is named by its label, with or without an icon', async () => {
    const onPress = jest.fn();
    await render(<SecondaryButton label="Add photo" icon="camera" onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Add photo' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('ScreenHeader', () => {
  it('shows the title as a heading and reports the back button', async () => {
    const onBack = jest.fn();
    await render(
      <ScreenHeader
        title="Electrician"
        subtitle="மின் பணியாளர்"
        backLabel="Back"
        onBack={onBack}
      />,
    );
    expect(screen.getByRole('header', { name: 'Electrician' })).toBeOnTheScreen();
    expect(screen.getByText('மின் பணியாளர்')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});

describe('SegmentedControl', () => {
  it('marks the selected segment and reports the tapped one', async () => {
    const onSelect = jest.fn();
    await render(
      <SegmentedControl
        segments={[
          { key: 'upcoming', label: 'Upcoming (2)' },
          { key: 'past', label: 'Past (2)' },
        ]}
        selectedKey="upcoming"
        onSelect={onSelect}
        accessibilityLabel="Show"
      />,
    );
    expect(screen.getByRole('button', { name: 'Upcoming (2)' })).toBeSelected();
    expect(screen.getByRole('button', { name: 'Past (2)' })).not.toBeSelected();
    await fireEvent.press(screen.getByRole('button', { name: 'Past (2)' }));
    expect(onSelect).toHaveBeenCalledWith('past');
  });
});

describe('ListRow', () => {
  it('reads title and subtitle as one button and reports presses', async () => {
    const onPress = jest.fn();
    await render(
      <ListRow
        icon="wallet"
        title="Payments"
        subtitle="Pay workers with any UPI app"
        onPress={onPress}
      />,
    );
    await fireEvent.press(
      screen.getByRole('button', { name: 'Payments, Pay workers with any UPI app' }),
    );
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('AppText', () => {
  it('renders Tamil characters in the Tamil font and the rest in the body font', async () => {
    await render(<AppText weight={800}>நேரடி UPI பணம்</AppText>);
    const tamil = screen.getByText('நேரடி');
    expect(tamil).toHaveStyle({ fontFamily: 'Noto Sans Tamil', fontWeight: '700' });
  });
});
