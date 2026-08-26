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
