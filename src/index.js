const Core = require('@actions/core');
const Github = require('@actions/github');

const listToArray = (str) => {
  const arr = str.split(',');
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].trim();
  }
  return arr;
};

(async () => {

  try {

    const rtrue = { required: true };
    const token = Core.getInput('token', rtrue);
    Core.debug(`Using token: ${token}`);

    // required but defaults not handled by action.yml
    const repoContext = Github.context.repo;
    const owner = Core.getInput('owner') || repoContext.owner;
    const repo = Core.getInput('repo') || repoContext.repo;
    const title = Core.getInput('title', rtrue);
    Core.debug(`Using owner: ${owner}`);
    Core.debug(`Using repo: ${repo}`);
    Core.debug(`Using title: ${title}`);

    // optional
    const body = Core.getInput('body');
    const milestone = Core.getInput('milestone');
    const labels = Core.getInput('labels');
    const assignees = Core.getInput('assignees');
    Core.debug(`Using body: ${body}`);
    Core.debug(`Using milestone: ${milestone}`);
    Core.debug(`Using labels: ${labels}`);
    Core.debug(`Using assignees: ${assignees}`);

  } catch (err) {
    Core.error(err);
    Core.setFailed('Unable to parsing inputs');
  }
  try {
    const octokit = Github.getOctokit(token);
    const opts = Object.fromEntries(Object.entries({
      owner,
      repo,
      title,
      body: body == '' ? null : body,
      milestone: milestone == '' ? null : milestone,
      labels: labels ? listToArray(labels) : null,
      assignees: assignees ? listToArray(assignees) : null
    }).filter(([_, v]) => v != null));
    Core.debug(`Object for new issue: ${opts}`)
  } catch (err) {
    Core.error(err);
    Core.setFailed('Unable to create object for new issue')
  }
  try {
    // https://docs.github.com/en/rest/reference/issues#create-an-issue
    const newIssue = await octokit.rest.issues.create(opts);
    Core.info(`Created: ${newIssue.data.html_url}`)
  } catch (err) {
    Core.error(err);
    Core.setFailed('Request to create new issue failed');
  }
})();
