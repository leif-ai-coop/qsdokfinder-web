export const formatVerfahren = (name, number) => {
  if (!name) return '';
  if (!number) return name;

  const num = parseInt(number, 10);
  if (isNaN(num)) return name;

  const paddedNumber = num < 10 ? `0${num}` : `${num}`;
  return `${paddedNumber}. ${name}`;
};
