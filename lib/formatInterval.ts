export function formatInterval(interval: number) {
  let seconds = Math.abs(interval);
  let minutes = 0;
  let hours = 0;

  if(interval === 0) {
    return `T-0S`;
  }

  if(seconds >= 60) {
    minutes = Math.floor(seconds / 60);
    seconds %= 60;
  }

  const units = [];

  if(seconds > 0) {
    units.unshift(`${seconds}S`);
  }

  if(minutes >= 60) {
    hours = Math.floor(minutes / 60);
    minutes %= 60;
  }

  if(minutes > 0) {
    units.unshift(`${minutes}M`);
  }

  if(hours > 0) {
    units.unshift(`${hours}H`);
  }

  return 'T' + (interval > 0 ? '+' : '-') + units.join('');
}