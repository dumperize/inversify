const path = require('path');
const util = require('util');
const glob = require('glob');
const fs = require('fs');
const childProcess = require('child_process');


const encoding = 'utf8';

const exec = (command) => {
  return new Promise((resolve, reject) => {
    childProcess.exec(command, (err, stdout) => {
      err ? reject(err) : resolve(stdout);
    });
  });
};

const fsUtils = Object.entries(fs).reduce((acc, [name, item]) => {
  const isFnWithCallback = /^[a-z].+(?<!Sync)$/.test(name) && 'function' === typeof item;

  if (isFnWithCallback) {
    const promisifiedFn = util.promisify(item);

    if ('readFile' === name) {
      acc[name] = filePath => promisifiedFn(filePath, encoding);
    } else if ('writeFile' === name) {
      acc[name] = (filePath, fileContent) => promisifiedFn(filePath, fileContent, { encoding });
    } else {
      acc[name] = promisifiedFn;
    }
  }

  return acc;
}, {});

exports.asyncNodeUtils = {
  glob: util.promisify(glob),
  exec,
  ...fsUtils,
};

exports.resolveFromRoot = path.resolve.bind(null, process.cwd());

exports.errorHandler = (err) => {
  console.log(err.message || err); // eslint-disable-line no-console
  process.exit(1);
};

exports.escapePathToImport = (pathStr) => {
  return pathStr.replace(/\\/g, '/');
};

exports.generateSearchFilesPattern = (paths, extensions) => {
  const getList = (valueOrList) => (Array.isArray(valueOrList) ? valueOrList : [valueOrList]);
  const getPatternItem = (valuesList) => (valuesList.length > 1 ? `{${valuesList}}` : valuesList);

  const pathsList = getList(paths);
  const extensionsList = getList(extensions).map(ext => ext.replace('.', ''));

  return `${getPatternItem(pathsList)}/**/*.${getPatternItem(extensionsList)}`;
};

exports.cleanOrCreateDir = async (dir) => {
  const isGitHooksDirExists = await fsUtils.exists(dir);
  if (isGitHooksDirExists) {
    const existedFileNames = await fsUtils.readdir(dir);
    await Promise.all(
      existedFileNames.map((fileName) => fsUtils.unlink(path.join(dir, fileName))),
    );
  } else {
    await fsUtils.mkdir(dir);
  }
};
