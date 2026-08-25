/**
 * Computes the number of days since a product was opened
 */
export function getDaysSinceOpened(openedAt?: string): number | null {
  if (!openedAt) return null;
  const openDate = new Date(openedAt);
  if (isNaN(openDate.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  openDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - openDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Formats duration since opened into readable string (e.g. "Opened today", "Opened 14 days ago", "Opened 3 months ago")
 */
export function formatOpenedDuration(openedAt?: string): string {
  const days = getDaysSinceOpened(openedAt);
  if (days === null) return 'Unopened';
  if (days === 0) return 'Opened today';
  if (days === 1) return 'Opened yesterday';
  if (days < 30) return `Opened ${days} days ago`;

  const months = Math.floor(days / 30);
  if (months === 1) return 'Opened 1 month ago';
  if (months < 12) return `Opened ${months} months ago`;

  const years = Math.floor(months / 12);
  if (years === 1) return 'Opened 1 year ago';
  return `Opened ${years} years ago`;
}

/**
 * Formats a date string (YYYY-MM-DD) into editorial readable date (e.g. "August 12, 2026")
 */
export function formatProductDate(dateString?: string): string {
  if (!dateString) return 'Not set';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Returns PAO status helper info
 */
export function getPAOStatus(openedAt?: string, paoMonths?: number): {
  isNotice: boolean;
  message: string;
} {
  if (!openedAt || !paoMonths || paoMonths === 0) {
    return { isNotice: false, message: '' };
  }

  const days = getDaysSinceOpened(openedAt);
  if (days === null) return { isNotice: false, message: '' };

  const openedMonths = days / 30;
  if (openedMonths >= paoMonths) {
    return {
      isNotice: true,
      message: `Open for ${Math.floor(openedMonths)} months (recommended use: ${paoMonths}m)`,
    };
  }

  return { isNotice: false, message: `PAO: ${paoMonths} months` };
}
