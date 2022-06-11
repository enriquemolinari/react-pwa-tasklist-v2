export function status(expirationDate) {
  const diffInMs = Date.parse(expirationDate) - Date.now();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  if (diffInDays <= 2) {
    return "DANGER";
  }
  if (diffInDays > 2 && diffInDays <= 5) {
    return "WARNING";
  }
  if (diffInDays > 5 && diffInDays <= 15) {
    return "FINE";
  }
  return "FUTURE";
}
