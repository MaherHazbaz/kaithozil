import {
  AppText,
  Avatar,
  BottomNav,
  Card,
  ListRow,
  ScreenBackground,
  Tappable,
  color,
  radius,
  shadow,
  spacing,
  type as typeStyle,
} from '@kaithozhil/ui';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CUSTOMER_TABS, type CustomerTab } from '@/features/navigation/customerTabs';

import { profileCopy } from '../copy';

export type ProfileRow =
  'addresses' | 'business' | 'payments' | 'language' | 'safety' | 'help' | 'terms' | 'logOut';

export type ProfileScreenProps = {
  /** Shown data. The route passes the design's sample values until Supabase exists (Sprint 2). */
  name: string;
  initials: string;
  /** Already formatted for display, e.g. "+91 98400 12345". */
  phone: string;
  /** e.g. "Home · Anna Nagar, and 1 more". */
  addressesSummary: string;
  onEdit?: () => void;
  onRow?: (row: ProfileRow) => void;
  onTab?: (tab: CustomerTab) => void;
};

/** Customer profile (design/source/Profile.dc.html). */
export function ProfileScreen({
  name,
  initials,
  phone,
  addressesSummary,
  onEdit,
  onRow,
  onTab,
}: ProfileScreenProps) {
  const insets = useSafeAreaInsets();

  const rows: {
    key: ProfileRow;
    icon: Parameters<typeof ListRow>[0]['icon'];
    title: string;
    subtitle?: string;
  }[] = [
    {
      key: 'addresses',
      icon: 'mapPin',
      title: profileCopy.savedAddresses,
      subtitle: addressesSummary,
    },
    {
      key: 'business',
      icon: 'building',
      title: profileCopy.businessAccount,
      subtitle: profileCopy.businessAccountDetail,
    },
    {
      key: 'payments',
      icon: 'wallet',
      title: profileCopy.payments,
      subtitle: profileCopy.paymentsDetail,
    },
    {
      key: 'language',
      icon: 'globe',
      title: profileCopy.language,
      subtitle: profileCopy.languageDetail,
    },
    {
      key: 'safety',
      icon: 'shield',
      title: profileCopy.safety,
      subtitle: profileCopy.safetyDetail,
    },
    { key: 'help', icon: 'helpCircle', title: profileCopy.help, subtitle: profileCopy.helpDetail },
    { key: 'terms', icon: 'file', title: profileCopy.terms },
    { key: 'logOut', icon: 'logOut', title: profileCopy.logOut },
  ];

  return (
    <ScreenBackground>
      {/* Dark status bar icons over the light page. */}
      <StatusBar style="dark" />

      <View style={[styles.header, { paddingTop: 22 + insets.top }]}>
        <AppText
          size={typeStyle.screenTitle.size}
          weight={typeStyle.screenTitle.weight}
          accessibilityRole="header"
        >
          {profileCopy.title}
        </AppText>
        <AppText size={12} color={color.muted}>
          {profileCopy.titleTamil}
        </AppText>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.personCard}>
          <View style={styles.person}>
            <Avatar initials={initials} size={52} tone="primary" fontSize={17} />
            <View style={styles.personText}>
              <AppText size={17} weight={800}>
                {name}
              </AppText>
              <AppText size={13} color={color.muted}>
                {phone}
              </AppText>
            </View>
            <Tappable
              onPress={onEdit}
              accessibilityRole="link"
              accessibilityLabel={profileCopy.editLabel}
              // The link is one short word; hitSlop makes its touch area 44pt
              // without changing how it looks.
              hitSlop={{ top: 14, bottom: 14, left: 12, right: 12 }}
              testID="profile-edit"
            >
              <AppText size={14} weight={700} color={color.purple} underline>
                {profileCopy.edit}
              </AppText>
            </Tappable>
          </View>
        </Card>

        {/* Shadow on the outer view; the inner view clips the rows to the corners. */}
        <View style={styles.listShadow}>
          <View style={styles.list}>
            {rows.map((row) => (
              <ListRow
                key={row.key}
                icon={row.icon}
                title={row.title}
                subtitle={row.subtitle}
                // Log out ends the list and has no chevron, as in the design.
                chevron={row.key !== 'logOut'}
                onPress={() => onRow?.(row.key)}
                testID={`profile-${row.key}`}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomNav
        items={CUSTOMER_TABS}
        activeKey="profile"
        onSelect={(next) => onTab?.(next)}
        bottomInset={insets.bottom}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.screenPadding,
  },
  scroll: {
    flex: 1,
  },
  body: {
    paddingTop: 16,
    paddingHorizontal: spacing.screenPadding,
    // Room for the list's shadow above the bottom navigation.
    paddingBottom: 16,
    gap: 12,
  },
  personCard: {
    padding: 14,
  },
  person: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  personText: {
    flexGrow: 1,
    flexShrink: 1,
    gap: 2,
  },
  listShadow: {
    borderRadius: radius.card,
    boxShadow: shadow.card,
  },
  list: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: color.borderSoft,
    backgroundColor: color.white,
    overflow: 'hidden',
  },
});
