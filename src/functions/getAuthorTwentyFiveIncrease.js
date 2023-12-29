export const getAuthorTwentyFiveIncrease = (number) => {
  const rangeSize = 25;
  const rangeCount = Math.ceil(number / rangeSize);
  const maxNumber = rangeSize * rangeCount;

  if (number <= rangeSize) {
    return rangeSize;
  } else if (number <= rangeSize * 2) {
    return rangeSize * 2;
  } else if (number <= rangeSize * 3) {
    return rangeSize * 3;
  } else if (number <= rangeSize * 4) {
    return rangeSize * 4;
  }
  // Add more conditions if needed

  return maxNumber;
};
