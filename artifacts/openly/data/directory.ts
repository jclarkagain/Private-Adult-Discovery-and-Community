export type DirectoryCategory =
  | 'Meet'
  | 'Kink'
  | 'Cruising'
  | 'Queer'
  | 'Classifieds'
  | 'Shops'
  | 'Books'
  | 'Community';

export interface DirectoryResource {
  id: string;
  name: string;
  url: string;
  summary: string;
  categories: DirectoryCategory[];
  tags: string[];
  sourceLabel: string;
  lastChecked?: string;
  isOfficial: boolean;
}

export const DIRECTORY_CHECKED_DATE = '17 Oct 2026';

export const DIRECTORY_CATEGORIES: DirectoryCategory[] = [
  'Meet',
  'Kink',
  'Cruising',
  'Queer',
  'Classifieds',
  'Shops',
  'Books',
  'Community',
];

export const STARTER_DIRECTORY: DirectoryResource[] = [
  {
    id: 'feeld',
    name: 'Feeld',
    url: 'https://feeld.co/',
    summary:
      'Dating for curious people, with options for different identities, relationship styles, and desires.',
    categories: ['Meet', 'Kink', 'Queer'],
    tags: ['Dating', 'Open relationships', 'Desire tags'],
    sourceLabel: 'Official site',
    lastChecked: DIRECTORY_CHECKED_DATE,
    isOfficial: true,
  },
  {
    id: 'fetlife',
    name: 'FetLife',
    url: 'https://fetlife.com/',
    summary:
      'A BDSM, fetish, and kink community for groups, events, and discussion. FetLife says it is not a dating site.',
    categories: ['Kink', 'Community'],
    tags: ['BDSM', 'Fetish', 'Events'],
    sourceLabel: 'Official site',
    lastChecked: DIRECTORY_CHECKED_DATE,
    isOfficial: true,
  },
  {
    id: 'sniffies',
    name: 'Sniffies',
    url: 'https://sniffies.com/map/cruising',
    summary:
      'A map-based cruising platform for gay, bi, and other men seeking men. Its live map and user posts are external.',
    categories: ['Cruising', 'Queer', 'Meet'],
    tags: ['Cruising', 'Men seeking men', 'Live map'],
    sourceLabel: 'Official site',
    lastChecked: DIRECTORY_CHECKED_DATE,
    isOfficial: true,
  },
  {
    id: 'lex',
    name: 'Lex',
    url: 'https://www.lex.lgbt/',
    summary:
      'A queer community app with local groups and events; check the app for current personals and community features.',
    categories: ['Queer', 'Community', 'Meet'],
    tags: ['Queer', 'Groups', 'Events'],
    sourceLabel: 'Official site',
    lastChecked: DIRECTORY_CHECKED_DATE,
    isOfficial: true,
  },
  {
    id: 'doublelist',
    name: 'Doublelist',
    url: 'https://doublelist.com/',
    summary:
      'Local personals and adult connections. Listings, availability, and site rules can change; verify them there.',
    categories: ['Classifieds', 'Meet'],
    tags: ['Personals', 'Local listings'],
    sourceLabel: 'Official site',
    lastChecked: DIRECTORY_CHECKED_DATE,
    isOfficial: true,
  },
  {
    id: 'babeland',
    name: 'Babeland',
    url: 'https://www.babeland.com/',
    summary:
      'Adult novelty shop with toys, BDSM and kink products, and store information.',
    categories: ['Shops'],
    tags: ['Adult toys', 'BDSM', 'Retail'],
    sourceLabel: 'Official site',
    lastChecked: DIRECTORY_CHECKED_DATE,
    isOfficial: true,
  },
];

