const fetch = require('node-fetch');

const {
  BRANCH_TYPES, DIT_PREFIX, YT_PREFIX, YT_TOKEN, YT_CUSTOM_FIELD_ID,
} = require('../constants');
const { asyncNodeUtils } = require('../../utils');
const { getDitTask, getYtTask, getAndCacheGitBranchName } = require('../utils');


const space = '[-_]';

const taskRegexpStr = (prefix) => `(?:${prefix}${space}*(\\d+)${space}*)?`;
const regexp = new RegExp(`^([a-z]+)${space}+${taskRegexpStr(DIT_PREFIX)}${taskRegexpStr(YT_PREFIX)}(.*)`, 'i');

async function fetchDitTask(ytTask) {
  try {
    const url = `https://youtrack.cosysoft.ru/api/issues/${ytTask}/customFields/${YT_CUSTOM_FIELD_ID}?fields=value`;
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer perm:${YT_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    const { value } = await response.json();
    return value || null;
  } catch (err) {
    return null;
  }
}

async function getTasks(ditTaskId, ytTaskId) {
  let ditTask = ditTaskId ? getDitTask(ditTaskId) : null;
  const ytTask = ytTaskId ? getYtTask(ytTaskId) : null;

  if (!ditTask && ytTask) {
    ditTask = await fetchDitTask(ytTask);
  }
  return [ditTask, ytTask];
}

function createNewBranchName(branchType, ditTask, ytTask, branchDescription) {
  const type = BRANCH_TYPES.includes(branchType) ? branchType : BRANCH_TYPES[0];
  const description = branchDescription ? branchDescription.replace(/-/g, '_') : '';

  const branchNameItems = ditTask || ytTask ? [type, ditTask, ytTask, description] : [branchType, description];

  return branchNameItems.filter(Boolean).join('_');
}

exports.run = async () => {
  const branchName = await getAndCacheGitBranchName();

  const match = branchName.match(regexp);
  if (!match) {
    return;
  }

  const [, branchType, ditTaskId, ytTaskId, branchDescription] = match;

  const [ditTask, ytTask] = await getTasks(ditTaskId, ytTaskId);
  const newBranchName = createNewBranchName(branchType, ditTask, ytTask, branchDescription);

  await asyncNodeUtils.exec(`git branch -m ${newBranchName}`);
};
