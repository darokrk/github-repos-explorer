import { StyleSheet, View } from 'react-native';

const FALLBACK_COLOR = '#8B949E';

const languageColors: Readonly<Record<string, string>> = {
  TypeScript: '#3178C6',
  JavaScript: '#F1E05A',
  Python: '#3572A5',
  Java: '#B07219',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  'Objective-C': '#438EFF',
  Go: '#00ADD8',
  Rust: '#DEA584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  C: '#555555',
  'C++': '#F34B7D',
  'C#': '#178600',
  Dart: '#00B4AB',
  Shell: '#89E051',
  HTML: '#E34C26',
  CSS: '#563D7C',
  SCSS: '#C6538C',
  Vue: '#41B883',
  Svelte: '#FF3E00',
  Elixir: '#6E4A7E',
  Scala: '#C22D40',
  Lua: '#000080',
  Haskell: '#5E5086',
  Zig: '#EC915C',
  MDX: '#FCB32C',
};

const styles = StyleSheet.create({
  dot: { width: 10, height: 10, borderRadius: 5 },
});

export function LanguageDot({ language }: { readonly language: string }) {
  const tint = { backgroundColor: languageColors[language] ?? FALLBACK_COLOR };
  return <View style={[styles.dot, tint]} />;
}
