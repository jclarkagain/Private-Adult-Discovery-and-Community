import React, { useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { DirectoryCard } from '@/components/DirectoryCard';
import { GatedScreen, ScreenHeading } from '@/components/AppUI';
import { STARTER_DIRECTORY } from '@/data/directory';
import { useOpenly } from '@/state/AppContext';
import { useColors } from '@/hooks/useColors';
import { StyleSheet, Text, View } from 'react-native';

export default function SavedScreen() {
  const colors = useColors();
  const { data, toggleSaved, toggleFlagged, removeResource } = useOpenly();
  const resources = useMemo(
    () => [...data.customResources, ...STARTER_DIRECTORY],
    [data.customResources],
  );
  const savedResources = resources.filter(resource =>
    data.savedIds.includes(resource.id),
  );

  return (
    <GatedScreen>
      <KeyboardAwareScrollViewCompat
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        bottomOffset={24}
      >
        <ScreenHeading
          eyebrow="YOUR COLLECTION"
          title="Saved"
          subtitle="A private shortlist of sites and links you want to return to."
        />
        {savedResources.length ? (
          <View style={styles.cards}>
            {savedResources.map(resource => (
              <DirectoryCard
                key={resource.id}
                resource={resource}
                saved
                flagged={data.flaggedIds.includes(resource.id)}
                onToggleSaved={() => void toggleSaved(resource.id)}
                onToggleFlagged={() => void toggleFlagged(resource.id)}
                onRemove={() => void removeResource(resource.id)}
              />
            ))}
          </View>
        ) : (
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={[styles.emptyIcon, { backgroundColor: colors.secondary }]}>
              <Ionicons name="bookmark-outline" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Keep a few links close
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Use the bookmark on any directory card. Your saved list stays on this device.
            </Text>
          </View>
        )}
      </KeyboardAwareScrollViewCompat>
    </GatedScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 24, paddingBottom: 116, gap: 18 },
  cards: { gap: 12 },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 28,
    alignItems: 'center',
    gap: 10,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontSize: 17, textAlign: 'center', fontFamily: 'Inter_700Bold' },
  emptyText: { fontSize: 13, lineHeight: 20, textAlign: 'center', fontFamily: 'Inter_400Regular' },
});

