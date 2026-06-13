import * as Clipboard from 'expo-clipboard';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { Component } from 'react';
import { Alert } from 'react-native';
import { captureRef } from 'react-native-view-shot';

// captureRef accepts a ref to any rendered native view
type CaptureTarget = number | React.RefObject<Component | null>;

export async function captureCard(ref: CaptureTarget): Promise<string> {
  return captureRef(ref, { format: 'png', quality: 1 });
}

/** Save the captured card straight to the camera roll. */
export async function saveCardToPhotos(ref: CaptureTarget): Promise<boolean> {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Photos access needed', 'Allow photo library access in Settings to save.');
    return false;
  }
  const uri = await captureCard(ref);
  await MediaLibrary.saveToLibraryAsync(uri);
  return true;
}

/** Open the native share sheet (Instagram, Messages, Copy, etc.). */
export async function shareCard(ref: CaptureTarget): Promise<void> {
  if (!(await Sharing.isAvailableAsync())) {
    Alert.alert('Sharing not available on this device.');
    return;
  }
  const uri = await captureCard(ref);
  await Sharing.shareAsync(uri, {
    mimeType: 'image/png',
    dialogTitle: 'Share the winner',
    UTI: 'public.png',
  });
}

/** Copy the card image to the clipboard. */
export async function copyCard(ref: CaptureTarget): Promise<boolean> {
  const base64 = await captureRef(ref, { format: 'png', quality: 1, result: 'base64' });
  await Clipboard.setImageAsync(base64);
  return true;
}
