import {
  StateIllustration,
  AppText,
  InfoNote,
  PrimaryButton,
  SecondaryButton,
} from '@kaithozhil/ui';

import { StateLayout } from '../components/StateLayout';
import { StateMessage } from '../components/StateMessage';
import { noInternetCopy as copy } from '../copy';
import type { RecheckStatus } from '../hooks/useRecheck';

export type NoInternetScreenProps = {
  status: RecheckStatus;
  onRetry?: () => void;
  onOpenSettings?: () => void;
};

/** Shared · No internet (design/source/NoInternet.dc.html). */
export function NoInternetScreen({ status, onRetry, onOpenSettings }: NoInternetScreenProps) {
  const checking = status === 'checking';
  return (
    <StateLayout
      footer={
        <>
          {checking ? (
            <PrimaryButton label={copy.checking} icon="loader" iconSize={18} disabled />
          ) : (
            <PrimaryButton label={copy.tryAgain} icon="rotateCcw" iconSize={18} onPress={onRetry} />
          )}
          <SecondaryButton label={copy.openSettings} icon="settings" onPress={onOpenSettings} />
        </>
      }
    >
      <StateIllustration icon="wifiOff" tone="neutral" ripple={checking} />
      <StateMessage title={copy.title} titleTamil={copy.titleTamil}>
        {copy.body}
      </StateMessage>
      {status === 'still' ? (
        <InfoNote tone="warning" icon="alertCircle">
          {copy.stillOffline}
        </InfoNote>
      ) : null}
      <InfoNote tone="info" icon="phone">
        {copy.helplineBefore}
        <AppText weight={700}>{copy.helplineNumber}</AppText>
        {copy.helplineAfter}
      </InfoNote>
    </StateLayout>
  );
}
