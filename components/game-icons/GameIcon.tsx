import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Ellipse, Line, Path, Polygon, Rect, Text as SvgText } from 'react-native-svg';
import { COLORS } from '@/theme/tokens';

type Props = {
  gameId: string;
  size?: number;
  color?: string;
};

function TruthOrDareIcon({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 64 64" width="100%" height="100%">
      <Rect x="8" y="12" width="48" height="40" rx="6" fill={color} stroke={COLORS.ink} strokeWidth="2.5" />
      <SvgText x="32" y="26" textAnchor="middle" fontFamily="serif" fontSize="11" fontWeight="bold" fill={COLORS.ink}>TRUTH</SvgText>
      <Line x1="16" y1="32" x2="48" y2="32" stroke={COLORS.ink} strokeWidth="2" />
      <SvgText x="32" y="46" textAnchor="middle" fontFamily="serif" fontSize="11" fontWeight="bold" fill={COLORS.ink}>DARE</SvgText>
    </Svg>
  );
}

function SpinBottleIcon({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 64 64" width="100%" height="100%">
      {/* ground shadow */}
      <Ellipse cx="32" cy="60" rx="10" ry="2.5" fill={COLORS.ink} opacity={0.15} />
      {/* bottle body */}
      <Path
        d="M28 22 Q23 26 23 33 L23 54 Q23 59 28 59 L36 59 Q41 59 41 54 L41 33 Q41 26 36 22 Z"
        fill={color}
        stroke={COLORS.ink}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* cap / neck */}
      <Rect x="28" y="9" width="8" height="14" rx="2" fill={COLORS.ink} />
      {/* label */}
      <Rect x="24" y="33" width="16" height="13" rx="1.5" fill={COLORS.yellow} stroke={COLORS.ink} strokeWidth="1.5" />
      <SvgText x="32" y="42" textAnchor="middle" fontFamily="serif" fontWeight="900" fontSize="7" fill="#1A6B1A">
        UFC
      </SvgText>
      {/* shine */}
      <Path d="M25 28 Q24 38 25 52" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </Svg>
  );
}

function DrawingIcon({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 64 64" width="100%" height="100%">
      <Rect x="10" y="10" width="36" height="36" rx="4" fill={color} stroke={COLORS.ink} strokeWidth="2.5" />
      <Path d="M46 28 L54 20 L44 10 L36 18 Z" fill={COLORS.ink2} stroke={COLORS.ink} strokeWidth="2" />
      <Line x1="44" y1="10" x2="46" y2="28" stroke={COLORS.ink} strokeWidth="1.5" />
      <Path d="M20 36 Q28 24 36 36" fill="none" stroke={COLORS.ink} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function WordIcon({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 64 64" width="100%" height="100%">
      <Rect x="8" y="14" width="48" height="36" rx="6" fill={color} stroke={COLORS.ink} strokeWidth="2.5" />
      <SvgText x="32" y="29" textAnchor="middle" fontFamily="serif" fontSize="13" fontWeight="bold" fill={COLORS.ink}>ABC</SvgText>
      <Rect x="14" y="34" width="36" height="4" rx="2" fill={COLORS.ink} opacity="0.3" />
      <Rect x="14" y="41" width="22" height="4" rx="2" fill={COLORS.ink} opacity="0.3" />
    </Svg>
  );
}

function MovieIcon({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 64 64" width="100%" height="100%">
      <Rect x="8" y="16" width="48" height="32" rx="4" fill={color} stroke={COLORS.ink} strokeWidth="2.5" />
      <Rect x="8" y="16" width="8" height="8" fill={COLORS.ink} rx="1" />
      <Rect x="22" y="16" width="8" height="8" fill={COLORS.ink} rx="1" />
      <Rect x="36" y="16" width="8" height="8" fill={COLORS.ink} rx="1" />
      <Rect x="50" y="16" width="6" height="8" fill={COLORS.ink} rx="1" />
      <Rect x="8" y="40" width="8" height="8" fill={COLORS.ink} rx="1" />
      <Rect x="22" y="40" width="8" height="8" fill={COLORS.ink} rx="1" />
      <Rect x="36" y="40" width="8" height="8" fill={COLORS.ink} rx="1" />
      <Rect x="50" y="40" width="6" height="8" fill={COLORS.ink} rx="1" />
      <Polygon points="26,27 26,37 38,32" fill={COLORS.ink} />
    </Svg>
  );
}

function WordChainIcon({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 64 64" width="100%" height="100%">
      <Circle cx="14" cy="32" r="8" fill={color} stroke={COLORS.ink} strokeWidth="2.5" />
      <Circle cx="32" cy="32" r="8" fill={color} stroke={COLORS.ink} strokeWidth="2.5" />
      <Circle cx="50" cy="32" r="8" fill={color} stroke={COLORS.ink} strokeWidth="2.5" />
      <SvgText x="14" y="36" textAnchor="middle" fontSize="9" fontWeight="bold" fill={COLORS.ink}>A</SvgText>
      <SvgText x="32" y="36" textAnchor="middle" fontSize="9" fontWeight="bold" fill={COLORS.ink}>B</SvgText>
      <SvgText x="50" y="36" textAnchor="middle" fontSize="9" fontWeight="bold" fill={COLORS.ink}>C</SvgText>
    </Svg>
  );
}

function ImposterIcon({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 64 64" width="100%" height="100%">
      <Circle cx="20" cy="26" r="9" fill={color} stroke={COLORS.ink} strokeWidth="2.5" />
      <Circle cx="44" cy="26" r="9" fill={color} stroke={COLORS.ink} strokeWidth="2.5" />
      <Path d="M14 44 Q20 36 26 44" fill="none" stroke={COLORS.ink} strokeWidth="2.5" strokeLinecap="round" />
      <Path d="M38 44 Q44 38 50 44" fill="none" stroke={COLORS.ink} strokeWidth="2.5" strokeLinecap="round" />
      <SvgText x="44" y="31" textAnchor="middle" fontSize="10" fill={COLORS.ink}>?</SvgText>
    </Svg>
  );
}

function NeverHaveIcon({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 64 64" width="100%" height="100%">
      <Rect x="12" y="18" width="18" height="28" rx="4" fill={color} stroke={COLORS.ink} strokeWidth="2.5" />
      <Rect x="34" y="18" width="18" height="28" rx="4" fill={color} stroke={COLORS.ink} strokeWidth="2.5" />
      <Line x1="16" y1="26" x2="26" y2="26" stroke={COLORS.ink} strokeWidth="2" strokeLinecap="round" />
      <Line x1="16" y1="32" x2="26" y2="32" stroke={COLORS.ink} strokeWidth="2" strokeLinecap="round" />
      <Line x1="16" y1="38" x2="26" y2="38" stroke={COLORS.ink} strokeWidth="2" strokeLinecap="round" />
      <Line x1="38" y1="26" x2="48" y2="26" stroke={COLORS.ink} strokeWidth="2" strokeLinecap="round" />
      <Line x1="38" y1="32" x2="48" y2="32" stroke={COLORS.ink} strokeWidth="2" strokeLinecap="round" />
      <Line x1="38" y1="38" x2="48" y2="38" stroke={COLORS.ink} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function MostLikelyIcon({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 64 64" width="100%" height="100%">
      <Circle cx="32" cy="22" r="10" fill={color} stroke={COLORS.ink} strokeWidth="2.5" />
      <Path d="M18 48 Q32 36 46 48" fill="none" stroke={COLORS.ink} strokeWidth="2.5" strokeLinecap="round" />
      <Polygon points="32,10 30,16 36,16" fill={COLORS.yellow} stroke={COLORS.ink} strokeWidth="1.5" />
    </Svg>
  );
}

function CharadesIcon({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 64 64" width="100%" height="100%">
      <Circle cx="32" cy="20" r="10" fill={color} stroke={COLORS.ink} strokeWidth="2.5" />
      <Line x1="32" y1="30" x2="32" y2="48" stroke={COLORS.ink} strokeWidth="3" strokeLinecap="round" />
      <Line x1="32" y1="38" x2="16" y2="28" stroke={COLORS.ink} strokeWidth="3" strokeLinecap="round" />
      <Line x1="32" y1="38" x2="48" y2="28" stroke={COLORS.ink} strokeWidth="3" strokeLinecap="round" />
      <Line x1="32" y1="48" x2="22" y2="58" stroke={COLORS.ink} strokeWidth="3" strokeLinecap="round" />
      <Line x1="32" y1="48" x2="42" y2="58" stroke={COLORS.ink} strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
}

function WouldRatherIcon({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 64 64" width="100%" height="100%">
      <Rect x="8" y="16" width="20" height="32" rx="5" fill={color} stroke={COLORS.ink} strokeWidth="2.5" />
      <Rect x="36" y="16" width="20" height="32" rx="5" fill={color} stroke={COLORS.ink} strokeWidth="2.5" />
      <SvgText x="18" y="36" textAnchor="middle" fontSize="14" fontWeight="bold" fill={COLORS.ink}>A</SvgText>
      <SvgText x="46" y="36" textAnchor="middle" fontSize="14" fontWeight="bold" fill={COLORS.ink}>B</SvgText>
      <SvgText x="32" y="36" textAnchor="middle" fontSize="10" fontWeight="bold" fill={COLORS.ink2}>or</SvgText>
    </Svg>
  );
}

function IcebreakerIcon({ color }: { color: string }) {
  return (
    <Svg viewBox="0 0 64 64" width="100%" height="100%">
      {/* Ice cube */}
      <Rect x="14" y="20" width="30" height="30" rx="6" fill={color} stroke={COLORS.ink} strokeWidth="2.5" />
      <Line x1="20" y1="26" x2="28" y2="34" stroke={COLORS.ink} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <Line x1="34" y1="28" x2="39" y2="33" stroke={COLORS.ink} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      {/* Crack */}
      <Path d="M29 20 L33 30 L27 36 L32 50" fill="none" stroke={COLORS.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Question bubble */}
      <Circle cx="49" cy="17" r="10" fill={COLORS.ink} />
      <SvgText x="49" y="22" textAnchor="middle" fontSize="13" fontWeight="bold" fill={color}>?</SvgText>
    </Svg>
  );
}

const ICONS: Record<string, React.FC<{ color: string }>> = {
  icebreaker: IcebreakerIcon,
  truth_dare: TruthOrDareIcon,
  spin_bottle: SpinBottleIcon,
  drawing: DrawingIcon,
  guess_word: WordIcon,
  guess_movie: MovieIcon,
  word_chain: WordChainIcon,
  imposter: ImposterIcon,
  never_have: NeverHaveIcon,
  most_likely: MostLikelyIcon,
  charades: CharadesIcon,
  would_rather: WouldRatherIcon,
};

export default function GameIcon({ gameId, size = 48, color = COLORS.cream }: Props) {
  const Icon = ICONS[gameId];
  if (!Icon) return null;
  return (
    <View style={{ width: size, height: size }}>
      <Icon color={color} />
    </View>
  );
}
