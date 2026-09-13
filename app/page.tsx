"use client";

import { useEffect, useState } from "react";

import HomeGradient from "../components/home/gradient";

import Navbar from "../components/home/Navbar";
import ModeSelector from "../components/home/ModeSelector";
import CategorySelector from "../components/home/CategorySelector";
import TopicDisplay from "../components/home/TopicDisplay";
import SpinButton from "../components/home/SpinButton";
import ActionButtons from "../components/home/ActionButtons";
import SettingsModal from "../components/home/SettingsModal";
import TimerScreen from "../components/home/TimerScreen";
import DebateSideSelector from "../components/home/DebateSideSelector";

import {
  getRandomTopic,
  topics,
  type Category,
  type Mode,
} from "../data/topics";

type TimerScreenProps = {
  topic: string;
  initialTime?: number;
  onExit: () => void;
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SpeakUp",
    url: "https://speakup.cool",
    description:
      "A speaking practice tool for debates, impromptu speaking, deep research, and persuasion.",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    author: {
      "@type": "Person",
      name: "Rhythm Doshi",
      url: "https://rhythmdoshi.xyz",
    },
  };

  const [selectedMode, setSelectedMode] = useState<Mode>("offTheCuff");

  const [selectedCategory, setSelectedCategory] = useState<Category>("general");

  const [currentTopic, setCurrentTopic] = useState(
    topics.offTheCuff.general[0],
  );

  useEffect(() => {
    setCurrentTopic(getRandomTopic("offTheCuff", "general"));
  }, []);

  const [spinningTopic, setSpinningTopic] = useState<string | null>(null);

  const [isSpinning, setIsSpinning] = useState(false);

  const [isTimerActive, setIsTimerActive] = useState(false);

  const [showSettings, setShowSettings] = useState(false);

  const [speechTime, setSpeechTime] = useState(1);

  const [researchTime, setResearchTime] = useState(5);

  const [timerDuration, setTimerDuration] = useState(60);

  const [timerType, setTimerType] = useState<"speech" | "research">("speech");

  const [debateSide, setDebateSide] = useState<"for" | "against">("for");

  const currentTopics = topics[selectedMode][selectedCategory];

  const [researchExtension, setResearchExtension] = useState(0);

  const [isSoundMuted, setIsSoundMuted] = useState(true);

  const [streakRefreshKey, setStreakRefreshKey] = useState(0);

  function changeMode(mode: Mode) {
    cancelSpin();

    const category = "general";

    setSelectedMode(mode);
    setSelectedCategory(category);

    const nextTopic = getRandomTopic(mode, category, currentTopic);

    setCurrentTopic(nextTopic);
  }

  function changeCategory(category: Category) {
    cancelSpin();

    setSelectedCategory(category);

    const nextTopic = getRandomTopic(selectedMode, category, currentTopic);

    setCurrentTopic(nextTopic);
  }

  function startSpin() {
    if (isSpinning) return;

    const nextTopic = getRandomTopic(
      selectedMode,
      selectedCategory,
      currentTopic,
    );

    setSpinningTopic(nextTopic);
    setIsSpinning(true);
  }

  function finishSpin() {
    if (spinningTopic) {
      setCurrentTopic(spinningTopic);
      setSpinningTopic(null);
    }

    setIsSpinning(false);
  }

  function startTimer() {
    cancelSpin();

    setTimerType("speech");
    setTimerDuration(speechTime * 60);
    setIsTimerActive(true);
  }

  function startResearch() {
    cancelSpin();

    setTimerType("research");
    setTimerDuration(researchTime * 60);
    setIsTimerActive(true);
  }

  function startSpeechFromResearch() {
    setTimerType("speech");
    setTimerDuration(speechTime * 60);
  }

  function exitTimer() {
    setIsTimerActive(false);
  }

  function saveSettings(newSpeechTime: number, newResearchTime: number) {
    setSpeechTime(newSpeechTime);
    setResearchTime(newResearchTime);
    setShowSettings(false);
  }

  function cancelSpin() {
    if (!isSpinning) return;

    setCurrentTopic(spinningTopic ?? currentTopic);
    setSpinningTopic(null);
    setIsSpinning(false);
  }

  function extendResearch() {
    setTimerType("research");
    setTimerDuration(60);
    setResearchExtension((previous) => previous + 1);
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* ONE gradient instance — never unmounts */}
      <HomeGradient />

      <a
        href="https://rhythmdoshi.xyz"
        target="_blank"
        rel="noopener noreferrer"
        className="
    absolute
    bottom-6
    right-6
    z-30
    text-xs
    font-medium
    tracking-wide
    text-white/55
    drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)]
    transition-all
    duration-200
    hover:text-white
    hover:-translate-y-0.5
  "
      >
        Made by{" "}
        <span className="text-white/95 underline underline-offset-2">
          Rhythm Doshi
        </span>{" "}
        ↗
      </a>

      {/* Home UI */}
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center px-5 pb-10">
        <Navbar streakRefreshKey={streakRefreshKey} />

        {/* Everything below navbar disappears during timer */}
        <div
          className={`pt-5 flex w-full flex-1 flex-col items-center transition-opacity duration-300 ${
            isTimerActive
              ? "pointer-events-none invisible opacity-0"
              : "visible opacity-100"
          }`}
        >
          <section className="flex w-full max-w-6xl flex-1 flex-col items-center text-center">
            <ModeSelector
              selectedMode={selectedMode}
              onModeChange={changeMode}
            />

            <CategorySelector
              selectedCategory={selectedCategory}
              onCategoryChange={changeCategory}
            />

            <div className="flex flex-1 flex-col items-center justify-center pb-12 pt-8">
              <TopicDisplay
                topic={currentTopic}
                finalTopic={spinningTopic}
                topics={currentTopics}
                isSpinning={isSpinning}
                isSoundMuted={isSoundMuted}
                onSpinComplete={finishSpin}
              />

              {selectedMode === "debate" && (
                <DebateSideSelector
                  selectedSide={debateSide}
                  onSideChange={setDebateSide}
                />
              )}

              <SpinButton isSpinning={isSpinning} onSpin={startSpin} />

              <ActionButtons
                selectedMode={selectedMode}
                speechTime={speechTime}
                researchTime={researchTime}
                onStartTimer={startTimer}
                onStartResearch={startResearch}
                onSettings={() => {
                  cancelSpin();
                  setShowSettings(true);
                }}
              />
              <label className="mt-4 flex cursor-pointer items-center gap-2 text-xs text-white/40 transition-colors hover:text-white/60">
                <input
                  type="checkbox"
                  checked={isSoundMuted}
                  onChange={(e) => setIsSoundMuted(e.target.checked)}
                  className="h-3.5 w-3.5 cursor-pointer accent-[#ff6e42]"
                />

                <span>Mute sound effects</span>
              </label>
            </div>
          </section>
        </div>
      </div>

      {/* Timer */}
      {isTimerActive && (
        <div className="fixed inset-0 z-[100]">
          <TimerScreen
            topic={currentTopic}
            initialTime={timerDuration}
            type={timerType}
            mode={selectedMode}
            category={selectedCategory}
            onSessionComplete={() => setStreakRefreshKey((value) => value + 1)}
            speechTime={speechTime}
            debateSide={debateSide}
            isDebate={selectedMode === "debate"}
            onExit={exitTimer}
            onStartSpeech={startSpeechFromResearch}
            onExtendResearch={extendResearch}
            researchExtension={researchExtension}
            isSoundMuted={isSoundMuted}
          />
        </div>
      )}

      <SettingsModal
        open={showSettings}
        speechTime={speechTime}
        researchTime={researchTime}
        onSave={saveSettings}
        onClose={() => setShowSettings(false)}
      />
    </main>
  );
}
