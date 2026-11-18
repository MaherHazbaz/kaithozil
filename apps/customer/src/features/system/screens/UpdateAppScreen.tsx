import { AppText, Card, Icon, Logo, PrimaryButton, Tappable, color } from '@kaithozhil/ui';
import { useEffect } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';

import { StateLayout } from '../components/StateLayout';
import { StateMessage } from '../components/StateMessage';
import { updateAppCopy as copy } from '../copy';

export type UpdateAppScreenProps = {
  /** "required": this version may no longer be used. "optional": a newer one exists. */
  kind: 'required' | 'optional';
  onUpdate?: () => void;
  /** Optional updates only. */
  onLater?: () => void;
};

/** Shared · Update required (design/source/UpdateApp.dc.html). */
export function UpdateAppScreen({ kind, onUpdate, onLater }: UpdateAppScreenProps) {
  const required = kind === 'required';

  // Android's system Back button would otherwise close this screen and let an
  // unsafe version keep running. Returning true tells Android "handled".
  useEffect(() => {
    if (!required) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => subscription.remove();
  }, [required]);

  return (
    <StateLayout
      footer={
        <>
          <PrimaryButton label={copy.updateNow} icon="download" iconSize={18} onPress={onUpdate} />
          {required ? null : (
            <Tappable onPress={onLater} accessibilityRole="button" style={styles.later}>
              <AppText size={14} weight={700} color={color.muted}>
                {copy.later}
              </AppText>
            </Tappable>
          )}
        </>
      }
    >
      <View style={styles.logo}>
        <Logo size={104} radius="logoWelcome" shadow="logoUpdate" />
      </View>
      <StateMessage
        title={required ? copy.headingRequired : copy.headingOptional}
        titleTamil={copy.headingTamil}
      >
        {required ? copy.bodyRequired : copy.bodyOptional}
      </StateMessage>
      <Card style={styles.card}>
        <AppText size={14} weight={800}>
          {copy.whatsNew}
        </AppText>
        {copy.newItems.map((item) => (
          <View key={item} style={styles.item}>
            <Icon name="check" size={16} color={color.purple} strokeWidth={2.5} />
            <AppText size={13} lineHeight={13 * 1.4} style={styles.itemText}>
              {item}
            </AppText>
          </View>
        ))}
        <AppText size={11} color={color.muted}>
          {copy.versionLine}
        </AppText>
      </Card>
    </StateLayout>
  );
}

const styles = StyleSheet.create({
  logo: { alignSelf: 'center', flexShrink: 0 },
  card: { padding: 14, gap: 10, flexShrink: 0 },
  item: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  itemText: { flex: 1 },
  later: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
});
