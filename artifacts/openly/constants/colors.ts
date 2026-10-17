/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#29212A',
    tint: '#744A69',
    background: '#F7F2EC',
    foreground: '#29212A',
    card: '#FFFCF8',
    cardForeground: '#29212A',
    primary: '#744A69',
    primaryForeground: '#FFFFFF',
    secondary: '#EFE5EA',
    secondaryForeground: '#483443',
    muted: '#F0EAE4',
    mutedForeground: '#766C73',
    accent: '#E7C7B2',
    accentForeground: '#49352F',
    destructive: '#B43E4A',
    destructiveForeground: '#FFFFFF',
    border: '#E5DCD4',
    input: '#D9CEC8',
  },
  dark: {
    text: '#F5ECF1',
    tint: '#D7A8C9',
    background: '#1C171E',
    foreground: '#F5ECF1',
    card: '#29222B',
    cardForeground: '#F5ECF1',
    primary: '#D7A8C9',
    primaryForeground: '#241C25',
    secondary: '#382D39',
    secondaryForeground: '#F1E3EB',
    muted: '#302832',
    mutedForeground: '#BFB1BC',
    accent: '#604A50',
    accentForeground: '#F6E5D8',
    destructive: '#E8868C',
    destructiveForeground: '#291C20',
    border: '#443846',
    input: '#514251',
  },
  radius: 18,
};

export default colors;
