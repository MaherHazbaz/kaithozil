import {
  AppText,
  Card,
  Icon,
  IconBox,
  SegmentedControl,
  Tappable,
  color,
  radius,
  shadow,
  type IconName,
} from '@kaithozhil/ui';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PageLayout } from '@/components/PageLayout';
import { legalCopy as copy } from '../copy';

export type LegalTab = 'terms' | 'privacy' | 'data';
export type DataAction = (typeof copy.dataActions)[number]['key'];

export type LegalScreenProps = {
  /** Which tab shows first. Default Terms, as in the design. */
  initialTab?: LegalTab;
  onBack: () => void;
  onDataAction?: (action: DataAction) => void;
  onReadFull?: () => void;
};

const TABS = [
  { key: 'terms', label: copy.tabs.terms },
  { key: 'privacy', label: copy.tabs.privacy },
  { key: 'data', label: copy.tabs.data },
] as const;

/** Shared · Terms and privacy (design/source/Legal.dc.html). */
export function LegalScreen({
  initialTab = 'terms',
  onBack,
  onDataAction,
  onReadFull,
}: LegalScreenProps) {
  const [tab, setTab] = useState<LegalTab>(initialTab);

  return (
    <PageLayout title={copy.title} titleTamil={copy.titleTamil} onBack={onBack}>
      <SegmentedControl
        segments={TABS}
        selectedKey={tab}
        onSelect={setTab}
        accessibilityLabel={copy.sectionLabel}
        fontSize={13}
        raised
        testID="legal-tab"
      />

      {tab === 'terms' ? (
        <>
          <Intro>{copy.termsIntro}</Intro>
          {copy.terms.map((point) => (
            <PointCard key={point.title} {...point} />
          ))}
        </>
      ) : null}

      {tab === 'privacy'
        ? copy.privacy.map((point) => <PointCard key={point.title} {...point} />)
        : null}

      {tab === 'data' ? (
        <>
          <Intro>{copy.dataIntro}</Intro>
          {/* Shadow on the outer view, rows clipped to the corners inside it. */}
          <View style={styles.listShadow}>
            <View style={styles.list}>
              {copy.dataActions.map((action) => (
                <Tappable
                  key={action.key}
                  onPress={() => onDataAction?.(action.key)}
                  accessibilityRole="button"
                  accessibilityLabel={action.title}
                  accessibilityHint={action.detail}
                  style={styles.action}
                  testID={`legal-${action.key}`}
                >
                  <IconBox icon={action.icon} tone="lavender" size={36} />
                  <View style={styles.actionText}>
                    <AppText size={14} weight={700}>
                      {action.title}
                    </AppText>
                    <AppText size={12} color={color.muted}>
                      {action.detail}
                    </AppText>
                  </View>
                  <Icon name="chevronRight" size={18} color={color.muted} />
                </Tappable>
              ))}
            </View>
          </View>
        </>
      ) : null}

      <View style={styles.footer}>
        <Tappable
          onPress={onReadFull}
          accessibilityRole="link"
          style={styles.readFull}
          testID="legal-read-full"
        >
          <AppText size={14} weight={700} color={color.purple}>
            {copy.readFull}
          </AppText>
        </Tappable>
        <AppText size={11} color={color.muted} align="center">
          {copy.versionLine}
        </AppText>
      </View>
    </PageLayout>
  );
}

function Intro({ children }: { children: string }) {
  return (
    <AppText size={13} lineHeight={13 * 1.45} color={color.muted}>
      {children}
    </AppText>
  );
}

function PointCard({
  icon,
  title,
  titleTamil,
  body,
}: {
  icon: IconName;
  title: string;
  titleTamil: string;
  body: string;
}) {
  return (
    <Card style={styles.point}>
      <View style={styles.pointHead}>
        <IconBox icon={icon} tone="lavender" size={36} />
        <View style={styles.shrink}>
          <AppText size={15} weight={800} accessibilityRole="header">
            {title}
          </AppText>
          <AppText size={11} color={color.muted}>
            {titleTamil}
          </AppText>
        </View>
      </View>
      <AppText size={13} lineHeight={13 * 1.5}>
        {body}
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  // The source sets gap 10 and then overrides it with 6.
  point: { padding: 14, gap: 6 },
  pointHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  shrink: { flexShrink: 1 },
  listShadow: { borderRadius: radius.choiceCard, boxShadow: shadow.card },
  list: {
    borderRadius: radius.choiceCard,
    borderWidth: 1,
    borderColor: color.borderSoft,
    backgroundColor: color.white,
    overflow: 'hidden',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  actionText: { flex: 1, gap: 1 },
  footer: { alignItems: 'center', gap: 4, paddingTop: 4 },
  readFull: { minHeight: 44, justifyContent: 'center' },
});
