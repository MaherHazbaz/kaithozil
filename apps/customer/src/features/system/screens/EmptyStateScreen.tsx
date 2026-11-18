import { PrimaryButton, type IconName } from '@kaithozhil/ui';

import { StateIllustration } from '../components/StateIllustration';
import { StateLayout } from '../components/StateLayout';
import { StateMessage } from '../components/StateMessage';
import { emptyStateCopy } from '../copy';

/**
 * The customer app's empty lists. The design also draws "Jobs" and
 * "Earnings", which belong to the worker app.
 */
export type EmptyListKind = keyof typeof emptyStateCopy;

const ICON: Record<EmptyListKind, IconName> = {
  bookings: 'inbox',
  search: 'searchX',
};

export type EmptyStateScreenProps = {
  kind: EmptyListKind;
  onAction?: () => void;
};

/** Shared · Empty list (design/source/EmptyState.dc.html). */
export function EmptyStateScreen({ kind, onAction }: EmptyStateScreenProps) {
  const copy = emptyStateCopy[kind];
  return (
    <StateLayout header={{ title: copy.heading, titleTamil: copy.headingTamil }}>
      <StateIllustration icon={ICON[kind]} tone="neutral" />
      <StateMessage title={copy.title} titleTamil={copy.titleTamil} titleSize={22}>
        {copy.body}
      </StateMessage>
      <PrimaryButton label={copy.action} onPress={onAction} />
    </StateLayout>
  );
}
