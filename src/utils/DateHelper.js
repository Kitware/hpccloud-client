const TIME_UNITS = [
  { label: 'month', labelPlurial: 'months', base: 730 },
  { label: 'week', labelPlurial: 'weeks', base: 168 },
  { label: 'day', labelPlurial: 'days', base: 24 },
];

export function getRelativeTimeLabel(value) {
  const hoursFromNow = getHoursFromNow(value);

  if (hoursFromNow < 24) {
    return 'now';
  }
  let remain = hoursFromNow;
  const strBuffer = [];
  for (let i = 0; i < TIME_UNITS.length; i++) {
    const { label, labelPlurial, base } = TIME_UNITS[i];
    if (remain >= base) {
      strBuffer.push(Math.floor(remain / base));
      strBuffer.push(remain / base >= 2 ? labelPlurial : label);
      remain %= base;
    }
  }
  return strBuffer.join(' ');
}

export function getHoursFromNow(strDate) {
  return Math.round((Date.now() - new Date(strDate)) / 3600000);
}
