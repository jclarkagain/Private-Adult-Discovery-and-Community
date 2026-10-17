import React, { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { GatedScreen, IconButton, PrimaryButton, Tag } from '@/components/AppUI';
import { DirectoryCard } from '@/components/DirectoryCard';
import {
  DIRECTORY_CATEGORIES,
  DIRECTORY_CHECKED_DATE,
  DirectoryCategory,
  DirectoryResource,
  STARTER_DIRECTORY,
} from '@/data/directory';
import { useOpenly } from '@/state/AppContext';
import { useColors } from '@/hooks/useColors';

const FILTERS: Array<'All' | DirectoryCategory> = [
  'All',
  ...DIRECTORY_CATEGORIES,
];

export default function ExploreScreen() {
  const colors = useColors();
  const {
    data,
    addResource,
    toggleSaved,
    toggleFlagged,
    removeResource,
  } = useOpenly();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'All' | DirectoryCategory>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [newCategory, setNewCategory] = useState<DirectoryCategory>('Meet');
  const [formError, setFormError] = useState('');

  const resources = useMemo(
    () => [...data.customResources, ...STARTER_DIRECTORY],
    [data.customResources],
  );
  const filtered = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    return resources.filter(resource => {
      const inCategory =
        category === 'All' || resource.categories.includes(category);
      const searchable = [
        resource.name,
        resource.summary,
        ...resource.categories,
        ...resource.tags,
      ]
        .join(' ')
        .toLocaleLowerCase();
      return inCategory && (!search || searchable.includes(search));
    });
  }, [category, query, resources]);

  const submitResource = async () => {
    const cleanName = name.trim();
    const cleanUrl = url.trim();
    if (!cleanName) {
      setFormError('Add a name for this resource.');
      return;
    }
    if (!/^https:\/\/[^\s/$.?#].[^\s]*$/i.test(cleanUrl)) {
      setFormError('Enter a full secure link that starts with https://.');
      return;
    }
    try {
      const parsed = new URL(cleanUrl);
      if (!parsed.hostname.includes('.')) {
        setFormError('That web address does not look complete yet.');
        return;
      }
    } catch {
      setFormError('Check the web address and try again.');
      return;
    }

    setFormError('');
    const resource: DirectoryResource = {
      id: `personal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: cleanName,
      url: cleanUrl,
      summary: description.trim() || 'A link you added to your personal directory.',
      categories: [newCategory],
      tags: [],
      sourceLabel: 'Added by you',
      isOfficial: false,
    };
    const saved = await addResource(resource);
    if (saved) {
      setName('');
      setUrl('');
      setDescription('');
      setShowAddForm(false);
    } else {
      setFormError('Could not save this link on your device. Try again.');
    }
  };

  return (
    <GatedScreen>
      <KeyboardAwareScrollViewCompat
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        bottomOffset={24}
      >
        <View style={styles.topLine}>
          <View>
            <Text style={[styles.wordmark, { color: colors.foreground }]}>openly</Text>
            <Text style={[styles.topSubhead, { color: colors.mutedForeground }]}>
              A personal guide to adult discovery
            </Text>
          </View>
          <View style={[styles.adultBadge, { backgroundColor: colors.secondary }]}>
            <Ionicons name="lock-closed-outline" size={13} color={colors.primary} />
            <Text style={[styles.adultBadgeText, { color: colors.primary }]}>18+</Text>
          </View>
        </View>

        <View style={[styles.intro, { backgroundColor: colors.primary }]}>
          <View style={styles.introMark}>
            <Ionicons name="open-outline" size={24} color={colors.primaryForeground} />
          </View>
          <Text style={[styles.introTitle, { color: colors.primaryForeground }]}>
            Explore on your terms.
          </Text>
          <Text style={[styles.introText, { color: colors.primaryForeground }]}>
            All genders, identities, and consensual interests belong here.
          </Text>
          <View style={styles.privateLabel}>
            <Ionicons name="phone-portrait-outline" size={13} color={colors.primaryForeground} />
            <Text style={[styles.privateText, { color: colors.primaryForeground }]}>
              Private on this device
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.searchBox,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons name="search-outline" size={19} color={colors.mutedForeground} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search sites, interests, or spaces"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground }]}
            returnKeyType="search"
            autoCorrect={false}
            accessibilityLabel="Search directory"
          />
          {query ? (
            <IconButton
              icon="close-circle"
              label="Clear search"
              onPress={() => setQuery('')}
            />
          ) : null}
        </View>

        <View style={styles.filterWrap}>
          {FILTERS.map(item => (
            <Tag
              key={item}
              label={item}
              selected={category === item}
              onPress={() => setCategory(item)}
            />
          ))}
        </View>

        <View style={styles.listHeading}>
          <View style={styles.listTitleBlock}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Explore the directory
            </Text>
            <Text style={[styles.resultCount, { color: colors.mutedForeground }]}>
              {filtered.length} {filtered.length === 1 ? 'destination' : 'destinations'}
            </Text>
          </View>
          <Pressable
            onPress={() => setShowAddForm(open => !open)}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.addLinkButton,
              { backgroundColor: colors.secondary, opacity: pressed ? 0.78 : 1 },
            ]}
          >
            <Ionicons
              name={showAddForm ? 'close-outline' : 'add-outline'}
              size={17}
              color={colors.primary}
            />
            <Text style={[styles.addLinkText, { color: colors.primary }]}>
              {showAddForm ? 'Close' : 'Add a link'}
            </Text>
          </Pressable>
        </View>

        {showAddForm ? (
          <View
            style={[
              styles.formCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.formTitle, { color: colors.foreground }]}>
              Add to your personal directory
            </Text>
            <Text style={[styles.formNote, { color: colors.mutedForeground }]}>
              Links are saved only on this device and are not independently checked.
            </Text>
            <View style={styles.formFields}>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Name"
                placeholderTextColor={colors.mutedForeground}
                style={[styles.formInput, { backgroundColor: colors.background, borderColor: colors.input, color: colors.foreground }]}
                accessibilityLabel="Resource name"
              />
              <TextInput
                value={url}
                onChangeText={setUrl}
                placeholder="https://example.com"
                placeholderTextColor={colors.mutedForeground}
                style={[styles.formInput, { backgroundColor: colors.background, borderColor: colors.input, color: colors.foreground }]}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                accessibilityLabel="Secure website link"
              />
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="What do you want to remember about it?"
                placeholderTextColor={colors.mutedForeground}
                style={[styles.formInput, styles.formDescription, { backgroundColor: colors.background, borderColor: colors.input, color: colors.foreground }]}
                multiline
                textAlignVertical="top"
                accessibilityLabel="Private resource note"
              />
            </View>
            <Text style={[styles.formLabel, { color: colors.foreground }]}>
              Category
            </Text>
            <View style={styles.filterWrap}>
              {DIRECTORY_CATEGORIES.map(item => (
                <Tag
                  key={`new-${item}`}
                  label={item}
                  selected={newCategory === item}
                  onPress={() => setNewCategory(item)}
                />
              ))}
            </View>
            {formError ? (
              <Text style={[styles.formError, { color: colors.destructive }]}>
                {formError}
              </Text>
            ) : null}
            <PrimaryButton label="Save link on this device" onPress={() => void submitResource()} />
          </View>
        ) : null}

        <View style={[styles.freshnessNote, { backgroundColor: colors.muted }]}>
          <Ionicons name="information-circle-outline" size={17} color={colors.primary} />
          <Text style={[styles.freshnessText, { color: colors.mutedForeground }]}>
            Official destination pages checked {DIRECTORY_CHECKED_DATE}. Openly does not
            verify members, current personals, events, or live listings.
          </Text>
        </View>

        {filtered.length ? (
          <View style={styles.cards}>
            {filtered.map(resource => (
              <DirectoryCard
                key={resource.id}
                resource={resource}
                saved={data.savedIds.includes(resource.id)}
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
              styles.emptyState,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Ionicons name="search-outline" size={25} color={colors.primary} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No matches yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Try another search or add a link you want to keep in your directory.
            </Text>
          </View>
        )}
        <View style={[styles.bottomNote, { borderColor: colors.border }]}>
          <Ionicons name="lock-closed-outline" size={15} color={colors.mutedForeground} />
          <Text style={[styles.bottomNoteText, { color: colors.mutedForeground }]}>
            Saved links, notes, and profile details are stored locally. Sharing is always a separate choice.
          </Text>
        </View>
      </KeyboardAwareScrollViewCompat>
    </GatedScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 116, gap: 17 },
  topLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  wordmark: { fontSize: 29, letterSpacing: -1.2, fontFamily: 'Inter_700Bold' },
  topSubhead: { fontSize: 11, marginTop: 2, fontFamily: 'Inter_500Medium' },
  adultBadge: {
    borderRadius: 13,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  adultBadgeText: { fontSize: 11, fontFamily: 'Inter_700Bold' },
  intro: { borderRadius: 23, padding: 19, gap: 8, overflow: 'hidden' },
  introMark: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    marginBottom: 3,
  },
  introTitle: { fontSize: 21, letterSpacing: -0.5, fontFamily: 'Inter_700Bold' },
  introText: { fontSize: 13, lineHeight: 19, opacity: 0.9, fontFamily: 'Inter_400Regular' },
  privateLabel: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  privateText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  searchBox: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 16,
    paddingLeft: 14,
    paddingRight: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: { flex: 1, minHeight: 48, fontSize: 13, fontFamily: 'Inter_400Regular' },
  filterWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  listHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 2,
  },
  listTitleBlock: { gap: 3 },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  resultCount: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  addLinkButton: {
    minHeight: 38,
    paddingHorizontal: 10,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addLinkText: { fontSize: 11, fontFamily: 'Inter_700Bold' },
  formCard: { borderWidth: 1, borderRadius: 18, padding: 16, gap: 12 },
  formTitle: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  formNote: { fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular' },
  formFields: { gap: 9 },
  formInput: {
    minHeight: 46,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  formDescription: { minHeight: 74, lineHeight: 19 },
  formLabel: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  formError: { fontSize: 12, lineHeight: 17, fontFamily: 'Inter_500Medium' },
  freshnessNote: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  freshnessText: { flex: 1, fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular' },
  cards: { gap: 12 },
  emptyState: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    gap: 9,
  },
  emptyTitle: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  emptyText: { fontSize: 12, lineHeight: 18, textAlign: 'center', fontFamily: 'Inter_400Regular' },
  bottomNote: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 13,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bottomNoteText: { flex: 1, fontSize: 10, lineHeight: 16, fontFamily: 'Inter_400Regular' },
});

