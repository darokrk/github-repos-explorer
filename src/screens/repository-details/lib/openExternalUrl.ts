import { Linking } from 'react-native';

export async function openExternalUrl(url: string): Promise<void> {
  try {
    await Linking.openURL(url);
  } catch (error) {
    console.warn(`Unable to open external URL: ${url}`, error);
  }
}
