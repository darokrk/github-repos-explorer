import type { Theme as NavigationTheme } from '@react-navigation/native';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { RepositoryDetailsScreen } from '@/screens/repository-details';
import { RepositorySearchScreen } from '@/screens/repository-search';
import type { RootStackParamList } from '@/shared/navigation/routeParams';
import type { Theme } from '@/shared/theme/theme';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { ThemeToggle } from '../ui/ThemeToggle';

const Stack = createNativeStackNavigator<RootStackParamList>();

const renderThemeToggle = () => <ThemeToggle />;

const screenOptions: NativeStackNavigationOptions = {
  headerRight: renderThemeToggle,
  headerTitleAlign: 'center',
};

function toNavigationTheme(theme: Theme): NavigationTheme {
  const base = theme.scheme === 'dark' ? DarkTheme : DefaultTheme;

  return {
    ...base,
    dark: theme.scheme === 'dark',
    colors: {
      ...base.colors,
      primary: theme.colors.accent,
      background: theme.colors.background,
      card: theme.colors.background,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.danger,
    },
  };
}

export function RootNavigator() {
  const theme = useTheme();

  return (
    <NavigationContainer theme={toNavigationTheme(theme)}>
      <StatusBar barStyle={theme.scheme === 'dark' ? 'light-content' : 'dark-content'} />
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name="RepositorySearch"
          component={RepositorySearchScreen}
          options={{ title: 'Explore repositories' }}
        />
        <Stack.Screen
          name="RepositoryDetails"
          component={RepositoryDetailsScreen}
          options={({ route }) => ({ title: route.params.name, headerBackTitle: 'Results' })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
