import { describe, it, expect } from "vitest";
import { sound } from "../src/utils/audioEngine";

describe("AudioEngine (Web Audio API Synthesizer)", () => {
  it("initializes with unmuted state and toggles mute correctly", () => {
    expect(sound.getIsMuted()).toBe(false);

    const muted = sound.toggleMute();
    expect(muted).toBe(true);
    expect(sound.getIsMuted()).toBe(true);

    const unmuted = sound.toggleMute();
    expect(unmuted).toBe(false);
    expect(sound.getIsMuted()).toBe(false);
  });

  it("handles sound trigger calls safely without exceptions in test environment", () => {
    expect(() => sound.playFoghorn()).not.toThrow();
    expect(() => sound.playWarningAlarm()).not.toThrow();
    expect(() => sound.playSuccessChime()).not.toThrow();
    expect(() => sound.playSpreaderClack()).not.toThrow();
  });
});
