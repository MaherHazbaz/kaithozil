import {
  AppText,
  Card,
  Icon,
  SecondaryButton,
  Tappable,
  color,
  radius,
  shadow,
} from '@kaithozhil/ui';
import { StyleSheet, View } from 'react-native';

import { PageLayout } from '@/components/PageLayout';
import { JobLine } from '../components/JobLine';
import { supportCopy as copy, supportIssues, type SupportIssue } from '../copy';
import type { SupportJob } from '../types';

export type SupportScreenProps = {
  /** The customer's most recent job. The card is left out when there is none. */
  lastJob?: SupportJob;
  onBack: () => void;
  /** Opens a support ticket for the chosen issue. */
  onIssue?: (issue: SupportIssue) => void;
  onCall?: () => void;
  onWhatsApp?: () => void;
};

// Object.keys loses the key type; this keeps the design's order and the type.
const ISSUES = Object.keys(supportIssues) as SupportIssue[];

/** Customer · Help and support (design/source/Support.dc.html). */
export function SupportScreen({
  lastJob,
  onBack,
  onIssue,
  onCall,
  onWhatsApp,
}: SupportScreenProps) {
  return (
    <PageLayout title={copy.title} titleTamil={copy.titleTamil} onBack={onBack}>
      {lastJob ? (
        <Card style={styles.lastJob}>
          <AppText size={12} weight={700} color={color.muted}>
            {copy.lastJob}
          </AppText>
          <JobLine job={lastJob} />
        </Card>
      ) : null}

      <AppText size={14} weight={800} accessibilityRole="header">
        {copy.whatWentWrong}
      </AppText>

      {/* Shadow on the outer view; the inner one clips the rows to the rounded
          corners (in React Native, overflow: hidden would also clip the shadow). */}
      <View style={styles.issuesShadow}>
        <View style={styles.issues}>
          {ISSUES.map((issue) => (
            <IssueRow key={issue} issue={issue} onPress={() => onIssue?.(issue)} />
          ))}
        </View>
      </View>

      <View style={styles.pair}>
        <View style={styles.half}>
          <SecondaryButton label={copy.call} icon="phone" onPress={onCall} testID="support-call" />
        </View>
        <View style={styles.half}>
          <SecondaryButton
            label={copy.whatsApp}
            icon="messageSquare"
            onPress={onWhatsApp}
            testID="support-whatsapp"
          />
        </View>
      </View>

      <AppText size={12} color={color.muted} align="center">
        {copy.hours}
      </AppText>
    </PageLayout>
  );
}

/** One issue: a 48pt row with a chevron. "I feel unsafe" is purple with a shield. */
function IssueRow({ issue, onPress }: { issue: SupportIssue; onPress: () => void }) {
  const unsafe = issue === 'unsafe';
  return (
    <Tappable
      onPress={onPress}
      accessibilityRole="button"
      style={styles.issue}
      testID={`support-issue-${issue}`}
    >
      {unsafe ? <Icon name="shield" size={18} color={color.purple} /> : null}
      <AppText
        size={14}
        weight={unsafe ? 800 : 600}
        color={unsafe ? color.purple : color.ink}
        style={styles.issueText}
      >
        {supportIssues[issue]}
      </AppText>
      <Icon name="chevronRight" size={18} color={color.muted} />
    </Tappable>
  );
}

const styles = StyleSheet.create({
  lastJob: { padding: 14, gap: 10 },
  issuesShadow: { borderRadius: radius.card, boxShadow: shadow.card },
  issues: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: color.borderSoft,
    backgroundColor: color.white,
    overflow: 'hidden',
  },
  issue: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    backgroundColor: color.white,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  issueText: { flex: 1 },
  pair: { flexDirection: 'row', gap: 8 },
  half: { flex: 1 },
});
