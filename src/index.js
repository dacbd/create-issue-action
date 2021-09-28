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

    // required but defaults not handled by action.yml
    const repoContext = Github.context.repo;
    const owner = Core.getInput('owner') || repoContext.owner;
    const repo = Core.getInput('repo') || repoContext.repo;
    const title = Core.getInput('title', rtrue);

    // optional
    const body = Core.getInput('body');
    const milestone = Core.getInput('milestone');
    const labels = Core.getInput('labels');
    const assignees = Core.getInput('assignees');

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

    // https://docs.github.com/en/rest/reference/issues#create-an-issue
    const newIssue = await octokit.rest.issues.create(opts);
    console.log('Created:', newIssue.data.html_url);
  } catch (err) {

    Core.setFailed(err.message);
  }
})();
