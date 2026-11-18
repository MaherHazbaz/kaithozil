import { useState } from 'react';

import { parseOfferInput, suggestedOfferRupees } from '../disputeMoney';
import type { SettlementPlan, SettlementState, SettlementTerms } from '../types';

/**
 * The "Customer proposes" form on Settle the payment, and the step the
 * settlement is at.
 *
 * Choosing a plan resets the offer to that plan's suggested amount, as the
 * design does (₹6,600 to end now, ₹11,200 to let the worker finish); the
 * customer can then type a different amount.
 */
export function useSettlement(terms: SettlementTerms, initialState: SettlementState) {
  const [state, setState] = useState<SettlementState>(initialState);
  const [plan, setPlan] = useState<SettlementPlan>('endNow');
  const [amountRupees, setAmountRupees] = useState(() => suggestedOfferRupees('endNow', terms));

  const choosePlan = (next: SettlementPlan) => {
    setPlan(next);
    setAmountRupees(suggestedOfferRupees(next, terms));
  };

  const typeAmount = (text: string) => setAmountRupees(parseOfferInput(text));

  return { state, setState, plan, choosePlan, amountRupees, typeAmount };
}
