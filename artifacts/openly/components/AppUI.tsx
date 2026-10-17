import React, { ReactNode } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useOpenly } from '@/state/AppContext';

export function AppScreen({ children }: { children: ReactNode }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const webInsets =
    Platform.OS === 'web'
      ? { paddingTop: Math.max(67, insets.top), paddingBottom: 34 }
      : undefined;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={[styles.screen, webInsets]}>{children}</View>
    </SafeAreaView>
  );
}

export function GatedScreen({ children }: { children: ReactNode }) {
  const colors = useColors();
  const { data, isLoading, loadError, saveError, retryStorage } = useOpenly();
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <AppScreen>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
            Opening your private space
          </Text>
        </View>
      </AppScreen>
    );
  }

  if (loadError) {
    return (
      <AppScreen>
        <View style={styles.recovery}>
          <View style={[styles.recoveryIcon, { backgroundColor: colors.muted }]}>
            <Ionicons name="lock-closed-outline" size={25} color={colors.primary} />
          </View>
          <Text style={[styles.recoveryTitle, { color: colors.foreground }]}>
            Your saved space could not be opened
          </Text>
          <Text style={[styles.recoveryText, { color: colors.mutedForeground }]}>
            Openly could not read its on-device storage. Your saved details have
            not been replaced.
          </Text>
          <PrimaryButton label="Try again" onPress={() => void retryStorage()} />
        </View>
      </AppScreen>
    );
  }

  if (!data.adultConfirmed) {
    return <AgeGate />;
  }

  return (
    <AppScreen>
      <View style={styles.content}>
        {saveError ? (
          <View
            style={[
              styles.saveWarning,
              {
                backgroundColor: colors.accent,
                marginTop: Platform.OS === 'web' ? 0 : insets.top > 0 ? 0 : 8,
              },
            ]}
          >
            <Text style={[styles.saveWarningText, { color: colors.accentForeground }]}>
              A change could not be saved on this device.
            </Text>
            <Pressable
              onPress={() => void retryStorage()}
              accessibilityRole="button"
              accessibilityLabel="Retry local storage"
            >
              <Text style={[styles.saveWarningAction, { color: colors.primary }]}>
                Retry
              </Text>
            </Pressable>
          </View>
        ) : null}
        {children}
      </View>
    </AppScreen>
  );
}

function AgeGate() {
  const colors = useColors();
  const { confirmAdult } = useOpenly();
  const [isSaving, setIsSaving] = React.useState(false);

  const handleConfirm = async () => {
    setIsSaving(true);
    const saved = await confirmAdult();
    setIsSaving(false);
    if (!saved) {
      Alert.alert(
        'Could not save confirmation',
        'Please retry before continuing. Your adult confirmation is stored only on this device.',
      );
    }
  };

  return (
    <AppScreen>
      <View style={styles.ageGate}>
        <View style={[styles.ageMark, { backgroundColor: colors.secondary }]}>
          <Ionicons name="key-outline" size={34} color={colors.primary} />
        </View>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>
          PRIVATE BY DEFAULT
        </Text>
        <Text style={[styles.ageTitle, { color: colors.foreground }]}>
          A space to explore openly.
        </Text>
        <Text style={[styles.bodyLarge, { color: colors.mutedForeground }]}>
          A personal, inclusive guide for adult connections, community, and the
          interests you choose to keep.
        </Text>
        <View
          style={[
            styles.ageNotice,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
          <Text style={[styles.ageNoticeText, { color: colors.foreground }]}>
            Openly is for people 18 and older. Some external sites may contain
            explicit material or user-posted listings.
          </Text>
        </View>
        <Text style={[styles.bodySmall, { color: colors.mutedForeground }]}>
          This is an age self-attestation, not identity or age verification.
          Your profile, interests, and saved links stay on this device unless
          you choose to share them.
        </Text>
        <PrimaryButton
          label={isSaving ? 'Saving…' : 'I am 18 or older'}
          icon="arrow-forward"
          disabled={isSaving}
          onPress={() => void handleConfirm()}
        />
        <Text style={[styles.footnote, { color: colors.mutedForeground }]}>
          All genders, orientations, relationship styles, and consensual
          interests are welcome.
        </Text>
      </View>
    </AppScreen>
  );
}

export function PrimaryButton({
  label,
  onPress,
  icon,
  disabled,
}: {
  label: string;
  onPress: () => void;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  disabled?: boolean;
}) {
  const colors = useColors();
  return (
    <Pressable
      style={({ pressed }) => [
        styles.primaryButton,
        {
          backgroundColor: colors.primary,
          opacity: disabled ? 0.55 : pressed ? 0.86 : 1,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
    >
      <Text style={[styles.primaryButtonText, { color: colors.primaryForeground }]}>
        {label}
      </Text>
      {icon ? (
        <Ionicons name={icon} size={18} color={colors.primaryForeground} />
      ) : null}
    </Pressable>
  );
}

export function IconButton({
  icon,
  label,
  onPress,
  active = false,
  disabled = false,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.iconButton,
        {
          backgroundColor: active ? colors.secondary : 'transparent',
          opacity: disabled ? 0.45 : pressed ? 0.58 : 1,
        },
      ]}
    >
      <Ionicons
        name={icon}
        size={20}
        color={active ? colors.primary : colors.mutedForeground}
      />
    </Pressable>
  );
}

export function Tag({
  label,
  selected = false,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  const colors = useColors();
  const content = (
    <Text
      style={[
        styles.tagText,
        { color: selected ? colors.primaryForeground : colors.secondaryForeground },
      ]}
    >
      {label}
    </Text>
  );
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        style={({ pressed }) => [
          styles.tag,
          {
            backgroundColor: selected ? colors.primary : colors.secondary,
            opacity: pressed ? 0.78 : 1,
          },
        ]}
      >
        {content}
      </Pressable>
    );
  }
  return (
    <View style={[styles.tag, { backgroundColor: colors.secondary }]}>
      <Text style={[styles.tagText, { color: colors.secondaryForeground }]}>
        {label}
      </Text>
    </View>
  );
}

export function ScreenHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  const colors = useColors();
  return (
    <View style={styles.heading}>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow}</Text>
      <Text style={[styles.screenTitle, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.bodyText, { color: colors.mutedForeground }]}>
        {subtitle}
      </Text>
    </View>
  );
}

export function TextField({
  label,
  value,
  placeholder,
  onChangeText,
  multiline = false,
  keyboardType,
  autoCapitalize,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  multiline?: boolean;
  keyboardType?: 'default' | 'url';
  autoCapitalize?: 'none' | 'sentences' | 'words';
}) {
  const colors = useColors();
  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.fieldLabel, { color: colors.foreground }]}>{label}</Text>
      <TextInput
        style={[
          styles.textField,
          multiline && styles.multilineField,
          {
            backgroundColor: colors.card,
            borderColor: colors.input,
            color: colors.foreground,
          },
        ]}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        onChangeText={onChangeText}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize ?? 'sentences'}
        autoCorrect={keyboardType !== 'url'}
        accessibilityLabel={label}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  screen: { flex: 1 },
  content: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  loadingText: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  recovery: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 16,
  },
  recoveryIcon: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 27,
  },
  recoveryTitle: { fontSize: 22, lineHeight: 29, fontFamily: 'Inter_700Bold' },
  recoveryText: { fontSize: 15, lineHeight: 22, fontFamily: 'Inter_400Regular' },
  ageGate: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 26,
    paddingVertical: 30,
    gap: 18,
  },
  ageMark: {
    width: 66,
    height: 66,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    marginBottom: 4,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.5,
    fontFamily: 'Inter_700Bold',
  },
  ageTitle: {
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.8,
    fontFamily: 'Inter_700Bold',
  },
  bodyLarge: { fontSize: 16, lineHeight: 24, fontFamily: 'Inter_400Regular' },
  ageNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderWidth: 1,
    borderRadius: 16,
  },
  ageNoticeText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    fontFamily: 'Inter_500Medium',
  },
  bodySmall: { fontSize: 12, lineHeight: 19, fontFamily: 'Inter_400Regular' },
  footnote: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  primaryButton: {
    minHeight: 54,
    paddingHorizontal: 20,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  primaryButtonText: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
  },
  tagText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  heading: { gap: 7, marginBottom: 18 },
  screenTitle: {
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.6,
    fontFamily: 'Inter_700Bold',
  },
  bodyText: { fontSize: 14, lineHeight: 21, fontFamily: 'Inter_400Regular' },
  fieldGroup: { gap: 7 },
  fieldLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  textField: {
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 13,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  multilineField: { minHeight: 96, lineHeight: 21 },
  saveWarning: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 18,
    marginBottom: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  saveWarningText: { flex: 1, fontSize: 12, fontFamily: 'Inter_500Medium' },
  saveWarningAction: { fontSize: 12, fontFamily: 'Inter_700Bold' },
});

