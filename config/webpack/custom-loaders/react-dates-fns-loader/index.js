const loaderUtils = require('loader-utils');


const defaultOptions = {
  locales: ['en-US'],
};

function getLocaleJsName(locale) {
  return locale.replace(/-/g, '');
}

function getLocales(loaderOptions) {
  const options = loaderOptions || defaultOptions;
  const rawLocales = [...options.locales, ...defaultOptions.locales];

  return [...new Set(rawLocales)];
}

function getSourceBody(locales) {
  const localesImports = locales.map(locale => {
    return `const ${getLocaleJsName(locale)} = require('date-fns/locale/${locale}');`;
  }).join('\n');

  const localesObj = `
    const locales = {
      ${locales.map(locale => getLocaleJsName(locale)).join(',\n')}
    };
  `;

  const getLocaleFunction = `
    module.exports = function getLocale(locale) {
      return locales[locale] || locales.${getLocaleJsName(defaultOptions.locales[0])};
    };
  `;

  return `
    ${localesImports}
    ${localesObj}
    ${getLocaleFunction}
  `;
}

module.exports = function reactDatesFnsLoader(source) {
  const getLocaleRegexp = /react-dates-fns\/lib\/utils\/getLocale.js$/;

  if (!getLocaleRegexp.test(loaderUtils.getCurrentRequest(this))) {
    return source;
  }

  const locales = getLocales(loaderUtils.getOptions(this));
  return getSourceBody(locales);
};
