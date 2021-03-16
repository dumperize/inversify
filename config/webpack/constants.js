const { resolveFromRoot } = require('../utils');


const componentsPath = resolveFromRoot('app/src/components');

const cssModulesPaths = [
  componentsPath,
  resolveFromRoot('app/src/Pages'),
];

const sassResources = [
  resolveFromRoot('app/src/sass/utils/_index.scss'),
  resolveFromRoot('app/src/sass/constants/_index.scss'),
  resolveFromRoot('app/src/sass/functions/_index.scss'),
  resolveFromRoot('app/src/sass/mixins/_index.scss'),
];

module.exports = {
  componentsPath,
  cssModulesPaths,
  sassResources,
};
