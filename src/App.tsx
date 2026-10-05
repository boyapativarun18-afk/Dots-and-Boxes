/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Achievement,
  AIDifficulty,
  BoardPreset,
  DailyChallenge,
  Edge,
  GameMode,
  GameSettings,
  GameStatistics,
  PlayerConfig,
  PlayerId,
  ScreenState,
} from './types/game';
import { THEMES } from './types/theme';
import {
  applyMove,
  createInitialGameState,
  DotsGameState,
  undoGameMove,
} from './game/gameEngine';
import { selectAIMove, AI_DELAYS } from './ai/aiEngine';
import { audio } from './audio/audioEngine';
import { StorageManager } from './storage/storageManager';

import { Navbar } from './components/Navbar';
import { MainMenu } from './components/MainMenu';
import { GameSetup } from './components/GameSetup';
import { Board } from './components/Board';
import { HUD } from './components/HUD';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { StatisticsModal } from './components/StatisticsModal';
import { AchievementsModal } from './components/AchievementsModal';
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  // Persistent Settings & Data
  const [settings, setSettings] = useState<GameSettings>(() => StorageManager.getSettings());
  const [stats, setStats] = useState<GameStatistics>(() => StorageManager.getStats());
  const [achievements, setAchievements] = useState<Achievement[]>(() =>
    StorageManager.getAchievements()
  );
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge>(() =>
    StorageManager.getTodayDailyChallenge()
  );

  // App Screen & Modals
  const [screen, setScreen] = useState<ScreenState>('menu');
  const [isPauseOpen, setIsPauseOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGameOverOpen, setIsGameOverOpen] = useState(false);
  const [newlyUnlockedAchievements, setNewlyUnlockedAchievements] = useState<Achievement[]>([]);

  // Match State
  const [gameMode, setGameMode] = useState<GameMode>('ai');
  const [boardPreset, setBoardPreset] = useState<BoardPreset>(settings.defaultBoard);
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>(settings.defaultDifficulty);

  const [players, setPlayers] = useState<Record<PlayerId, PlayerConfig>>({
    1: {
      id: 1,
      name: 'Player 1',
      isAI: false,
      avatar: '1',
      colorName: 'Cyan',
      initial: '1',
    },
    2: {
      id: 2,
      name: 'RoboTactician',
      isAI: true,
      avatar: 'AI',
      colorName: 'Rose',
      initial: 'AI',
    },
  });

  const [gameState, setGameState] = useState<DotsGameState>(() =>
    createInitialGameState(settings.defaultBoard, 1)
  );
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [hasStartedActiveMatch, setHasStartedActiveMatch] = useState(false);
  const [boardSessionKey, setBoardSessionKey] = useState(0);

  const aiTimerRef = useRef<number | null>(null);

  // Sync settings with AudioEngine
  useEffect(() => {
    audio.setSoundEnabled(settings.soundEnabled);
    audio.setMusicEnabled(settings.musicEnabled);
    audio.setMasterVolume(settings.masterVolume);
  }, [settings]);

  const clearAiTimer = useCallback(() => {
    if (aiTimerRef.current !== null) {
      clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }
    setIsAiThinking(false);
  }, []);

  const handleAchievementUnlock = (ach: Achievement) => {
    setNewlyUnlockedAchievements((prev) => [ach, ...prev]);
  };

  // Evaluate post-game achievements and stats
  const handleGameEnd = useCallback(
    (finalState: DotsGameState, mode: GameMode, diff: AIDifficulty) => {
      const p1Score = finalState.scores[1];
      const p2Score = finalState.scores[2];
      const winner = finalState.winner;
      const isP1Win = winner === 1;
      const isDraw = winner === 'draw';
      const isAI = mode === 'ai' || mode === 'daily';

      // Update streak
      const currentStreak = isP1Win ? stats.currentStreak + 1 : 0;
      const longestStreak = isP1Win
        ? Math.max(stats.longestStreak, currentStreak)
        : stats.longestStreak;

      // Update statistics
      const newStats: GameStatistics = {
        ...stats,
        gamesPlayed: stats.gamesPlayed + 1,
        gamesWon: isP1Win ? stats.gamesWon + 1 : stats.gamesWon,
        gamesLost: !isP1Win && !isDraw ? stats.gamesLost + 1 : stats.gamesLost,
        draws: isDraw ? stats.draws + 1 : stats.draws,
        totalBoxesCaptured: stats.totalBoxesCaptured + p1Score + (mode === 'pvp' ? p2Score : 0),
        bestScore: Math.max(stats.bestScore, p1Score, mode === 'pvp' ? p2Score : 0),
        currentStreak,
        longestStreak,
        byDifficulty: {
          ...stats.byDifficulty,
          ...(isAI
            ? {
                [diff]: {
                  played: (stats.byDifficulty[diff]?.played || 0) + 1,
                  won: isP1Win
                    ? (stats.byDifficulty[diff]?.won || 0) + 1
                    : stats.byDifficulty[diff]?.won || 0,
                  lost: !isP1Win && !isDraw
                    ? (stats.byDifficulty[diff]?.lost || 0) + 1
                    : stats.byDifficulty[diff]?.lost || 0,
                },
              }
            : {}),
        },
        pvpGamesPlayed: mode === 'pvp' ? stats.pvpGamesPlayed + 1 : stats.pvpGamesPlayed,
        dailyChallengesCompleted:
          mode === 'daily' && isP1Win && p1Score >= dailyChallenge.targetBoxes && !dailyChallenge.completed
            ? stats.dailyChallengesCompleted + 1
            : stats.dailyChallengesCompleted,
      };

      StorageManager.saveStats(newStats);
      setStats(newStats);

      // Check Achievements
      // 1. First victory against AI or local friend
      if (isP1Win || (mode === 'pvp' && winner === 2)) {
        StorageManager.unlockAchievement('first_win', handleAchievementUnlock);
      }

      // 2 & 3. Streaks
      StorageManager.updateStreakProgress(currentStreak, handleAchievementUnlock);

      // 4. Box collector (15 or more boxes in a game)
      if (p1Score >= 15 || (mode === 'pvp' && p2Score >= 15)) {
        StorageManager.unlockAchievement('box_collector', handleAchievementUnlock);
      }

      // 5. Defeat Hard AI
      if (isP1Win && isAI && diff === 'hard') {
        StorageManager.unlockAchievement('beat_hard', handleAchievementUnlock);
      }

      // 6. Defeat Expert AI
      if (isP1Win && isAI && diff === 'expert') {
        StorageManager.unlockAchievement('beat_expert', handleAchievementUnlock);
      }

      // 7. Perfect game (opponent captured 0 boxes)
      if (isP1Win && p2Score === 0) {
        StorageManager.unlockAchievement('perfect_game', handleAchievementUnlock);
      }

      // 8. Daily Champion
      if (mode === 'daily' && isP1Win && p1Score >= dailyChallenge.targetBoxes) {
        const updatedDaily = StorageManager.completeDailyChallenge(p1Score);
        setDailyChallenge(updatedDaily);
        StorageManager.unlockAchievement('daily_hero', handleAchievementUnlock);
      }

      setAchievements(StorageManager.getAchievements());
      setIsGameOverOpen(true);
    },
    [stats, dailyChallenge]
  );

  // Trigger AI move execution
  const scheduleAiMove = useCallback(
    (currentState: DotsGameState) => {
      clearAiTimer();

      if (currentState.isGameOver || currentState.currentPlayer !== 2) {
        return;
      }

      setIsAiThinking(true);
      const delay = AI_DELAYS[aiDifficulty] || 600;

      aiTimerRef.current = window.setTimeout(() => {
        setIsAiThinking(false);

        const aiEdge = selectAIMove(currentState, aiDifficulty);
        if (!aiEdge) return;

        audio.playLineSnap(2);
        const result = applyMove(currentState, aiEdge);

        if (result.completedBoxes.length > 0) {
          audio.playBoxCompleted(result.completedBoxes.length);
          if (result.extraTurn) {
            audio.playExtraTurn();
          }
        }

        setGameState(result.nextState);

        if (result.isGameOver) {
          handleGameEnd(result.nextState, gameMode, aiDifficulty);
        } else if (result.nextState.currentPlayer === 2) {
          // AI completed a box and gets another turn!
          scheduleAiMove(result.nextState);
        }
      }, delay);
    },
    [aiDifficulty, clearAiTimer, gameMode, handleGameEnd]
  );

  // Player clicks a line on the board
  const handleSelectEdge = (edge: Edge) => {
    if (gameState.isGameOver || isAiThinking) return;

    const isAI = gameMode === 'ai' || gameMode === 'daily';
    // In AI mode, player 1 only plays on turn 1
    if (isAI && gameState.currentPlayer !== 1) return;

    const result = applyMove(gameState, edge);
    if (!result.success) {
      audio.playInvalid();
      return;
    }

    audio.playLineSnap(gameState.currentPlayer);

    if (result.completedBoxes.length > 0) {
      audio.playBoxCompleted(result.completedBoxes.length);
      if (result.extraTurn) {
        audio.playExtraTurn();
      }

      // Check mid-game 15 boxes milestone
      if (result.nextState.scores[1] >= 15) {
        StorageManager.unlockAchievement('box_collector', handleAchievementUnlock);
        setAchievements(StorageManager.getAchievements());
      }
    }

    setGameState(result.nextState);

    if (result.isGameOver) {
      handleGameEnd(result.nextState, gameMode, aiDifficulty);
    } else if (isAI && result.nextState.currentPlayer === 2) {
      // Pass to AI
      scheduleAiMove(result.nextState);
    }
  };

  const handleUndo = () => {
    if (!settings.undoEnabled || isAiThinking) return;
    clearAiTimer();

    const isAI = gameMode === 'ai' || gameMode === 'daily';
    const undoneState = undoGameMove(gameState, isAI);
    if (undoneState) {
      audio.playButtonClick();
      setGameState(undoneState);
      setIsGameOverOpen(false);
    }
  };

  const handleRestart = () => {
    clearAiTimer();
    audio.playButtonClick();
    setBoardSessionKey((k) => k + 1);
    setNewlyUnlockedAchievements([]);
    const fresh = createInitialGameState(boardPreset, 1);
    setGameState(fresh);
    setIsPauseOpen(false);
    setIsGameOverOpen(false);
  };

  const handleStartGame = (
    mode: GameMode,
    preset: BoardPreset,
    difficulty: AIDifficulty,
    p1Name: string,
    p2Name: string
  ) => {
    clearAiTimer();
    audio.playButtonClick();
    setBoardSessionKey((k) => k + 1);
    setNewlyUnlockedAchievements([]);

    setGameMode(mode);
    setBoardPreset(preset);
    setAiDifficulty(difficulty);

    const isVsAI = mode === 'ai' || mode === 'daily';
    setPlayers({
      1: {
        id: 1,
        name: p1Name,
        isAI: false,
        avatar: '1',
        colorName: 'Cyan',
        initial: p1Name.charAt(0).toUpperCase() || '1',
      },
      2: {
        id: 2,
        name: p2Name,
        isAI: isVsAI,
        avatar: isVsAI ? 'AI' : '2',
        colorName: 'Rose',
        initial: isVsAI ? 'AI' : p2Name.charAt(0).toUpperCase() || '2',
      },
    });

    const initial = createInitialGameState(preset, 1);
    setGameState(initial);
    setHasStartedActiveMatch(true);
    setScreen('playing');
    setIsGameOverOpen(false);
    setIsPauseOpen(false);
  };

  const handlePlayDailyChallenge = (challenge: DailyChallenge) => {
    handleStartGame(
      'daily',
      challenge.boardPreset,
      challenge.difficulty,
      'Challenger',
      `Daily ${challenge.difficulty.toUpperCase()} AI`
    );
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (screen === 'playing') {
        if (e.key === 'Escape') {
          setIsPauseOpen((prev) => !prev);
        } else if ((e.key === 'r' || e.key === 'R') && !e.ctrlKey && !e.metaKey) {
          handleRestart();
        } else if ((e.key === 'u' || e.key === 'U') && !e.ctrlKey && !e.metaKey) {
          handleUndo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, gameState, settings.undoEnabled, isAiThinking]);

  const activeTheme = THEMES[settings.theme] || THEMES.classic;

  return (
    <div
      className={`min-h-screen w-full flex flex-col transition-colors duration-300 ${activeTheme.bgGradient} ${
        activeTheme.isDark ? 'text-white' : 'text-black'
      } select-none`}
    >
      {/* Top Bar adhering to Top Bar Contract */}
      <Navbar
        currentScreen={screen}
        onNavigate={(target) => {
          clearAiTimer();
          setScreen(target);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() => {
          const toggled = !settings.soundEnabled;
          const next = { ...settings, soundEnabled: toggled };
          setSettings(next);
          StorageManager.saveSettings(next);
        }}
        hasActiveGame={hasStartedActiveMatch}
        themeId={settings.theme}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col items-center justify-center w-full px-2 sm:px-4 py-4 sm:py-6">
        {screen === 'menu' && (
          <MainMenu
            onStartVsAI={() => {
              setGameMode('ai');
              setScreen('setup');
            }}
            onStart2P={() => {
              setGameMode('pvp');
              setScreen('setup');
            }}
            onNavigate={(target) => setScreen(target)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            dailyCompleted={dailyChallenge.completed}
            unlockedAchievementsCount={achievements.filter((a) => a.unlockedAt).length}
            themeId={settings.theme}
          />
        )}

        {screen === 'setup' && (
          <GameSetup
            initialMode={gameMode}
            onBack={() => setScreen('menu')}
            onStartGame={handleStartGame}
            defaultBoard={settings.defaultBoard}
            defaultDifficulty={settings.defaultDifficulty}
            themeId={settings.theme}
          />
        )}

        {screen === 'playing' && (
          <div className="w-full flex flex-col items-center justify-center gap-2 max-w-4xl mx-auto animate-fade-in">
            <HUD
              gameState={gameState}
              players={players}
              themeId={settings.theme}
              isAiThinking={isAiThinking}
              canUndo={settings.undoEnabled && gameState.moveHistory.length > 0}
              onUndo={handleUndo}
              onRestart={handleRestart}
              onPause={() => setIsPauseOpen(true)}
              isVsAI={gameMode === 'ai' || gameMode === 'daily'}
            />

            <Board
              key={boardSessionKey}
              gameState={gameState}
              players={players}
              themeId={settings.theme}
              isAiThinking={isAiThinking}
              onSelectEdge={handleSelectEdge}
              disabled={isPauseOpen || isGameOverOpen}
              reducedMotion={settings.reducedMotion}
            />
          </div>
        )}

        {screen === 'how-to-play' && (
          <HowToPlayModal
            onBack={() => setScreen(hasStartedActiveMatch ? 'playing' : 'menu')}
            themeId={settings.theme}
          />
        )}

        {screen === 'stats' && (
          <StatisticsModal
            stats={stats}
            onBack={() => setScreen('menu')}
            onStatsUpdated={(newStats) => setStats(newStats)}
            themeId={settings.theme}
          />
        )}

        {screen === 'achievements' && (
          <AchievementsModal
            achievements={achievements}
            onBack={() => setScreen('menu')}
            onAchievementsReset={() => {
              const resetList = StorageManager.resetAchievements();
              setAchievements(resetList);
            }}
            themeId={settings.theme}
          />
        )}

        {screen === 'daily' && (
          <DailyChallengeModal
            challenge={dailyChallenge}
            onBack={() => setScreen('menu')}
            onPlayChallenge={handlePlayDailyChallenge}
            themeId={settings.theme}
          />
        )}
      </main>

      {/* Floating Modals */}
      <PauseModal
        isOpen={isPauseOpen}
        onResume={() => setIsPauseOpen(false)}
        onRestart={handleRestart}
        onOpenSettings={() => {
          setIsPauseOpen(false);
          setIsSettingsOpen(true);
        }}
        onOpenHowToPlay={() => {
          setIsPauseOpen(false);
          setScreen('how-to-play');
        }}
        onQuitToMenu={() => {
          clearAiTimer();
          setIsPauseOpen(false);
          setHasStartedActiveMatch(false);
          setScreen('menu');
        }}
        themeId={settings.theme}
      />

      <GameOverModal
        isOpen={isGameOverOpen}
        gameState={gameState}
        players={players}
        onPlayAgain={handleRestart}
        onChangeBoard={() => {
          setIsGameOverOpen(false);
          setScreen('setup');
        }}
        onMainMenu={() => {
          setIsGameOverOpen(false);
          setHasStartedActiveMatch(false);
          setScreen('menu');
        }}
        unlockedAchievements={newlyUnlockedAchievements}
        themeId={settings.theme}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateSettings={(newSettings) => {
          setSettings(newSettings);
          StorageManager.saveSettings(newSettings);
        }}
      />
    </div>
  );
}
