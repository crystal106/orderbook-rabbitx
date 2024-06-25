export const conversion = (inputArray: string[][]):number[][] => {
  return inputArray.map((item) => [parseFloat(item[0]), parseFloat(item[1])] );
}

export const formatNumber = (arg: number): string => {
  return new Intl.NumberFormat('en-US').format(arg);
};

export const formatPrice = (arg: number): string => {
  return arg.toLocaleString("en", {
    useGrouping: true,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  });
};