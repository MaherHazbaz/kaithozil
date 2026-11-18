import { fireEvent, screen } from '@testing-library/react-native';

import { renderScreen } from '@/test/renderScreen';

import { orderTimeline, parseOrderStage } from './orderTimeline';
import { SAMPLE_ORDER, SAMPLE_SAVED_MEASUREMENTS } from './sampleData';
import { OrderStatusScreen } from './screens/OrderStatusScreen';
import { TailorBookScreen } from './screens/TailorBookScreen';
import { missingTailorDetail, toTailorBooking, type TailorDraft } from './tailorDraft';

describe('missingTailorDetail', () => {
  it('asks for the stitching type first, then the method', () => {
    expect(missingTailorDetail({ stitching: [], method: null })).toBe('stitching');
    expect(missingTailorDetail({ stitching: [], method: 'pickup' })).toBe('stitching');
    expect(missingTailorDetail({ stitching: ['blouse'], method: null })).toBe('method');
    expect(missingTailorDetail({ stitching: ['blouse'], method: 'pickup' })).toBeNull();
  });
});

describe('toTailorBooking', () => {
  const ready: TailorDraft = {
    stitching: ['blouse'],
    method: 'shopVisit',
    pieces: 2,
    needBy: 'week',
    useSavedMeasurements: true,
  };

  it('returns the booking once complete', () => {
    expect(toTailorBooking(ready)).toEqual(ready);
  });

  it('refuses incomplete drafts and pieces outside 1 to 20', () => {
    expect(toTailorBooking({ ...ready, method: null })).toBeNull();
    expect(toTailorBooking({ ...ready, pieces: 0 })).toBeNull();
    expect(toTailorBooking({ ...ready, pieces: 21 })).toBeNull();
    expect(toTailorBooking({ ...ready, pieces: 1.5 })).toBeNull();
  });
});

describe('TailorBookScreen', () => {
  const render = (onSubmit = jest.fn()) =>
    renderScreen(
      <TailorBookScreen
        savedMeasurements={SAMPLE_SAVED_MEASUREMENTS}
        onBack={jest.fn()}
        onSubmit={onSubmit}
      />,
    );

  it('shows the exact design wording', async () => {
    await render();
    expect(screen.getByRole('header', { name: 'Tailor' })).toBeOnTheScreen();
    for (const text of [
      'தையல்காரர்',
      'Blouse stitching',
      'Salwar / churidar',
      'Alterations',
      'School uniform',
      'Bridal wear',
      "Men's shirt / pant",
      "Visit the tailor's shop",
      'கடைக்குச் செல்லுங்கள்',
      'Book a time to give fabric and measurements',
      'Home measurement',
      'வீட்டில் அளவெடுத்தல்',
      'The tailor comes to measure and collect fabric',
      'Pickup and drop',
      'எடுத்துச் சென்று திருப்பித் தருதல்',
      'Fabric collected, finished clothes delivered · [PICKUP FEE]',
      'How many pieces?',
      'எத்தனை?',
      'In 3 days',
      'In a week',
      'In 2 weeks',
      'Use my saved measurements',
      'Priya · saved October',
      'Add a design you like',
      'Tailors share photos of finished clothes on their profile only with your permission, and never show faces.',
      'Find a tailor',
      'Choose what you need stitched',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.getByText(/What do you need\?/)).toBeOnTheScreen();
    expect(screen.getByText(/How would you like it\?/)).toBeOnTheScreen();
    expect(screen.getByText(/Need it by/)).toBeOnTheScreen();
  });

  it('starts in the design state: nothing chosen, 1 piece, in a week, saved on', async () => {
    await render();
    expect(screen.getByTestId('tailor-submit')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'In a week' })).toBeSelected();
    expect(screen.getByRole('button', { name: 'Blouse stitching' })).not.toBeSelected();
    expect(screen.getByRole('switch', { name: 'Use my saved measurements' })).toBeChecked();
    expect(screen.getByText('1')).toBeOnTheScreen();
  });

  it('says what is missing, names the button after the method, and sends the booking', async () => {
    const onSubmit = jest.fn();
    await render(onSubmit);

    await fireEvent.press(screen.getByRole('button', { name: 'Blouse stitching' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Alterations' }));
    expect(screen.getByText('Choose shop visit, home measurement or pickup')).toBeOnTheScreen();

    await fireEvent.press(screen.getByTestId('tailor-method-homeMeasurement'));
    expect(screen.getByRole('radio', { name: /^Home measurement/ })).toBeChecked();
    expect(screen.getByText('Book home measurement')).toBeOnTheScreen();
    expect(screen.queryByTestId('tailor-missing')).toBeNull();

    await fireEvent.press(screen.getByRole('button', { name: 'More pieces' }));
    await fireEvent.press(screen.getByRole('button', { name: 'In 2 weeks' }));
    await fireEvent.press(screen.getByRole('switch', { name: 'Use my saved measurements' }));
    await fireEvent.press(screen.getByTestId('tailor-submit'));

    expect(onSubmit).toHaveBeenCalledWith({
      stitching: ['blouse', 'alterations'],
      method: 'homeMeasurement',
      pieces: 2,
      needBy: 'twoWeeks',
      useSavedMeasurements: false,
    });
  });

  it('lets a stitching type be chosen and unchosen', async () => {
    await render();
    const blouse = screen.getByRole('button', { name: 'Blouse stitching' });
    await fireEvent.press(blouse);
    expect(blouse).toBeSelected();
    await fireEvent.press(blouse);
    expect(blouse).not.toBeSelected();
    expect(screen.getByText('Choose what you need stitched')).toBeOnTheScreen();
  });

  it('labels the button for each method', async () => {
    await render();
    await fireEvent.press(screen.getByRole('button', { name: 'Bridal wear' }));
    await fireEvent.press(screen.getByTestId('tailor-method-shopVisit'));
    expect(screen.getByText('Book a shop visit')).toBeOnTheScreen();
    await fireEvent.press(screen.getByTestId('tailor-method-pickup'));
    expect(screen.getByText('Book pickup')).toBeOnTheScreen();
  });

  it('hides the saved measurements row when there are none', async () => {
    await renderScreen(<TailorBookScreen onBack={jest.fn()} />);
    expect(screen.queryByText('Use my saved measurements')).toBeNull();
  });
});

describe('parseOrderStage', () => {
  it('accepts the three stages in any case, and nothing else', () => {
    expect(parseOrderStage('Ready')).toBe('ready');
    expect(parseOrderStage('delivered')).toBe('delivered');
    expect(parseOrderStage('STITCHING')).toBe('stitching');
    expect(parseOrderStage('paid')).toBeNull();
    expect(parseOrderStage(undefined)).toBeNull();
    expect(parseOrderStage(['ready'])).toBeNull();
  });
});

describe('orderTimeline', () => {
  const summary = (stage: Parameters<typeof orderTimeline>[0]) =>
    orderTimeline(stage, SAMPLE_ORDER.dates).map((s) => `${s.label}|${s.time}|${s.state}`);

  it('matches the three states drawn in the design', () => {
    expect(summary('stitching')).toEqual([
      'Booked|Thu 13 Nov|done',
      'Measured at home|Sat 15 Nov|done',
      'Stitching|now|current',
      'Ready|by Fri 21 Nov|upcoming',
      'Delivered||upcoming',
    ]);
    expect(summary('ready')).toEqual([
      'Booked|Thu 13 Nov|done',
      'Measured at home|Sat 15 Nov|done',
      'Stitched|Thu 20 Nov|done',
      'Ready · out for delivery|today|current',
      'Delivered||upcoming',
    ]);
    expect(summary('delivered')).toEqual([
      'Booked|Thu 13 Nov|done',
      'Measured at home|Sat 15 Nov|done',
      'Stitched|Thu 20 Nov|done',
      'Delivered|Fri 21 Nov|done',
    ]);
  });
});

describe('OrderStatusScreen', () => {
  it('shows the exact design wording while stitching', async () => {
    const onMessage = jest.fn();
    const onMeasurements = jest.fn();
    await renderScreen(
      <OrderStatusScreen
        order={SAMPLE_ORDER}
        stage="stitching"
        onBack={jest.fn()}
        onMessage={onMessage}
        onMeasurements={onMeasurements}
      />,
    );
    expect(screen.getByRole('header', { name: 'Your order' })).toBeOnTheScreen();
    for (const text of [
      'உங்கள் ஆர்டர்',
      'MS',
      'Blouse stitching × 2',
      'Meena S. · Tailor · Level 2 · ★ 4.8',
      'Measured at home',
      'now',
      'by Fri 21 Nov',
      'How',
      'Home measurement, delivered to you',
      'Due',
      'Fri 21 Nov',
      'Price',
      '₹550 × 2 · pay after delivery',
      '₹1,100',
      'Measurements',
      'Saved · Priya, Nov',
      'Your measurements',
      'Saved by Meena · used for this order',
      'Pickup and delivery',
      'Codes and checklists for handing over',
      'Message Meena',
      'Report a problem',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    // "Stitching" is both the pill and the current step.
    expect(screen.getAllByText('Stitching')).toHaveLength(2);
    expect(screen.getByLabelText('Status: Stitching')).toBeOnTheScreen();
    expect(screen.queryByText('Fits well, pay ₹1,100')).toBeNull();

    await fireEvent.press(screen.getByRole('button', { name: 'Message Meena' }));
    expect(onMessage).toHaveBeenCalled();
    await fireEvent.press(screen.getByTestId('order-measurements'));
    expect(onMeasurements).toHaveBeenCalled();
  });

  it('shows the out-for-delivery step when ready', async () => {
    await renderScreen(<OrderStatusScreen order={SAMPLE_ORDER} stage="ready" onBack={jest.fn()} />);
    expect(screen.getByLabelText('Status: Ready')).toBeOnTheScreen();
    expect(screen.getByText('Ready · out for delivery')).toBeOnTheScreen();
    expect(screen.getByText('Stitched')).toBeOnTheScreen();
    expect(screen.getByText('Message Meena')).toBeOnTheScreen();
  });

  it('asks to try them on, then pay or ask for an alteration, once delivered', async () => {
    const onPay = jest.fn();
    const onRequestAlteration = jest.fn();
    await renderScreen(
      <OrderStatusScreen
        order={SAMPLE_ORDER}
        stage="delivered"
        onBack={jest.fn()}
        onPay={onPay}
        onRequestAlteration={onRequestAlteration}
      />,
    );
    expect(screen.getByLabelText('Status: Delivered')).toBeOnTheScreen();
    expect(
      screen.getByText(
        'Try them on first. If something needs fixing, ask for an alteration before paying.',
      ),
    ).toBeOnTheScreen();
    expect(screen.queryByText('Message Meena')).toBeNull();
    expect(screen.queryByText('Report a problem')).toBeNull();

    await fireEvent.press(screen.getByRole('button', { name: 'Fits well, pay ₹1,100' }));
    expect(onPay).toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('button', { name: 'Needs an alteration' }));
    expect(onRequestAlteration).toHaveBeenCalled();
  });
});
