import { Directory, File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

export function persistProductImage(uri: string | undefined): string | null {
  if (!uri) return null;
  if (Platform.OS === 'web') return uri;

  const imagesDirectory = new Directory(Paths.document, 'product-images');
  if (uri.startsWith(imagesDirectory.uri)) return uri;

  imagesDirectory.create({ idempotent: true, intermediates: true });
  const source = new File(uri);
  const extension = source.extension || '.jpg';
  const destination = new File(
    imagesDirectory,
    `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${extension}`
  );
  source.copy(destination);
  return destination.uri;
}
