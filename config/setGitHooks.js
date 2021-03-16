const path = require('path');

const {
  resolveFromRoot, asyncNodeUtils, cleanOrCreateDir, errorHandler, escapePathToImport,
} = require('./utils');


const gitHooksDir = resolveFromRoot('.git/hooks');
const nodeGitHooksScriptsDir = resolveFromRoot('config/gitHooks/scripts');

const gitHooksNames = [
  'applypatch-msg',
  'pre-applypatch',
  'post-applypatch',
  'pre-commit',
  'pre-merge-commit',
  'prepare-commit-msg',
  'commit-msg',
  'post-commit',
  'pre-rebase',
  'post-checkout',
  'post-merge',
  'pre-push',
  'pre-receive',
  'update',
  'proc-receive',
  'post-receive',
  'post-update',
  'reference-transaction',
  'push-to-checkout',
  'pre-auto-gc',
  'post-rewrite',
  'sendemail-validate',
  'fsmonitor-watchman',
  'p4-changelist',
  'p4-prepare-changelist',
  'p4-post-changelist',
  'p4-pre-submit',
  'post-index-change',
];

function getGitHookFileContent(gitHookName) {
  const nodeGitHookScript = path.join(nodeGitHooksScriptsDir, `${gitHookName}.js`);
  return `
#!/usr/bin/env node

(async () => {
  try {
    const nodeGitHook = require('${escapePathToImport(nodeGitHookScript)}');
    await nodeGitHook.run(process.argv.slice(2));
  } catch (err) {
    if (err.code !== 'MODULE_NOT_FOUND') {
      console.log('[ERROR] (${gitHookName})', err.message || err);
    }
  }
})();
  `.trim();
}

function createGitHooksFiles() {
  return Promise.all(
    gitHooksNames.map(async (gitHookName) => {
      const filePath = path.join(gitHooksDir, gitHookName);
      const fileContent = getGitHookFileContent(gitHookName);
      await asyncNodeUtils.writeFile(filePath, fileContent);
      await asyncNodeUtils.chmod(filePath, '774');
    }),
  );
}

async function setGitHooks() {
  try {
    await cleanOrCreateDir(gitHooksDir);
    await createGitHooksFiles();
    await asyncNodeUtils.exec(`git config core.hooksPath ${gitHooksDir}`);
  } catch (err) {
    errorHandler(err);
  }
}

setGitHooks();
