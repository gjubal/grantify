const convertFromStringToTimestamp = (
  dateStringInMMDDYYY: string | undefined,
): string | null => {
  if (dateStringInMMDDYYY) {
    let [month, day, year] = dateStringInMMDDYYY.split('/');

    if (Number(day) < 10 && day.length === 1) {
      day = `0${day}`;
    }

    if (Number(month) < 10 && month.length === 1) {
      month = `0${month}`;
    }

    return `${year}-${month}-${day}T00:00:00.000Z`;
  }
  return null;
};

export default convertFromStringToTimestamp;
