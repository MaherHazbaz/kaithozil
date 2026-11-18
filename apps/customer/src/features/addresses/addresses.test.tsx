import { fireEvent, renderHook, screen, act } from '@testing-library/react-native';

import { renderScreen } from '@/test/renderScreen';

import { removeAddress, useSavedAddresses } from './hooks/useSavedAddresses';
import { SAMPLE_ADDRESSES, SAMPLE_PINNED_PLACE, sampleDraft } from './sampleData';
import { AddressEditScreen } from './screens/AddressEditScreen';
import { AddressesScreen, type AddressesScreenProps } from './screens/AddressesScreen';

const listProps = (overrides: Partial<AddressesScreenProps> = {}): AddressesScreenProps => ({
  addresses: SAMPLE_ADDRESSES,
  defaultId: 'home',
  onBack: jest.fn(),
  onAdd: jest.fn(),
  onEdit: jest.fn(),
  onRemove: jest.fn(),
  onSetDefault: jest.fn(),
  ...overrides,
});

describe('AddressesScreen', () => {
  it('shows the exact design wording', async () => {
    await renderScreen(<AddressesScreen {...listProps()} />);
    expect(screen.getByRole('header', { name: 'Saved addresses' })).toBeOnTheScreen();
    for (const text of [
      'சேமித்த முகவரிகள்',
      'Home',
      'Default',
      '12, 4th Street, Anna Nagar, Chennai 600040',
      'Near Tower Park',
      'Office',
      'Plot 18, 2nd Avenue, Ambattur Industrial Estate, Chennai 600058',
      'Gate 2, ground floor',
      "Amma's house",
      '7, Kamarajar Street, Villivakkam, Chennai 600049',
      'Opposite the temple',
      'Workers see your full address only after they accept your job.',
      'Add new address',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    // Only the non-default addresses offer "Set as default".
    expect(screen.getAllByText('Set as default')).toHaveLength(2);
    expect(screen.getAllByText('Default')).toHaveLength(1);
  });

  it('names each action after its address', async () => {
    const props = listProps();
    await renderScreen(<AddressesScreen {...props} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Edit Office' }));
    await fireEvent.press(screen.getByRole('button', { name: "Remove Amma's house" }));
    await fireEvent.press(screen.getByRole('button', { name: 'Set Office as default' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Add new address' }));
    expect(props.onEdit).toHaveBeenCalledWith('office');
    expect(props.onRemove).toHaveBeenCalledWith('amma');
    expect(props.onSetDefault).toHaveBeenCalledWith('office');
    expect(props.onAdd).toHaveBeenCalled();
  });
});

describe('useSavedAddresses', () => {
  it('moves the default to the first address left when the default is removed', () => {
    expect(removeAddress(SAMPLE_ADDRESSES, 'home', 'home')).toEqual({
      addresses: SAMPLE_ADDRESSES.slice(1),
      defaultId: 'office',
    });
    expect(removeAddress(SAMPLE_ADDRESSES, 'home', 'amma').defaultId).toBe('home');
    expect(removeAddress(SAMPLE_ADDRESSES.slice(0, 1), 'home', 'home').defaultId).toBeUndefined();
  });

  it('sets a new default', async () => {
    const { result } = await renderHook(() => useSavedAddresses(SAMPLE_ADDRESSES));
    expect(result.current.defaultId).toBe('home');
    await act(async () => result.current.setDefault('amma'));
    expect(result.current.defaultId).toBe('amma');
  });
});

describe('AddressEditScreen', () => {
  it('shows the exact design wording', async () => {
    await renderScreen(
      <AddressEditScreen place={SAMPLE_PINNED_PLACE} onBack={jest.fn()} onSave={jest.fn()} />,
    );
    expect(screen.getByRole('header', { name: 'Add address' })).toBeOnTheScreen();
    for (const text of [
      'Move the map to place the pin',
      'Use my current location',
      'முகவரியைச் சேர்க்கவும்',
      '4th Street, Anna Nagar',
      'Chennai, Tamil Nadu 600040',
      'House or flat number · வீட்டு எண்',
      'Landmark (optional) · அடையாளம்',
      'Save as',
      'Home',
      'Office',
      'Other',
      'Make this my default address',
      'Used first when you book',
      'Save address',
      'Add your house or flat number to save',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.getByPlaceholderText('e.g. 12, 2nd floor')).toBeOnTheScreen();
    expect(screen.getByPlaceholderText('e.g. Near Tower Park')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Home' })).toBeSelected();
    expect(screen.getByRole('switch', { name: 'Make this my default address' })).not.toBeChecked();
  });

  it('saves only once the house number is filled', async () => {
    const onSave = jest.fn();
    await renderScreen(
      <AddressEditScreen place={SAMPLE_PINNED_PLACE} onBack={jest.fn()} onSave={onSave} />,
    );
    expect(screen.getByTestId('address-edit-save')).toBeDisabled();

    await fireEvent.changeText(screen.getByTestId('address-edit-house'), '  ');
    expect(screen.getByTestId('address-edit-save')).toBeDisabled();

    await fireEvent.changeText(screen.getByTestId('address-edit-house'), '12, 2nd floor');
    await fireEvent.changeText(screen.getByTestId('address-edit-landmark'), 'Near Tower Park');
    await fireEvent.press(screen.getByRole('button', { name: 'Office' }));
    await fireEvent.press(screen.getByRole('switch', { name: 'Make this my default address' }));
    expect(screen.queryByText('Add your house or flat number to save')).toBeNull();

    await fireEvent.press(screen.getByTestId('address-edit-save'));
    expect(onSave).toHaveBeenCalledWith({
      house: '12, 2nd floor',
      landmark: 'Near Tower Park',
      label: 'office',
      isDefault: true,
    });
  });

  it('pre-fills a saved address and shows the location state', async () => {
    await renderScreen(
      <AddressEditScreen
        place={SAMPLE_PINNED_PLACE}
        initial={sampleDraft('amma')}
        usingCurrentLocation
        onBack={jest.fn()}
        onSave={jest.fn()}
      />,
    );
    expect(screen.getByTestId('address-edit-house')).toHaveDisplayValue('7');
    expect(screen.getByTestId('address-edit-landmark')).toHaveDisplayValue('Opposite the temple');
    expect(screen.getByRole('button', { name: 'Other' })).toBeSelected();
    expect(screen.getByText('Using your current location')).toBeOnTheScreen();
    expect(screen.getByTestId('address-edit-save')).toBeEnabled();
  });
});
