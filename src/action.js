const core = require('@actions/core');
const github = require('@actions/github');


async function run() {
    try {
        const token = core.getInput("repo-access-token", { required: true });
        const context = github.context;

        if(context.payload.pull_request == undefined){
            throw new Error("Can't get pull request payload");
        }
        const octokit = github.getOctokit(token);
        const {assignees, number, user: { login: author }}  = context.payload.pull_request;
        const collaborators = await octokit.request('GET /repos/{owner}/{repo}/collaborators', {
            owner: context.repo.owner,
            repo: context.repo.repo
        });
        var usernames = [];
        for(i = 0; i < collaborators.length; i++)
            usernames.push(collaborators.data[i].login)
        core.info(`@${author} @${usernames}`)      
    }
    catch (error) {
        core.setFailed(error.message)
    }
}

run();