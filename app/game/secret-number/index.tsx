// ── Secret Number Game Screen ──
//
// Thin switch renderer. All game logic lives in useSecretNumber.
// This file only: reads players from global store, initializes the hook,
// and routes to the correct phase component based on `game.phase`.
//
// Unlike spin-bottle (single monolith file), this game is fully modular:
// each phase is its own file under features/secret-number/.

import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useApp } from "@/store/useApp";
import { useSecretNumber } from "@/features/secret-number/useSecretNumber";
import PhaseRules from "./_rules";
import PhaseCategory from "./_category";
import PhaseDistribution from "./_distribution";
import PhaseSorting from "./_sorting";
import PhaseResults from "./_results";
import { COLORS } from "@/theme/tokens";

export default function SecretNumberScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state } = useApp();
  const game = useSecretNumber(state.players);

  return (
    <SafeAreaView style={[styles.container]}>
      {game.phase === "rules" && (
        <PhaseRules
          onBack={() => router.back()}
          onStart={() => game.setPhase("category")}
        />
      )}
      {game.phase === "category" && (
        <PhaseCategory
          selectedCategory={game.category}
          onSelectCategory={game.selectCategory}
          onBack={() => game.setPhase("rules")}
          onNext={() => game.setPhase("distribution")}
        />
      )}
      {game.phase === "distribution" && (
        <PhaseDistribution
          players={game.players}
          assignments={game.assignments}
          onGenerate={game.generate}
          onBack={() => game.setPhase("category")}
          onStartGame={() => game.setPhase("sorting")}
        />
      )}
      {game.phase === "sorting" && (
        <PhaseSorting
          assignments={game.assignments}
          avatars={state.avatars}
          onBack={() => game.setPhase("distribution")}
          onFinalize={game.finalize}
        />
      )}
      {game.phase === "results" && (
        <PhaseResults
          submittedOrder={game.submittedOrder ?? []}
          correctOrder={game.correctOrder}
          avatars={state.avatars}
          onExit={game.reset}
          onRedo={() => game.setPhase("category")}
          onGoHome={() => router.replace("/")}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
});
