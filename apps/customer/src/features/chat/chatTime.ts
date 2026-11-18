/** "4:22 PM", the way the design stamps a message the customer has just sent. */
export function formatChatTime(date: Date): string {
  const hours = date.getHours();
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hour12}:${minutes} ${hours < 12 ? 'AM' : 'PM'}`;
}
