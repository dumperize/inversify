const colors = require('colors');

const { asyncNodeUtils, errorHandler, generateSearchFilesPattern } = require('./utils');
const { cssModulesPaths, sassResources } = require('./webpack/constants');


const searchFilesPattern = generateSearchFilesPattern(cssModulesPaths, '.scss');

function createTsmCommand() {
  const commandBase = 'tsm'; // tsm - cli command from typed-scss-modules npm package

  const tmsArguments = {
    exportType: 'default',
    nameFormat: 'none',
    logLevel: 'error',
    implementation: 'sass',
  };

  const args = Object.entries(tmsArguments).flatMap(([key, value]) => [`--${key}`, value]);

  return [commandBase, searchFilesPattern, ...args].join(' ');
}

async function modifySassFiles(sassFilesPaths, isInjecting) {
  const sassImportsContent = sassResources.map(resource => `@import "${resource}";\n`).join('');

  const promises = sassFilesPaths.map(
    async (filePath) => {
      const fileContent = await asyncNodeUtils.readFile(filePath);

      const newFileContent = isInjecting
        ? sassImportsContent + fileContent
        : fileContent.replace(sassImportsContent, '');

      if (fileContent !== newFileContent) {
        await asyncNodeUtils.writeFile(filePath, newFileContent);
      }
    },
  );

  const results = await Promise.allSettled(promises);
  const rejected = results.filter(res => 'rejected' === res.status);

  if (rejected.length) {
    const messageHeader = colors.yellow(`\nSass imports ${isInjecting ? 'injecting' : 'reverting'} errors:\n`);
    const messageBody = rejected.map(({ reason }) => colors.red(reason)).join('\n');
    throw new Error(messageHeader + messageBody);
  }
}

async function generateStyleTypings() {
  const sassFilesPaths = await asyncNodeUtils.glob(searchFilesPattern);

  try {
    await modifySassFiles(sassFilesPaths, true);
    const resultMessage = await asyncNodeUtils.exec(createTsmCommand());

    if (resultMessage) {
      const messageHeader = ('\nCannot generate style typings for next files:\n');
      const messageBody = resultMessage
        .replace(/(?<=\d)\s.+\.scss\[\d+:\d+]\)$/gm, '\n\n')
        .replace(/^[^\s\d].+$/gm, match => colors.red(match))
        .replace(/(?<=^\s+|\s+)\^+/gm, match => colors.red(match))
        .replace(/^\s+.+\.scss\s\d+:\d+$/gm, match => {
          const [lineAndColumn, filePath, ...spaces] = match.split(' ').reverse();
          const [line, column] = lineAndColumn.split(':');
          return `${spaces.join('')} ${colors.cyan(filePath)}:${Number(line) - sassResources.length}:${column}`;
        });
      throw new Error(messageHeader + messageBody);
    }

    await modifySassFiles(sassFilesPaths, false);
  } catch (err) {
    await modifySassFiles(sassFilesPaths, false);
    errorHandler(err);
  }
}

generateStyleTypings();
