import { getDaysSinceOpened, getMonthsSinceOpened, getPAOStatus } from '../productDate.utils';
import { getLocalDateString } from '../../../routines/utils/routineDate.utils';

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return getLocalDateString(date);
};

describe('productDate.utils', () => {
  it('treats a date key opened today as 0 days, regardless of timezone', () => {
    expect(getDaysSinceOpened(getLocalDateString())).toBe(0);
    expect(getDaysSinceOpened(daysAgo(10))).toBe(10);
  });

  it('returns null for unopened products', () => {
    expect(getDaysSinceOpened(undefined)).toBeNull();
    expect(getMonthsSinceOpened(undefined)).toBeNull();
  });

  it('counts whole calendar months since opening', () => {
    const today = new Date();
    const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
    expect(getMonthsSinceOpened(getLocalDateString(threeMonthsAgo))).toBe(3);
  });

  it('flags a product as past its PAO only once the limit is reached', () => {
    const today = new Date();
    const sixMonthsAgo = getLocalDateString(new Date(today.getFullYear(), today.getMonth() - 6, today.getDate()));
    expect(getPAOStatus(sixMonthsAgo, 6).isExpired).toBe(true);
    expect(getPAOStatus(sixMonthsAgo, 12).isExpired).toBe(false);
    expect(getPAOStatus(sixMonthsAgo, undefined).isExpired).toBe(false);
    expect(getPAOStatus(undefined, 6).isExpired).toBe(false);
  });
});
