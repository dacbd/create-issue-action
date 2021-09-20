const Core = require('@actions/core');
const Github = require('@actions/github');

const listToArray = (str) => {
    let arr = str.split(',');
    for (let i = 0; i < arr.length; i++) {
        arr[i] = arr[i].trim();
    }
};

(async () => {

    try {
        
        // default values handled by action.yml
        const rtrue = { required: true };
        const token = Core.getInput('token', rtrue);
        const owner = Core.getInput('owner', rtrue);

        // required but defaults not handled by action.yml
        const repo = (Core.getInput('repo',  { required: false }) || Github.context.repo);
        const title = Core.getInput('title', rtrue);

        // optional
        const body = Core.getInput('body');
        const milestone = Core.getInput('milestone');
        const labels = Core.getInput('labels');
        const assignees = Core.getInput('assignees');

        const octokit = Github.getOctokit(token);
        const newIssue = await octokit.rest.issues.create({
            owner,
            repo,
            title,
            body,
            milestone,
            labels ? listToArray(labels) : null,
            assignees ? listToArray(assignees) : null
        });
    } catch (err) {
        
        Core.setFailed(err.message);
    }
})();


