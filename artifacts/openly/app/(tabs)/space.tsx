import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { GatedScreen, PrimaryButton, ScreenHeading, Tag } from '@/components/AppUI';
import { INTEREST_SUGGESTIONS, useOpenly } from '@/state/AppContext';
import { useColors } from '@/hooks/useColors';

export default function SpaceScreen() {
  const colors = useColors();
  const { data, updateProfile, toggleInterest, clearAllData } = useOpenly();
  const [customInterest, setCustomInterest] = useState('');
  const [shareError, setShareError] = useState('');
  const [clearError, setClearError] = useState('');

  const addInterest = () => {
    const interest = customInterest.trim();
    if (!interest || data.profile.interests.includes(interest)) return;
    void toggleInterest(interest);
    setCustomInterest('');
  };

  const shareProfile = () => {
    const profile = data.profile;
    const details = [
      profile.displayName && `Name: ${profile.displayName}`,
      profile.identity && `Identity: ${profile.identity}`,
      profile.pronouns && `Pronouns: ${profile.pronouns}`,
      profile.region && `Area: ${profile.region}`,
      profile.interests.length && `Interests: ${profile.interests.join(', ')}`,
      profile.about && `About me: ${profile.about}`,
    ].filter(Boolean);

    if (!details.length) {
      Alert.alert('Nothing to share yet', 'Add the details you want to include first.');
      return;
    }

    Alert.alert(
      'Review before sharing',
      `Only these details will be shared through your device’s share menu:\n\n${details.join('\n')}\n\nOpenly will not publish them to a profile or community.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue to share',
          onPress: () => {
            void Share.share({ message: `My Openly introduction\n\n${details.join('\n')}` })
              .then(() => setShareError(''))
              .catch(() => setShareError('Your device could not open the share menu.'));
          },
        },
      ],
    );
  };

  const confirmClearData = () => {
    Alert.alert(
      'Clear all on-device data?',
      'This permanently removes your profile, interests, saved links, personal links, safety checklist, and age confirmation from this device. It cannot remove anything you have already shared outside Openly.',
      [
        { text: 'Keep my data', style: 'cancel' },
        {
          text: 'Clear everything',
          style: 'destructive',
          onPress: () => {
            void clearAllData().then(saved => {
              setClearError(
                saved ? '' : 'Your data could not be cleared. Please try again.',
              );
            });
          },
        },
      ],
    );
  };

  return (
    <GatedScreen>
      <KeyboardAwareScrollViewCompat
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        bottomOffset={34}
      >
        <ScreenHeading
          eyebrow="ONLY WHAT YOU CHOOSE"
          title="My space"
          subtitle="Keep your identity and interests in your own words. Nothing is public by default."
        />

        <View style={[styles.privacyCard, { backgroundColor: colors.primary }]}>
          <Ionicons name="lock-closed-outline" size={19} color={colors.primaryForeground} />
          <View style={styles.privacyCopy}>
            <Text style={[styles.privacyTitle, { color: colors.primaryForeground }]}>
              Your details stay here
            </Text>
            <Text style={[styles.privacyText, { color: colors.primaryForeground }]}>
              This profile stays on your device and is not a public account. Openly does not encrypt it separately, so use a device lock and avoid shared devices.
            </Text>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
            How you describe yourself
          </Text>
          <ProfileField
            label="Name or display name"
            placeholder="What should people call you?"
            value={data.profile.displayName}
            onChangeText={displayName => void updateProfile({ displayName })}
          />
          <ProfileField
            label="Gender or identity"
            placeholder="Use your own words, or leave blank"
            value={data.profile.identity}
            onChangeText={identity => void updateProfile({ identity })}
          />
          <ProfileField
            label="Pronouns"
            placeholder="Optional"
            value={data.profile.pronouns}
            onChangeText={pronouns => void updateProfile({ pronouns })}
          />
          <ProfileField
            label="General area"
            placeholder="Optional; keep it broad"
            value={data.profile.region}
            onChangeText={region => void updateProfile({ region })}
          />
          <ProfileField
            label="A little about you"
            placeholder="What would you like someone to know?"
            value={data.profile.about}
            onChangeText={about => void updateProfile({ about })}
            multiline
          />
        </View>

        <View style={styles.formSection}>
          <View style={styles.sectionHeading}>
            <View style={styles.sectionCopy}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Interests & needs
              </Text>
              <Text style={[styles.sectionSubtext, { color: colors.mutedForeground }]}>
                Pick any that feel right, or write your own.
              </Text>
            </View>
            <Ionicons name="heart-outline" size={20} color={colors.primary} />
          </View>
          <View style={styles.interestTags}>
            {INTEREST_SUGGESTIONS.map(interest => (
              <Tag
                key={interest}
                label={interest}
                selected={data.profile.interests.includes(interest)}
                onPress={() => void toggleInterest(interest)}
              />
            ))}
            {data.profile.interests
              .filter(interest => !INTEREST_SUGGESTIONS.includes(interest))
              .map(interest => (
                <Tag
                  key={interest}
                  label={interest}
                  selected
                  onPress={() => void toggleInterest(interest)}
                />
              ))}
          </View>
          <View style={styles.customInterestRow}>
            <TextInput
              value={customInterest}
              onChangeText={setCustomInterest}
              placeholder="Add your own interest"
              placeholderTextColor={colors.mutedForeground}
              style={[
                styles.input,
                styles.customInterestInput,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.input,
                  color: colors.foreground,
                },
              ]}
              returnKeyType="done"
              onSubmitEditing={addInterest}
              accessibilityLabel="Add a personal interest"
            />
            <PrimaryButton
              label="Add"
              icon="add"
              onPress={addInterest}
              disabled={!customInterest.trim()}
            />
          </View>
          <Text style={[styles.privacyFootnote, { color: colors.mutedForeground }]}>
            Your chosen interests, including private or specific ones, are not sent anywhere unless you choose to share them.
          </Text>
        </View>

        <View
          style={[
            styles.shareCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.shareHeading}>
            <View style={[styles.shareIcon, { backgroundColor: colors.secondary }]}>
              <Ionicons name="share-social-outline" size={19} color={colors.primary} />
            </View>
            <View style={styles.sectionCopy}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Share only after review
              </Text>
              <Text style={[styles.sectionSubtext, { color: colors.mutedForeground }]}>
                Preview the details, then choose an app or person on your device.
              </Text>
            </View>
          </View>
          {shareError ? (
            <Text style={[styles.formError, { color: colors.destructive }]}>{shareError}</Text>
          ) : null}
          <PrimaryButton
            label="Review & share my intro"
            icon="arrow-forward"
            onPress={shareProfile}
          />
          <Text style={[styles.privacyFootnote, { color: colors.mutedForeground }]}>
            Once you send something outside Openly, it cannot be recalled here.
          </Text>
        </View>

        <View
          style={[
            styles.clearCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.shareHeading}>
            <View style={[styles.shareIcon, { backgroundColor: colors.muted }]}>
              <Ionicons name="trash-outline" size={19} color={colors.destructive} />
            </View>
            <View style={styles.sectionCopy}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                Remove your local data
              </Text>
              <Text style={[styles.sectionSubtext, { color: colors.mutedForeground }]}>
                Clear your profile, interests, saved links, and checklist from this device.
              </Text>
            </View>
          </View>
          {clearError ? (
            <Text style={[styles.formError, { color: colors.destructive }]}>
              {clearError}
            </Text>
          ) : null}
          <Pressable
            onPress={confirmClearData}
            accessibilityRole="button"
            accessibilityLabel="Clear all Openly data from this device"
            style={({ pressed }) => [
              styles.clearButton,
              {
                borderColor: colors.destructive,
                opacity: pressed ? 0.72 : 1,
              },
            ]}
          >
            <Ionicons name="trash-outline" size={17} color={colors.destructive} />
            <Text style={[styles.clearButtonText, { color: colors.destructive }]}>
              Clear all on-device data
            </Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollViewCompat>
    </GatedScreen>
  );
}

function ProfileField({
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
}) {
  const colors = useColors();
  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.fieldLabel, { color: colors.foreground }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            borderColor: colors.input,
            color: colors.foreground,
          },
          multiline && styles.aboutInput,
        ]}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        onChangeText={onChangeText}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        accessibilityLabel={label}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 24, paddingBottom: 116, gap: 19 },
  privacyCard: { borderRadius: 17, padding: 15, flexDirection: 'row', gap: 12 },
  privacyCopy: { flex: 1, gap: 4 },
  privacyTitle: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  privacyText: { fontSize: 12, lineHeight: 18, opacity: 0.88, fontFamily: 'Inter_400Regular' },
  formSection: { gap: 13 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  sectionSubtext: { fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular' },
  fieldGroup: { gap: 6 },
  fieldLabel: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  input: {
    minHeight: 46,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  aboutInput: { minHeight: 86, lineHeight: 19 },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectionCopy: { flex: 1, gap: 4 },
  interestTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  customInterestRow: { gap: 9 },
  customInterestInput: { width: '100%' },
  privacyFootnote: { fontSize: 11, lineHeight: 17, fontFamily: 'Inter_400Regular' },
  shareCard: { borderWidth: 1, borderRadius: 19, padding: 16, gap: 14 },
  shareHeading: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  shareIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formError: { fontSize: 12, lineHeight: 17, fontFamily: 'Inter_500Medium' },
  clearCard: { borderWidth: 1, borderRadius: 19, padding: 16, gap: 14 },
  clearButton: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  clearButtonText: { fontSize: 12, fontFamily: 'Inter_700Bold' },
});

