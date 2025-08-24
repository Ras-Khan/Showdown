export default function getCountdown(airdate: string): string {
  const now = new Date();
  const target = new Date(airdate);
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return 'Already aired';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return `${days}d ${hours}h ${minutes}m`;
}
