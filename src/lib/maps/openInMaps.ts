import { Linking, Platform } from 'react-native';
import { Field } from '../../types/field';

async function tryOpen(url: string): Promise<boolean> {
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) return false;
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Opens the platform's native maps app with directions to `field`, falling
 * back through native URL schemes and finally to a universal web URL if none
 * of them are handled (e.g. required app not installed, or the iOS
 * LSApplicationQueriesSchemes allowlist rejects the scheme check).
 */
export async function openInMaps(field: Field): Promise<void> {
  const { lat, lon, address, name } = field;
  const destinationLabel = address ?? name;

  if (Platform.OS === 'ios') {
    const appleMapsUrl = `maps://?daddr=${lat},${lon}&q=${encodeURIComponent(destinationLabel)}`;
    if (await tryOpen(appleMapsUrl)) return;
  } else if (Platform.OS === 'android') {
    const googleNavigationUrl = `google.navigation:q=${lat},${lon}`;
    if (await tryOpen(googleNavigationUrl)) return;

    const geoUrl = `geo:${lat},${lon}?q=${lat},${lon}(${encodeURIComponent(destinationLabel)})`;
    if (await tryOpen(geoUrl)) return;
  }

  const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
  await Linking.openURL(webUrl);
}
