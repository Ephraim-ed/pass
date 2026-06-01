import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TabBar from '@/components/ui/TabBar';
import Bub from '@/components/mascot/Bub';
import { COLORS, FONTS } from '@/theme/tokens';

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.cream, alignItems: 'center', justifyContent: 'center' }}>
      <Bub pose="idle" size={120} color={COLORS.sky} hat={COLORS.yellow} />
      <Text
        style={{
          fontFamily: FONTS.display,
          fontSize: 28,
          color: COLORS.ink,
          marginTop: 24,
          textAlign: 'center',
        }}
      >
        No games yet.
      </Text>
      <Text
        style={{
          fontFamily: FONTS.ui,
          fontSize: 15,
          color: COLORS.ink2,
          marginTop: 8,
          textAlign: 'center',
          paddingHorizontal: 40,
        }}
      >
        Your game history will show up here after you play.
      </Text>
      <TabBar />
    </View>
  );
}
