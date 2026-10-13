import en from '../../i18n/translations/en.json';
import tr from '../../i18n/translations/tr.json';

describe('i18n Translation Dictionaries', () => {
  it('should contain matching top-level sections in both English and Turkish dictionaries', () => {
    const enSections = Object.keys(en).sort();
    const trSections = Object.keys(tr).sort();
    expect(enSections).toEqual(trSections);
  });

  it('should contain matching keys in common section', () => {
    const enCommonKeys = Object.keys(en.common).sort();
    const trCommonKeys = Object.keys(tr.common).sort();
    expect(enCommonKeys).toEqual(trCommonKeys);
  });

  it('should contain matching keys in tabs section', () => {
    const enTabKeys = Object.keys(en.tabs).sort();
    const trTabKeys = Object.keys(tr.tabs).sort();
    expect(enTabKeys).toEqual(trTabKeys);
  });

  it('should contain matching keys in profile section', () => {
    const enProfileKeys = Object.keys(en.profile).sort();
    const trProfileKeys = Object.keys(tr.profile).sort();
    expect(enProfileKeys).toEqual(trProfileKeys);
  });
});

describe('i18n key parity', () => {
  const flattenKeys = (dict: Record<string, unknown>, prefix = ''): string[] =>
    Object.entries(dict).flatMap(([key, value]) =>
      value && typeof value === 'object'
        ? flattenKeys(value as Record<string, unknown>, `${prefix}${key}.`)
        : [`${prefix}${key}`]
    );

  it('should define every key in both English and Turkish', () => {
    expect(flattenKeys(tr).sort()).toEqual(flattenKeys(en).sort());
  });

  it('should use the same {{placeholders}} in both languages', () => {
    const lookup = (dict: any, key: string) => key.split('.').reduce((d, k) => d[k], dict) as string;
    const placeholders = (text: string) => (text.match(/{{\w+}}/g) ?? []).sort();
    const mismatched = flattenKeys(en).filter(
      (key) => placeholders(lookup(en, key)).join() !== placeholders(lookup(tr, key)).join()
    );
    expect(mismatched).toEqual([]);
  });
});
