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
    const owner = Core.getInput('owner') || Github.context.repository_owner;
    const repo = (Core.getInput('repo',  { required: false }) || Github.context.repo);
    const title = Core.getInput('title', rtrue);

    // optional
    const body = Core.getInput('body');
    const milestone = Core.getInput('milestone');
    const labels = Core.getInput('labels');
    const assignees = Core.getInput('assignees');

    const octokit = Github.getOctokit(token);
    // https://docs.github.com/en/rest/reference/issues#create-an-issue
    console.log('new issues obj', {
      owner,
      repo,
      title,
      body,
      milestone,
      labesl: labels ? listToArray(labels) : null,
      assignees: assignees ? listToArray(assignees) : null
    });

    const newIssue = await octokit.rest.issues.create({
      owner,
      repo,
      title,
      body,
      milestone,
      labesl: labels ? listToArray(labels) : null,
      assignees: assignees ? listToArray(assignees) : null
    });
  } catch (err) {

    Core.setFailed(err.message);
  }
})();
