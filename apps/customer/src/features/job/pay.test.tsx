import { fireEvent, screen } from '@testing-library/react-native';

import { renderScreen } from '@/test/renderScreen';

import { toggleFeedbackTag } from './jobFeedback';
import { PayScreen, type PayScreenProps } from './screens/PayScreen';

// The data and state drawn in design/source/Pay.dc.html.
const designData: PayScreenProps = {
  worker: { name: 'Murugan K.', firstName: 'Murugan' },
  workDone: 'Fan repair + new regulator',
  jobId: 'KT-20481',
  amountRupees: 650,
  initialFeedback: { rating: 4 },
};

describe('toggleFeedbackTag', () => {
  it('adds a tag that is missing and removes one that is there', () => {
    expect(toggleFeedbackTag([], 'onTime')).toEqual(['onTime']);
    expect(toggleFeedbackTag(['onTime'], 'neatWork')).toEqual(['onTime', 'neatWork']);
    expect(toggleFeedbackTag(['onTime', 'neatWork'], 'onTime')).toEqual(['neatWork']);
  });

  it('does not change the list it was given', () => {
    const tags = ['onTime'] as const;
    toggleFeedbackTag(tags, 'fairPrice');
    expect(tags).toEqual(['onTime']);
  });
});

describe('PayScreen', () => {
  it('shows the exact design wording', async () => {
    await renderScreen(<PayScreen {...designData} />);
    expect(screen.getByRole('header', { name: 'Job completed' })).toBeOnTheScreen();
    for (const text of [
      'Murugan marked your job as done. Check the work, then pay.',
      'Work done',
      'Fan repair + new regulator',
      'Worker',
      'Murugan K.',
      'Job ID',
      'KT-20481',
      'Total',
      '₹650',
      'Pay ₹650 with UPI',
      "Opens your UPI app. Money goes straight to Murugan's bank account.",
      'How was the work?',
      'Very good',
      'On time',
      'Neat work',
      'Fair price',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
  });

  it('starts unrated unless a rating is passed in', async () => {
    await renderScreen(<PayScreen {...designData} initialFeedback={undefined} />);
    expect(screen.getByTestId('pay-rating-word')).toHaveTextContent('');
    for (const stars of ['1 star', '2 stars', '3 stars', '4 stars', '5 stars']) {
      expect(screen.getByRole('button', { name: stars })).not.toBeSelected();
    }
  });

  it('changes the rating word when a star is tapped', async () => {
    await renderScreen(<PayScreen {...designData} />);
    expect(screen.getByRole('button', { name: '4 stars' })).toBeSelected();

    await fireEvent.press(screen.getByRole('button', { name: '5 stars' }));
    expect(screen.getByText('Excellent')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: '5 stars' })).toBeSelected();
    expect(screen.getByRole('button', { name: '4 stars' })).not.toBeSelected();

    await fireEvent.press(screen.getByRole('button', { name: '1 star' }));
    expect(screen.getByText('Poor')).toBeOnTheScreen();
  });

  it('lets several feedback chips be chosen and un-chosen', async () => {
    await renderScreen(<PayScreen {...designData} />);
    const onTime = screen.getByRole('button', { name: 'On time' });
    const fairPrice = screen.getByRole('button', { name: 'Fair price' });

    await fireEvent.press(onTime);
    await fireEvent.press(fairPrice);
    expect(onTime).toBeSelected();
    expect(fairPrice).toBeSelected();
    expect(screen.getByRole('button', { name: 'Neat work' })).not.toBeSelected();

    await fireEvent.press(onTime);
    expect(onTime).not.toBeSelected();
  });

  it('hands the rating and chips to onPay', async () => {
    const onPay = jest.fn();
    await renderScreen(<PayScreen {...designData} onPay={onPay} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Neat work' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Pay ₹650 with UPI' }));
    expect(onPay).toHaveBeenCalledWith({ rating: 4, tags: ['neatWork'] });
  });
});
