import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export interface RepositoryDetailsParams {
  readonly owner: string;
  readonly name: string;
}

export type RootStackParamList = {
  RepositorySearch: undefined;
  RepositoryDetails: RepositoryDetailsParams;
};

export type RootStackNavigation = NativeStackNavigationProp<RootStackParamList>;
