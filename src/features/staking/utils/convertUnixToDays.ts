export const convertUnixToDays = (maturity: bigint | undefined) => {
  if (!maturity) {
    return;
  }

  const currentTime = Date.now();
  const maturityTime = Number(maturity) * 1000;
  const timeDifferenceInMilliseconds = maturityTime - currentTime;

  const timeDifferenceInDays = Math.floor(
    timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24),
  );

  const timeDifferenceInHours = Math.floor(
    (timeDifferenceInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );

  const timeDifferenceInMinutes = Math.floor(
    (timeDifferenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60),
  );

  // returning false means that time is up
  if (
    timeDifferenceInDays <= 0 &&
    timeDifferenceInHours <= 0 &&
    timeDifferenceInMinutes <= 0
  )
    return false;

  return {
    days: timeDifferenceInDays,
    hours: timeDifferenceInHours,
    minutes: timeDifferenceInMinutes,
  };
};
