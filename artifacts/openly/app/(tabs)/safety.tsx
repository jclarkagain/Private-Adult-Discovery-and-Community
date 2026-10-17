import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { GatedScreen, ScreenHeading } from '@/components/AppUI';
import { useOpenly } from '@/state/AppContext';
import { useColors } from '@/hooks/useColors';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const CHECKLIST = [
  {
    id: 'boundaries',
    title: 'Talk through boundaries and expectations first',
    detail: 'Consent should be informed, specific, mutual, and reversible.',
  },
  {
    id: 'public-place',
    title: 'Choose a first-meeting place that feels safe',
    detail: 'Make your own plan for getting there and leaving.',
  },
  {
    id: 'trusted-person',
    title: 'Tell someone you trust about your plan',
    detail: 'Share only the details you are comfortable sharing.',
  },
  {
    id: 'photos',
    title: 'Agree on photo and content boundaries',
    detail: 'Never share another person’s intimate content without clear consent.',
  },
  {
    id: 'location',
    title: 'Keep your exact location private until you decide',
    detail: 'Openly does not access your location or add a map.',
  },
  {
    id: 'health',
    title: 'Discuss health, safer-sex, and activity-specific risks',
    detail: 'Use trusted health information and make decisions together.',
  },
];

export default function SafetyScreen() {
  const colors = useColors();
  const { data, toggleSafetyCheck } = useOpenly();
  const completed = CHECKLIST.filter(item => data.safetyChecks[item.id]).length;

  return (
    <GatedScreen>
      <KeyboardAwareScrollViewCompat
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        bottomOffset={24}
      >
        <ScreenHeading
          eyebrow="ON YOUR TERMS"
          title="Safety & consent"
          subtitle="Practical reminders for meeting, connecting, and sharing with care."
        />

        <View style={[styles.progressCard, { backgroundColor: colors.primary }]}>
          <View style={styles.progressIcon}>
            <Ionicons name="shield-checkmark-outline" size={22} color={colors.primaryForeground} />
          </View>
          <View style={styles.progressCopy}>
            <Text style={[styles.progressTitle, { color: colors.primaryForeground }]}>
              Your plan, your call
            </Text>
            <Text style={[styles.progressText, { color: colors.primaryForeground }]}>
              {completed} of {CHECKLIST.length} reminders checked off
            </Text>
          </View>
        </View>

        <View style={styles.checklist}>
          {CHECKLIST.map(item => {
            const checked = Boolean(data.safetyChecks[item.id]);
            return (
              <Pressable
                key={item.id}
                onPress={() => void toggleSafetyCheck(item.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked }}
                style={({ pressed }) => [
                  styles.checkItem,
                  {
                    backgroundColor: checked ? colors.secondary : colors.card,
                    borderColor: checked ? colors.primary : colors.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor: checked ? colors.primary : 'transparent',
                      borderColor: checked ? colors.primary : colors.input,
                    },
                  ]}
                >
                  {checked ? (
                    <Ionicons name="checkmark" size={15} color={colors.primaryForeground} />
                  ) : null}
                </View>
                <View style={styles.checkCopy}>
                  <Text style={[styles.checkTitle, { color: colors.foreground }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.checkDetail, { color: colors.mutedForeground }]}>
                    {item.detail}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View
          style={[
            styles.privacyCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={[styles.privacyIcon, { backgroundColor: colors.secondary }]}>
            <Ionicons name="eye-off-outline" size={18} color={colors.primary} />
          </View>
          <Text style={[styles.privacyTitle, { color: colors.foreground }]}>
            Privacy by design
          </Text>
          <Text style={[styles.privacyBody, { color: colors.mutedForeground }]}>
            This version keeps your profile, interests, saved sites, and checklist on your device. It does not create a public profile, collect location, or send reports to an external site.
          </Text>
        </View>

        <View style={[styles.guidance, { backgroundColor: colors.muted }]}>
          <Text style={[styles.guidanceTitle, { color: colors.foreground }]}>
            A note about the directory
          </Text>
          <Text style={[styles.guidanceBody, { color: colors.mutedForeground }]}>
            The date on an official link only means its destination page was checked. It does not verify current members, ads, events, safety, or availability. Use each site’s own privacy, block, and report controls, and trust your judgment.
          </Text>
        </View>
      </KeyboardAwareScrollViewCompat>
    </GatedScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 24, paddingBottom: 116, gap: 17 },
  progressCard: {
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCopy: { gap: 4 },
  progressTitle: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  progressText: { fontSize: 12, opacity: 0.85, fontFamily: 'Inter_400Regular' },
  checklist: { gap: 9 },
  checkItem: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkCopy: { flex: 1, gap: 4 },
  checkTitle: { fontSize: 13, lineHeight: 19, fontFamily: 'Inter_600SemiBold' },
  checkDetail: { fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular' },
  privacyCard: { borderWidth: 1, borderRadius: 18, padding: 16, gap: 10 },
  privacyIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyTitle: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  privacyBody: { fontSize: 12, lineHeight: 19, fontFamily: 'Inter_400Regular' },
  guidance: { borderRadius: 16, padding: 15, gap: 7 },
  guidanceTitle: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  guidanceBody: { fontSize: 11, lineHeight: 17, fontFamily: 'Inter_400Regular' },
});

