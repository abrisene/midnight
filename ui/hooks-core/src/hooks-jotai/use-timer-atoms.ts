// https://codesandbox.io/p/sandbox/jotai-7guis-task4-timer-qt0o4?file=%2Fsrc%2FApp.tsx%3A11%2C17

import { useMemo } from "react";
import { atom, useAtomValue, useSetAtom } from "jotai";

/* -------------------------------------------------------------------------------------------------
 * TYPES
 * -----------------------------------------------------------------------------------------------*/

interface Timer {
  id: ReturnType<typeof setTimeout>;
  started: number;
}

type TimerActions = "start" | "stop";

export interface TimerAtomOptions {
  mode?: "countdown" | "stopwatch";
  elapsed?: number;
  duration?: number;
  startsAt?: Date;
  endsAt?: Date;
  onElapsed?: () => void;
  startOnMount?: boolean;
  resetOnElapsed?: boolean;
}

export interface UseTimerProps extends TimerAtomOptions {}

export type TimerAtoms = ReturnType<typeof createTimerAtoms>;

/* -------------------------------------------------------------------------------------------------
 * HOOKS
 * -----------------------------------------------------------------------------------------------*/

/**
 * Use timer
 * @param param0
 * @returns
 */
export function useTimer({
  mode,
  duration,
  startsAt,
  endsAt,
  onElapsed,
  resetOnElapsed,
  startOnMount,
}: TimerAtomOptions) {
  // Create and memoize the timer atoms.
  const atms = useMemo(() => {
    return createTimerAtoms({
      mode,
      duration,
      startsAt,
      endsAt,
      onElapsed,
      resetOnElapsed,
      startOnMount,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useTimerAtoms(atms);
}

/**
 * Use timer atoms
 * @param timer - The timer atoms
 * @returns The timer state and controls
 */
export function useTimerAtoms(timer: TimerAtoms) {
  const atmDuration = useAtomValue(timer.durationAtom);
  const setDuration = useSetAtom(timer.durationAtom);
  const atmElapsed = useAtomValue(timer.elapsedAtom);

  const start = useSetAtom(timer.startAtom);
  const stop = useSetAtom(timer.stopAtom);
  const toggle = useSetAtom(timer.toggleAtom);
  const reset = useSetAtom(timer.resetAtom);

  return {
    // Data
    duration: atmDuration,
    setDuration,

    elapsed: atmElapsed.elapsed,
    remaining: atmElapsed.remaining,
    proportion: atmElapsed.proportion,
    progress: atmElapsed.progress,

    // Mutation
    start,
    stop,
    toggle,
    reset,
  };
}

/* -------------------------------------------------------------------------------------------------
 * ATOM CREATORS
 * -----------------------------------------------------------------------------------------------*/

/**
 * Create timer atoms
 * @param options.mode - The mode of the timer. "countdown" or "stopwatch"
 * @param options.duration - The duration of the timer in seconds
 * @param options.elapsed - The elapsed time of the timer in seconds
 * @param options.startsAt - The start time of the timer
 * @param options.endsAt - The end time of the timer
 * @param options.onElapsed - The callback to call when the timer elapses
 * @param options.resetOnElapsed - Whether the timer should reset when it elapses
 * @param options.startOnMount - Whether the timer should start on mount
 * @returns The timer atoms
 */
export function createTimerAtoms({
  mode,
  duration,
  elapsed,
  startsAt,
  endsAt,
  onElapsed,
  resetOnElapsed,
  startOnMount,
}: TimerAtomOptions) {
  let initialDuration = duration;
  let initialElapsed = elapsed;

  // If the mode is "countdown", calculate the initial duration based off of the start / end times
  if (mode === "countdown") {
    initialDuration = endsAt
      ? (endsAt.getTime() - (startsAt ?? new Date()).getTime()) / 1000
      : 0;
    initialElapsed = 0;
  } else {
    // If the mode is "stopwatch", use the provided duration
    initialDuration = duration ?? 0;
    initialElapsed = startsAt ? (Date.now() - startsAt.getTime()) / 1000 : 0;
  }

  // Atoms
  const baseDurationAtom = atom(initialDuration);
  const elapsedTimeAtom = atom(initialElapsed);
  const timerAtom = atom<Timer | null>(null);

  // Create the start timer atom
  const startTimerAtom = atom(null, (get, set, action: TimerActions) => {
    // If the action is "start", start the timer
    if (action === "start") {
      // If the timer is already started, don't start it again
      if (get(timerAtom) !== null) return;

      // If the timer has already elapsed, don't start it again
      if (get(elapsedTimeAtom) >= get(baseDurationAtom)) return;

      // Tick function
      const tick = () => {
        const now = performance.now() / 1000;
        const timer = get(timerAtom);

        // Update elapsed time
        if (timer) set(elapsedTimeAtom, now - timer.started);
        const elapsedTime = get(elapsedTimeAtom);

        if (elapsedTime >= get(baseDurationAtom)) {
          if (resetOnElapsed) {
            // If the timer should reset on elapsed, reset the timer
            set(elapsedTimeAtom, 0);
            set(timerAtom, {
              started: timer ? timer.started : now - elapsedTime,
              id: setTimeout(tick, 100),
            });
          } else {
            // Otherwise, clear the timer
            set(timerAtom, null);
          }
          // Call the elapsed callback
          onElapsed?.();
        } else {
          // Otherwise, keep ticking
          set(timerAtom, {
            started: timer ? timer.started : now - elapsedTime,
            id: setTimeout(tick, 100),
          });
        }
      };

      // Start timer
      tick(); // start timer
    }

    // If the action is "stop", clear the timer
    if (action === "stop") {
      const timer = get(timerAtom);
      if (timer) {
        clearTimeout(timer.id);
        set(timerAtom, null);
      }
    }
  });

  // Start the timer on mount
  startTimerAtom.onMount = (dispatch) => {
    if (startOnMount) dispatch("start");
    return () => dispatch("stop");
  };

  // Elapsed time atom
  const elapsedAtom = atom((get) => {
    get(startTimerAtom); // add dependency
    const duration = get(baseDurationAtom);
    const elapsedTime = get(elapsedTimeAtom);
    const remainingTime = Math.max(duration - elapsedTime, 0);
    let proportion = elapsedTime / duration;
    if (proportion > 1) proportion = 1;
    return {
      active: get(timerAtom) !== null,
      elapsed: Math.min(elapsedTime, duration),
      remaining: remainingTime,
      proportion,
      progress: proportion * 100,
    };
  });

  // Duration atom
  const durationAtom = atom(
    (get) => get(baseDurationAtom),
    (_get, set, duration: number) => {
      set(baseDurationAtom, duration);
      set(startTimerAtom, "start");
    },
  );

  // Reset atom
  const resetAtom = atom(null, (get, set) => {
    set(startTimerAtom, "stop");
    set(elapsedTimeAtom, 0);
    set(startTimerAtom, "start");
  });

  // Controls
  const startAtom = atom(null, (get, set) => set(startTimerAtom, "start"));
  const stopAtom = atom(null, (get, set) => set(startTimerAtom, "stop"));
  const toggleAtom = atom(null, (get, set) => {
    if (get(timerAtom) === null) {
      set(startTimerAtom, "start");
    } else {
      set(startTimerAtom, "stop");
    }
  });

  return {
    durationAtom,
    elapsedAtom,
    resetAtom,
    startAtom,
    stopAtom,
    toggleAtom,
  };
}
