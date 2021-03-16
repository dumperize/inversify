const { getAndCacheGitBranchName } = require('../utils');


exports.run = async () => {
  await getAndCacheGitBranchName();
};
