import React, { useState } from "react";
import { useCooldown } from "@acausal/hooks/use-timer-cooldown";
import { useInterval } from "@acausal/hooks/use-timer-interval";
import { Button } from "@acausal/ui-core/button";

/* export function TimerExample() {
  const { elapsed, remaining, start, stop, toggle, reset } = useTimer({
    mode: "countdown",
    duration: 60,
    onElapsed: () => console.log("Timer finished!"),
  });

  return (
    <div>
      <p>Remaining: {remaining} seconds</p>
      <button onClick={toggle}>Start/Stop</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
 */
export function CooldownExample() {
  const { start, clear, active } = useCooldown(() => {
    console.log("Cooldown finished!");
  }, 5000);

  return (
    <div className="flex gap-4">
      <Button onClick={start} disabled={active}>
        Start Cooldown
      </Button>
      <Button onClick={clear}>Clear Cooldown</Button>
      {active && <p>Cooldown active...</p>}
    </div>
  );
}

export function IntervalExample() {
  const [count, setCount] = useState(0);
  const { start, stop, toggle, active } = useInterval(() => {
    setCount((c) => c + 1);
  }, 1000);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={toggle}>{active ? "Stop" : "Start"}</button>
    </div>
  );
}
