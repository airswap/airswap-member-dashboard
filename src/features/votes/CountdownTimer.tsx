import { intervalToDuration } from "date-fns";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export const CountdownTimer = ({
  className,
  to,
  completionContent: expiryText = "00:00:00",
}: {
  className?: string;
  /**
   * The time to count down to in milliseconds (js timestamp)
   */
  to: number;
  completionContent?: string;
}) => {
  const [timeRemaining, setTimeRemaining] = useState<string>();
  useEffect(() => {
    const update = () => {
      if (to < Date.now()) {
        return setTimeRemaining(expiryText);
      }
      const now = new Date();
      const target = new Date(to);
      const remaining = intervalToDuration({
        start: now,
        end: target,
      });
      setTimeRemaining(
        `${remaining.hours?.toString().padStart(2, "0")}:${remaining.minutes
          ?.toString()
          .padStart(2, "0")}:${remaining.seconds?.toString().padStart(2, "0")}`,
      );
    };
    update();
    const interval = setInterval(update, 500);
    return clearInterval.bind(null, interval);
  }, [to, expiryText]);

  return <span className={twMerge("", className)}>{timeRemaining}</span>;
};
