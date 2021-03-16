const path = require('path');

const { DIT_PREFIX, YT_PREFIX } = require('./constants');
const { asyncNodeUtils, resolveFromRoot, cleanOrCreateDir } = require('../utils');


exports.getDitTask = (ditTaskId) => [DIT_PREFIX, ditTaskId].join('-');

exports.getYtTask = (ytTaskId) => [YT_PREFIX, ytTaskId].join('-');

exports.getAndCacheGitBranchName = async () => {
  const tempDir = resolveFromRoot('config/gitHooks/temp');
  const tempBranchFile = path.join(tempDir, 'branch.txt');

  const refPrefix = 'ref: refs/heads/';

  const headFileContent = await asyncNodeUtils.readFile(resolveFromRoot('.git/HEAD'));

  if (headFileContent.startsWith(refPrefix)) {
    const branchName = headFileContent.replace('ref: refs/heads/', '').trim();

    await cleanOrCreateDir(tempDir);
    await asyncNodeUtils.writeFile(tempBranchFile, branchName);

    return branchName;
  }
  if (await asyncNodeUtils.exists(tempBranchFile)) {
    const tempBranchFileContent = await asyncNodeUtils.readFile(tempBranchFile);
    return tempBranchFileContent.trim();
  }
  return '';
};
