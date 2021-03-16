const colors = require('colors');

const { asyncNodeUtils, errorHandler, generateSearchFilesPattern } = require('./utils');
const { cssModulesPaths } = require('./webpack/constants');


const searchFilesPattern = generateSearchFilesPattern(cssModulesPaths, '.scss.d.ts');

async function clearStyleTypings() {
  try {
    const dTsFilesPaths = await asyncNodeUtils.glob(searchFilesPattern);
    const results = await Promise.allSettled(dTsFilesPaths.map(filePath => asyncNodeUtils.unlink(filePath)));

    const rejected = results.filter(({ status }) => 'rejected' === status);

    if (rejected.length) {
      const messageHeader = colors.yellow('\nClear style typings errors:\n');
      const messageBody = rejected.map(({ reason }) => colors.red(reason)).join('\n');

      throw new Error(messageHeader + messageBody);
    }
  } catch (err) {
    errorHandler(err);
  }
}

clearStyleTypings();
