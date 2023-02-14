import { ICssCustomPropertiesParams, IItem } from "./params";

const getAllCSSVariableNames = (sheet: CSSStyleSheet, settings: ICssCustomPropertiesParams = {}) => {
  const { filterProps = [], hiddenProps = [] } = settings;
  if (!sheet || !sheet.cssRules) return [];

  const finalSet: Set<string> = new Set();
  for (const rule of Array.from(sheet.cssRules).filter((rule: CSSRule) => rule.type === 1)) {
    const props = rule.cssText?.match(/--[\w-]+/g);
    if (!props) continue;

    console.log({ props, filterProps, hiddenProps });

    let filtered = props;
    if (filterProps.length > 0) {
      filtered.filter((p: string) => filterProps.some(f => p.match(f)));
      console.log(filterProps, { filtered });
    }

    if (hiddenProps.length > 0) {
      filtered.filter((p: string) => hiddenProps.some(h => !p.match(h)));
      console.log(hiddenProps, { filtered });
    }

    filtered.forEach((f: string) => !finalSet.has(f) && finalSet.add(f));
  }

  return finalSet.size ? Array.from(finalSet) : [];
};

export const getElementCSSVariables = (
  allCSSVars: Array<string>,
  elementStyles: CSSStyleDeclaration,
) => {
  return allCSSVars.reduce((acc: IItem[], key: string) => {
    const value = elementStyles?.getPropertyValue(key)?.trim();

    acc.push({
      key,
      value,
      name: key.replace('--', '').replace(/-./g, (x) => x?.toUpperCase()?.[1]),
      type: CSS.supports('color', value) ? 'color' : 'text',
    });

    return acc;
  }, []);
};

export const getAllCSSVariables = (document: Document, settings: ICssCustomPropertiesParams = {}): IItem[] => {
  if (!document) return [];
  const cssVars = Array.from(document.styleSheets).reduce((acc: string[], sheet: CSSStyleSheet) => {
    getAllCSSVariableNames(sheet, settings)
      .forEach((v: string) => {
        if (!acc.includes(v)) acc.push(v);
      });
    return acc;
  }, []);
  const elStyles = window.getComputedStyle(document.documentElement);
  return getElementCSSVariables(cssVars, elStyles);
};
