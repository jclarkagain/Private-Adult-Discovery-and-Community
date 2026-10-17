import React from 'react';
import { Alert, Linking, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DirectoryResource } from '@/data/directory';
import { IconButton, Tag } from '@/components/AppUI';
import { useColors } from '@/hooks/useColors';

export function DirectoryCard({
  resource,
  saved,
  flagged,
  onToggleSaved,
  onToggleFlagged,
  onRemove,
}: {
  resource: DirectoryResource;
  saved: boolean;
  flagged: boolean;
  onToggleSaved: () => void;
  onToggleFlagged: () => void;
  onRemove?: () => void;
}) {
  const colors = useColors();
  const openLink = async () => {
    try {
      await Linking.openURL(resource.url);
    } catch {
      Alert.alert('Could not open this link', 'Check the address and try again.');
    }
  };

  const shareLink = async () => {
    try {
      await Share.share({
        message: `${resource.name}\n${resource.url}\n\n${resource.summary}\n\nShared from Openly. Confirm current details on the destination site.`,
      });
    } catch {
      Alert.alert('Could not share this link', 'Please try again.');
    }
  };

  const flagLink = () => {
    Alert.alert(
      flagged ? 'Remove review reminder?' : 'Mark this link for review?',
      flagged
        ? 'This only changes your personal list. It does not contact the site.'
        : 'Openly cannot verify current member posts or listings. This reminder stays on your device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: flagged ? 'Clear reminder' : 'Mark for review',
          onPress: onToggleFlagged,
        },
      ],
    );
  };

  const removeLink = () => {
    Alert.alert('Remove this personal link?', 'This only removes it from Openly on this device.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: onRemove },
    ]);
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.cardTop}>
        <View style={styles.titleBlock}>
          <Text style={[styles.name, { color: colors.foreground }]}>{resource.name}</Text>
          <Text style={[styles.source, { color: colors.mutedForeground }]}>
            {resource.isOfficial
              ? `${resource.sourceLabel} · checked ${resource.lastChecked ?? 'date unavailable'}`
              : 'Your link · not independently verified'}
          </Text>
        </View>
        <View style={styles.actions}>
          <IconButton
            icon={saved ? 'bookmark' : 'bookmark-outline'}
            label={saved ? `Remove ${resource.name} from saved` : `Save ${resource.name}`}
            active={saved}
            onPress={onToggleSaved}
          />
          <IconButton
            icon="share-outline"
            label={`Share ${resource.name}`}
            onPress={() => void shareLink()}
          />
        </View>
      </View>
      {flagged ? (
        <View style={[styles.reviewFlag, { backgroundColor: colors.accent }]}>
          <Ionicons name="flag-outline" size={14} color={colors.accentForeground} />
          <Text style={[styles.reviewFlagText, { color: colors.accentForeground }]}>
            Marked for your review
          </Text>
        </View>
      ) : null}
      <Text style={[styles.summary, { color: colors.cardForeground }]}>
        {resource.summary}
      </Text>
      <View style={styles.tags}>
        {resource.categories.map(category => (
          <Tag key={`${resource.id}-${category}`} label={category} />
        ))}
      </View>
      <Text style={[styles.caution, { color: colors.mutedForeground }]}>
        Destination link only. Check current listings, rules, and privacy settings there.
      </Text>
      <View style={[styles.cardBottom, { borderTopColor: colors.border }]}>
        <Pressable
          onPress={() => void openLink()}
          accessibilityRole="link"
          accessibilityLabel={`Open official website for ${resource.name}`}
          style={({ pressed }) => [
            styles.openButton,
            { backgroundColor: colors.secondary, opacity: pressed ? 0.75 : 1 },
          ]}
        >
          <Text style={[styles.openText, { color: colors.primary }]}>Open site</Text>
          <Ionicons name="open-outline" size={16} color={colors.primary} />
        </Pressable>
        <View style={styles.actions}>
          <IconButton
            icon={flagged ? 'flag' : 'flag-outline'}
            label={flagged ? `Clear review reminder for ${resource.name}` : `Flag ${resource.name} for review`}
            active={flagged}
            onPress={flagLink}
          />
          {!resource.isOfficial ? (
            <IconButton
              icon="trash-outline"
              label={`Remove ${resource.name}`}
              onPress={removeLink}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 17,
    gap: 13,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  titleBlock: { flex: 1, gap: 4, paddingTop: 4 },
  name: { fontSize: 18, lineHeight: 24, fontFamily: 'Inter_700Bold' },
  source: { fontSize: 10, lineHeight: 15, fontFamily: 'Inter_500Medium' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  summary: { fontSize: 14, lineHeight: 21, fontFamily: 'Inter_400Regular' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  caution: { fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular' },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
  },
  openButton: {
    minHeight: 38,
    paddingHorizontal: 13,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  openText: { fontSize: 12, fontFamily: 'Inter_700Bold' },
  reviewFlag: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  reviewFlagText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
});

