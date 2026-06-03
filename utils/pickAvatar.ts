import * as ImagePicker from 'expo-image-picker';
import { ActionSheetIOS, Alert, Platform } from 'react-native';

/**
 * Single prompt — asks the user to take a photo, pick from library, or skip.
 * Avoids chaining two separate alerts (second one becomes unresponsive on iOS).
 */
export async function promptAndPickAvatar(name: string): Promise<string | null> {
  const choice = await new Promise<'camera' | 'library' | null>((resolve) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: `Add a photo for ${name}?`,
          message: 'Their face will show up in the spin wheel.',
          options: ['Skip', 'Take Photo', 'Choose from Library'],
          cancelButtonIndex: 0,
        },
        (i) => resolve(i === 1 ? 'camera' : i === 2 ? 'library' : null),
      );
    } else {
      Alert.alert(
        `Add a photo for ${name}?`,
        'Their face will show up in the spin wheel.',
        [
          { text: 'Take Photo', onPress: () => resolve('camera') },
          { text: 'Choose from Library', onPress: () => resolve('library') },
          { text: 'Skip', style: 'cancel', onPress: () => resolve(null) },
        ],
      );
    }
  });

  if (!choice) return null;

  if (choice === 'camera') {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera access needed', 'Allow camera access in Settings to take photos.');
      return null;
    }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.7 });
    return result.canceled ? null : result.assets[0].uri;
  } else {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Photos access needed', 'Allow photo library access in Settings.');
      return null;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.7 });
    return result.canceled ? null : result.assets[0].uri;
  }
}

export async function pickAvatar(): Promise<string | null> {
  const choice = await new Promise<'camera' | 'library' | null>((resolve) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: ['Cancel', 'Take Photo', 'Choose from Library'], cancelButtonIndex: 0 },
        (i) => resolve(i === 1 ? 'camera' : i === 2 ? 'library' : null),
      );
    } else {
      Alert.alert('Add Photo', '', [
        { text: 'Take Photo', onPress: () => resolve('camera') },
        { text: 'Choose from Library', onPress: () => resolve('library') },
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(null) },
      ]);
    }
  });

  if (!choice) return null;

  if (choice === 'camera') {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera access needed', 'Allow camera access in Settings to take photos.');
      return null;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, aspect: [1, 1], quality: 0.7,
    });
    return result.canceled ? null : result.assets[0].uri;
  } else {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Photos access needed', 'Allow photo library access in Settings.');
      return null;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true, aspect: [1, 1], quality: 0.7,
    });
    return result.canceled ? null : result.assets[0].uri;
  }
}
