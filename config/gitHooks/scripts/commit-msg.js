const { BRANCH_TYPES, DIT_PREFIX, YT_PREFIX } = require('../constants');
const { asyncNodeUtils, resolveFromRoot } = require('../../utils');
const { getDitTask, getYtTask, getAndCacheGitBranchName } = require('../utils');


const space = '[-_\\s]';

const branchTypesStr = `(${BRANCH_TYPES.join('|')})`;

function parseBranchName(branchName) {
  const getTaskIdRegexp = (prefix) => new RegExp(`(?<=${`^|${space}`})${prefix}${space}(\\d+)`);
  const find = (regexp) => (branchName.match(regexp) || [])[1];

  const regexpBranchType = new RegExp(`^${branchTypesStr}`, 'i');
  const regexpDIT = getTaskIdRegexp(DIT_PREFIX);
  const regexpYT = getTaskIdRegexp(YT_PREFIX);

  const branchType = find(regexpBranchType);
  const ditTaskId = find(regexpDIT);
  const ytTaskId = find(regexpYT);

  return [branchType || BRANCH_TYPES[0], ditTaskId, ytTaskId];
}

function generateMessagePrefix(taskType, ditTaskId, ytTaskId) {
  const messagePrefixItems = [
    taskType && taskType.replace(/^./, symbol => symbol.toUpperCase()),
    ditTaskId && getDitTask(ditTaskId),
    ytTaskId && getYtTask(ytTaskId),
  ];

  return messagePrefixItems.filter(Boolean).join(' ');
}

function createNewCommitMessage(messagePrefix, commitMessage) {
  const taskIdStr = `(${DIT_PREFIX}|${YT_PREFIX})-\\d+`;
  const taskIdWithSpaces = `${taskIdStr}${space}+`;
  const regexpPrefix = new RegExp(`^${branchTypesStr}${space}+${taskIdWithSpaces}(${taskIdWithSpaces})?`, 'i');

  const cleanedCommitMessage = commitMessage.trim().replace(regexpPrefix, '');

  return [messagePrefix, cleanedCommitMessage].filter(Boolean).join(' ');
}

exports.run = async (argv) => {
  const branchName = await getAndCacheGitBranchName();

  const commitMessageFile = resolveFromRoot(argv[0]);
  const commitMessage = await asyncNodeUtils.readFile(commitMessageFile);

  const [taskType, ditTaskId, ytTaskId] = parseBranchName(branchName);
  const isPrefixNeeded = Boolean(ditTaskId || ytTaskId) && !/^Merge/.test(commitMessage);

  const messagePrefix = isPrefixNeeded ? generateMessagePrefix(taskType, ditTaskId, ytTaskId) : '';
  const newCommitMessage = createNewCommitMessage(messagePrefix, commitMessage);

  await asyncNodeUtils.writeFile(commitMessageFile, newCommitMessage);
};
