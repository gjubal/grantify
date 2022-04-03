import { formatDistanceToNow, isPast } from 'date-fns';

export default function isWithinDateRange(date: Date, dayRange: number) {
  const distanceToNow = formatDistanceToNow(date).split(' ');
  return (
    (Number(distanceToNow[0]) <= dayRange &&
      ['day', 'days'].includes(distanceToNow[1]) &&
      !isPast(date)) ||
    ['hours'].includes(distanceToNow[distanceToNow.length - 1])
  );
}
