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

  const timeDifferenceInMinutes = Math.floor(
    (timeDifferenceInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60),
  );

  return {
    days: timeDifferenceInDays,
    minutes: timeDifferenceInMinutes,
  };
};
