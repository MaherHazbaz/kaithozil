import { fireEvent, screen } from '@testing-library/react-native';

import { renderScreen } from '@/test/renderScreen';

import { SAMPLE_PEOPLE } from './sampleData';
import { MyMeasurementsScreen } from './screens/MyMeasurementsScreen';

describe('MyMeasurementsScreen', () => {
  it("shows the exact design wording and Priya's blouse first", async () => {
    await renderScreen(<MyMeasurementsScreen people={SAMPLE_PEOPLE} onBack={jest.fn()} />);
    expect(screen.getByRole('header', { name: 'Measurements' })).toBeOnTheScreen();
    for (const text of [
      'அளவுகள்',
      'Whose measurements',
      'Garment',
      'Bust',
      'மார்பு',
      '86 cm',
      'Front neck depth',
      'முன் கழுத்து',
      'Back neck depth',
      '20 cm',
      'Measured by Meena S. · 15 Nov 2026',
      'Only tailors you book can see these, and only for that order.',
      'Edit',
      'Book with these',
      'Add a person',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.getByRole('button', { name: 'Priya' })).toBeSelected();
    expect(screen.getByRole('button', { name: 'Blouse' })).toBeSelected();
    expect(screen.getByRole('button', { name: 'Kurta' })).not.toBeSelected();
  });

  it('switches garment, and goes back to the first garment on another person', async () => {
    await renderScreen(<MyMeasurementsScreen people={SAMPLE_PEOPLE} onBack={jest.fn()} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Kurta' }));
    expect(screen.getByText('102 cm')).toBeOnTheScreen();
    expect(screen.getByText('Measured by Meena S. · 2 Aug 2026')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Amma' }));
    expect(screen.getByRole('button', { name: 'Blouse' })).toBeSelected();
    // Amma has no kurta measurements.
    expect(screen.queryByRole('button', { name: 'Kurta' })).toBeNull();
    expect(screen.getByText('94 cm')).toBeOnTheScreen();
    expect(screen.getByText('Added by you · 10 Jun 2026')).toBeOnTheScreen();
  });

  it('passes the shown person and garment to Edit and Book', async () => {
    const onEdit = jest.fn();
    const onBook = jest.fn();
    await renderScreen(
      <MyMeasurementsScreen
        people={SAMPLE_PEOPLE}
        onBack={jest.fn()}
        onEdit={onEdit}
        onBook={onBook}
      />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Kurta' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Edit' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Book with these' }));
    expect(onEdit).toHaveBeenCalledWith({ personId: 'self', garment: 'Kurta' });
    expect(onBook).toHaveBeenCalledWith({ personId: 'self', garment: 'Kurta' });
  });
});
