export function formatDate(value) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleString();
}

export function shortenText(value, max = 40) {
  if (!value) {
    return '';
  }

  if (value.length <= max) {
    return value;
  }

  return `${value.slice(0, max - 3)}...`;
}