import { compareDesc, isBefore, isEqual } from 'date-fns';

export default function isSameOrBefore(
  date1: Date,
  date2: Date,
  property?: string,
) {
  switch (property) {
    case 'full':
      return isBefore(date1, date2) || isEqual(date1, date2);
    case 'year':
      return date1.getFullYear() <= date2.getFullYear();
    case 'month':
      return (
        isBefore(date1.getFullYear(), date2.getFullYear()) ||
        (isEqual(date1.getFullYear(), date2.getFullYear()) &&
          date1.getMonth() <= date2.getMonth())
      );
    case 'date':
      return (
        isBefore(date1.getFullYear(), date2.getFullYear()) ||
        (isEqual(date1.getFullYear(), date2.getFullYear()) &&
          date1.getMonth() < date2.getMonth()) ||
        (isEqual(date1.getFullYear(), date2.getFullYear()) &&
          isEqual(date1.getMonth(), date2.getMonth()) &&
          date1.getDate() <= date2.getDate())
      );
    default:
      return compareDesc(date1, date2);
  }
}
