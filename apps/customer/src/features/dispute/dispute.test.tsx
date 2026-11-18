import { formatRupees } from '@kaithozhil/core';
import { act, fireEvent, screen } from '@testing-library/react-native';

import { renderScreen } from '@/test/renderScreen';

import {
  agreedCount,
  amountDueRupees,
  donePercent,
  parseOfferInput,
  suggestedOfferRupees,
  totalForJobRupees,
  workValueRupees,
} from './disputeMoney';
import {
  sampleDecidedDispute,
  sampleDispute,
  sampleDisputeJob,
  sampleMarks,
  sampleMilestones,
  sampleSettlementTerms,
} from './sampleData';
import { DisputeStatusScreen, type DisputeStatusScreenProps } from './screens/DisputeStatusScreen';
import { ReportProblemScreen, type ReportProblemScreenProps } from './screens/ReportProblemScreen';
import { SettlementScreen, type SettlementScreenProps } from './screens/SettlementScreen';
import { WorkRecordScreen, type WorkRecordScreenProps } from './screens/WorkRecordScreen';

// Amounts go through formatRupees, so these tests hold before and after its
// Indian digit grouping is written (LEARNING.md, the owner's task).
const rupees = formatRupees;
const jobDetail = `Ravi S. and Priya R. · Day 4 of 4 · ${rupees(7200)} paid so far`;

describe('dispute money', () => {
  it('counts done in full and partly as half, rounding once', () => {
    expect(donePercent(sampleMilestones, sampleMarks)).toBe(75);
    expect(
      donePercent(
        sampleMilestones,
        sampleMilestones.map((m) => m.otherMark),
      ),
    ).toBe(90);
    expect(donePercent([{ weightPercent: 15 }], ['partly'])).toBe(8);
    expect(donePercent(sampleMilestones, [])).toBe(0);
    expect(() => donePercent([{ weightPercent: 2.5 }], ['done'])).toThrow(RangeError);
  });

  it('counts the milestones both sides marked the same', () => {
    expect(agreedCount(sampleMilestones, sampleMarks)).toBe(4);
    expect(agreedCount(sampleMilestones, ['done', 'done', 'done', 'done', 'notDone'])).toBe(5);
  });

  it('values the work done and what is still due, never below zero', () => {
    expect(workValueRupees(18400, 75)).toBe(13800);
    expect(workValueRupees(18400, 120)).toBe(18400);
    expect(workValueRupees(999, 33)).toBe(330);
    expect(amountDueRupees(13800, 7200)).toBe(6600);
    expect(amountDueRupees(5000, 7200)).toBe(0);
    expect(() => amountDueRupees(-1, 0)).toThrow(RangeError);
  });

  it('suggests an offer for each plan', () => {
    expect(suggestedOfferRupees('endNow', sampleSettlementTerms)).toBe(6600);
    expect(suggestedOfferRupees('finish', sampleSettlementTerms)).toBe(11200);
  });

  it('adds the offer to what was paid', () => {
    expect(totalForJobRupees(7200, 6600)).toBe(13800);
    expect(() => totalForJobRupees(7200, 0.5)).toThrow(RangeError);
  });

  it('reads the offer field as digits only', () => {
    expect(parseOfferInput('6600')).toBe(6600);
    expect(parseOfferInput('₹6,600')).toBe(6600);
    expect(parseOfferInput('')).toBe(0);
    expect(parseOfferInput('123456789')).toBe(1234567);
  });
});

const reportProps: ReportProblemScreenProps = {
  job: sampleDisputeJob,
  onBack: jest.fn(),
  onUnsafe: jest.fn(),
  onReport: async () => {},
  onRecordWork: jest.fn(),
  onTalk: jest.fn(),
};

describe('ReportProblemScreen', () => {
  it('shows the exact design wording and waits for a reason', async () => {
    await renderScreen(<ReportProblemScreen {...reportProps} />);
    expect(screen.getByRole('header', { name: 'Report a problem' })).toBeOnTheScreen();
    for (const text of [
      'சிக்கலைத் தெரிவிக்கவும்',
      'Interior walls · 2 BHK · KT-20512',
      jobDetail,
      'I feel unsafe',
      'Leave now and call our safety line',
      'What went wrong? · என்ன தவறு?',
      "Work quality isn't right",
      "Work isn't finished",
      'Asking for more than agreed',
      'Damage to my home',
      'Worker stopped coming',
      'Something else',
      'Tell us what happened',
      'Add photos',
      "Reporting pauses the job and any payments until it's sorted. Ravi is told and can give their side. Work already done is recorded, so nobody loses what's fair.",
      'Choose what went wrong',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.getByTestId('problem-send')).toBeDisabled();
  });

  it('reports with the reason and details, then offers the next step', async () => {
    const onReport = jest.fn(async () => {});
    const onRecordWork = jest.fn();
    await renderScreen(
      <ReportProblemScreen {...reportProps} onReport={onReport} onRecordWork={onRecordWork} />,
    );
    await fireEvent.press(screen.getByRole('radio', { name: "Work isn't finished" }));
    expect(screen.getByRole('radio', { name: "Work isn't finished" })).toBeChecked();
    expect(screen.queryByText('Choose what went wrong')).toBeNull();
    await fireEvent.changeText(screen.getByTestId('problem-details'), '  Kitchen not started ');
    await act(async () => {
      await fireEvent.press(screen.getByTestId('problem-send'));
    });
    expect(onReport).toHaveBeenCalledWith({ reason: 'unfinished', details: 'Kitchen not started' });
    expect(await screen.findByRole('header', { name: 'Job paused' })).toBeOnTheScreen();
    expect(screen.getByText('வேலை நிறுத்தி வைக்கப்பட்டது')).toBeOnTheScreen();
    expect(
      screen.getByText(
        "We've told Ravi. Next, record what's been done so far. Most problems are sorted between you in a few minutes.",
      ),
    ).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Talk to Ravi first' })).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Record the work done' }));
    expect(onRecordWork).toHaveBeenCalledTimes(1);
  });

  it('stays on the form when reporting fails', async () => {
    await renderScreen(
      <ReportProblemScreen
        {...reportProps}
        onReport={() => Promise.reject(new Error('offline'))}
      />,
    );
    await fireEvent.press(screen.getByRole('radio', { name: 'Damage to my home' }));
    await act(async () => {
      await fireEvent.press(screen.getByTestId('problem-send'));
    });
    expect(screen.getByTestId('problem-send')).toBeEnabled();
    expect(screen.queryByText('Job paused')).toBeNull();
  });

  it('opens the safety line', async () => {
    const onUnsafe = jest.fn();
    await renderScreen(<ReportProblemScreen {...reportProps} onUnsafe={onUnsafe} />);
    await fireEvent.press(screen.getByTestId('problem-unsafe'));
    expect(onUnsafe).toHaveBeenCalledTimes(1);
  });
});

const workProps: WorkRecordScreenProps = {
  job: sampleDisputeJob,
  milestones: sampleMilestones,
  initialMarks: sampleMarks,
  onBack: jest.fn(),
  onSave: async () => {},
  onSaved: jest.fn(),
};

describe('WorkRecordScreen', () => {
  it('shows the plan with both markings', async () => {
    await renderScreen(<WorkRecordScreen {...workProps} />);
    expect(screen.getByRole('header', { name: 'Record the work done' })).toBeOnTheScreen();
    for (const text of [
      'செய்த வேலையைப் பதிவு செய்யவும்',
      "Mark each part of the agreed plan. Ravi does the same on his phone. Where you agree, it's settled; where you differ, photos help decide.",
      'Move furniture, cover floors',
      '20% of the job',
      'Second coat, all rooms',
      'Ravi says: Not done · 3 photos',
      'Photos are time-stamped and saved with the job.',
      'Done, by your marking · 4 of 5 agreed',
      "Ravi's marking: 90%",
      "Next: agree what's fair to pay",
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.getAllByText('Agreed')).toHaveLength(4);
    expect(screen.getAllByText('Different')).toHaveLength(1);
    expect(screen.getByTestId('work-my-percent')).toHaveTextContent('75%');
    expect(screen.getByRole('button', { name: 'Partly, Second coat, all rooms' })).toBeSelected();
  });

  it('updates the agreement and percent as marks change, then saves them', async () => {
    const onSave = jest.fn(async () => {});
    const onSaved = jest.fn();
    await renderScreen(<WorkRecordScreen {...workProps} onSave={onSave} onSaved={onSaved} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Done, Second coat, all rooms' }));
    expect(screen.getByTestId('work-my-percent')).toHaveTextContent('90%');
    expect(screen.getByText('Done, by your marking · 5 of 5 agreed')).toBeOnTheScreen();
    expect(screen.queryByText('Different')).toBeNull();
    await act(async () => {
      await fireEvent.press(screen.getByTestId('work-next'));
    });
    expect(onSave).toHaveBeenCalledWith(['done', 'done', 'done', 'done', 'notDone']);
    expect(onSaved).toHaveBeenCalledTimes(1);
  });

  it('stays here when saving fails', async () => {
    const onSaved = jest.fn();
    await renderScreen(
      <WorkRecordScreen
        {...workProps}
        onSave={() => Promise.reject(new Error('offline'))}
        onSaved={onSaved}
      />,
    );
    await act(async () => {
      await fireEvent.press(screen.getByTestId('work-next'));
    });
    expect(onSaved).not.toHaveBeenCalled();
    expect(screen.getByTestId('work-next')).toBeEnabled();
  });

  it('cannot go on without a plan', async () => {
    await renderScreen(<WorkRecordScreen {...workProps} milestones={[]} />);
    expect(screen.getByTestId('work-next')).toBeDisabled();
    expect(screen.getByTestId('work-my-percent')).toHaveTextContent('0%');
  });
});

const settleProps: SettlementScreenProps = {
  job: sampleDisputeJob,
  terms: sampleSettlementTerms,
  onBack: jest.fn(),
  onSendOffer: async () => {},
  onAskReview: async () => {},
  onReviewOpened: jest.fn(),
  onPay: async () => {},
};

describe('SettlementScreen', () => {
  it('shows the figures and the offer form', async () => {
    await renderScreen(<SettlementScreen {...settleProps} />);
    expect(screen.getByRole('header', { name: 'Settle the payment' })).toBeOnTheScreen();
    for (const text of [
      'பணத் தீர்வு',
      'Agreed quote',
      rupees(18400),
      'Work done (agreed)',
      'From your work record',
      'about 75%',
      'Value of work done',
      rupees(13800),
      'Already paid',
      'Materials, paid at the start',
      `− ${rupees(7200)}`,
      'Fair amount still due',
      'What would you like to do?',
      "Ravi is paid for what's finished. You're free to hire someone else.",
      'Ravi finishes the remaining work',
      "You pay the rest when the work is complete and you've checked it.",
      'Your offer',
      'You can change the amount',
      `Ravi gets ${rupees(6600)} more, so ${rupees(13800)} in total for this job. Kaithozhil's fee applies only to what's actually paid.`,
      'Send offer to Ravi',
      "Can't agree? Ask Kaithozhil to review",
    ]) {
      expect(screen.getAllByText(text).length).toBeGreaterThan(0);
    }
    expect(screen.getByTestId('settle-due')).toHaveTextContent(rupees(6600));
    expect(screen.getByTestId('settle-amount')).toHaveDisplayValue('6600');
  });

  it('resets the offer for each plan, takes a typed amount and sends it', async () => {
    const onSendOffer = jest.fn(async () => {});
    await renderScreen(<SettlementScreen {...settleProps} onSendOffer={onSendOffer} />);
    await fireEvent.press(screen.getByTestId('settle-plan-finish'));
    expect(screen.getByTestId('settle-plan-finish')).toBeChecked();
    expect(screen.getByTestId('settle-amount')).toHaveDisplayValue('11200');
    await fireEvent.changeText(screen.getByTestId('settle-amount'), '₹10,000');
    expect(screen.getByTestId('settle-amount')).toHaveDisplayValue('10000');
    await act(async () => {
      await fireEvent.press(screen.getByTestId('settle-send'));
    });
    expect(onSendOffer).toHaveBeenCalledWith({ plan: 'finish', amountRupees: 10000 });
    expect(await screen.findByRole('header', { name: 'Offer sent to Ravi' })).toBeOnTheScreen();
    expect(
      screen.getByText(
        `Ravi finishes, then the rest is paid, ${rupees(10000)}. Ravi can accept, or reply with his own amount.`,
      ),
    ).toBeOnTheScreen();
    expect(screen.getByText('No reply? Ask Kaithozhil to review')).toBeOnTheScreen();
  });

  it('stays on the form when sending fails', async () => {
    await renderScreen(
      <SettlementScreen {...settleProps} onSendOffer={() => Promise.reject(new Error('x'))} />,
    );
    await act(async () => {
      await fireEvent.press(screen.getByTestId('settle-send'));
    });
    expect(screen.queryByText('Offer sent to Ravi')).toBeNull();
    expect(screen.getByTestId('settle-send')).toBeEnabled();
  });

  it('opens the case after asking for a review', async () => {
    const onReviewOpened = jest.fn();
    await renderScreen(<SettlementScreen {...settleProps} onReviewOpened={onReviewOpened} />);
    await act(async () => {
      await fireEvent.press(screen.getByTestId('settle-review'));
    });
    expect(onReviewOpened).toHaveBeenCalledTimes(1);
  });

  it('shows the agreed settlement with its pay button', async () => {
    const onPay = jest.fn(async () => {});
    await renderScreen(
      <SettlementScreen
        {...settleProps}
        onPay={onPay}
        initialState={{
          view: 'agreed',
          offer: { plan: 'endNow', amountRupees: 6600 },
          agreedAt: '6:42 PM',
        }}
      />,
    );
    expect(
      screen.getByRole('header', { name: 'Settled · both agreed at 6:42 PM' }),
    ).toBeOnTheScreen();
    expect(
      screen.getByText(
        `Pay ${rupees(6600)} to close the job. The job record shows the agreed work and amount.`,
      ),
    ).toBeOnTheScreen();
    await act(async () => {
      await fireEvent.press(screen.getByRole('button', { name: `Pay ${rupees(6600)}` }));
    });
    expect(onPay).toHaveBeenCalledWith(6600);
  });
});

const disputeProps: DisputeStatusScreenProps = {
  dispute: sampleDispute,
  onBack: jest.fn(),
  onMessageReviewer: jest.fn(),
  onPay: async () => {},
  onAppeal: jest.fn(),
};

describe('DisputeStatusScreen', () => {
  it('shows the case under review', async () => {
    const onMessageReviewer = jest.fn();
    await renderScreen(
      <DisputeStatusScreen {...disputeProps} onMessageReviewer={onMessageReviewer} />,
    );
    expect(screen.getByRole('header', { name: 'Case D-0312' })).toBeOnTheScreen();
    expect(screen.getByLabelText('Status: Under review')).toBeOnTheScreen();
    for (const text of [
      'புகார் நிலை',
      jobDetail,
      'Problem reported by Priya',
      'Sat 6:10 PM',
      'Work recorded by both',
      'Kaithozhil is reviewing',
      'now',
      'Decision and payment',
      'within [X] days',
      "What we're looking at",
      'Milestones agreed',
      '4 of 5',
      'Photos from Priya',
      'Photos from Ravi',
      'Messages in the job chat',
      '14',
      `${rupees(6600)} is on hold, not paid and not lost, until the decision. A reviewer may call you both. Please don't pay or ask for money outside the app.`,
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    await fireEvent.press(screen.getByRole('button', { name: 'Message the reviewer' }));
    expect(onMessageReviewer).toHaveBeenCalledTimes(1);
  });

  it('shows the decision and pays what it says is due', async () => {
    const onPay = jest.fn(async () => {});
    await renderScreen(
      <DisputeStatusScreen {...disputeProps} dispute={sampleDecidedDispute} onPay={onPay} />,
    );
    expect(screen.getByLabelText('Status: Decided')).toBeOnTheScreen();
    expect(
      screen.getByRole('header', {
        name: `Ravi is paid ${rupees(6600)} for the work done (75%)`,
      }),
    ).toBeOnTheScreen();
    for (const text of [
      'Decision · Mon 24 Nov',
      "Bedroom 2's second coat and the clean-up weren't finished, so they're not charged. The job is now closed.",
      'Priya pays now',
      "Counted in Ravi's earnings",
      "Kaithozhil's fee",
      'On paid amount only',
      'Disagree? Appeal within 7 days',
    ]) {
      expect(screen.getByText(text)).toBeOnTheScreen();
    }
    expect(screen.queryByText('Kaithozhil is reviewing')).toBeNull();
    await act(async () => {
      await fireEvent.press(
        screen.getByRole('button', { name: `Pay ${rupees(6600)} and close the job` }),
      );
    });
    expect(onPay).toHaveBeenCalledWith(6600);
  });
});
