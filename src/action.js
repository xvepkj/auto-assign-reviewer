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
        const {requested_reviewers ,assignees, number, user: { login: author }}  = context.payload.pull_request;
        const collaborators = await octokit.request('GET /repos/{owner}/{repo}/collaborators', {
            owner: context.repo.owner,
            repo: context.repo.repo
        });
        if(requested_reviewers.length > 0){
            core.info("Pull request already has a reviewer")
        } else {
            var reviewers = []
            for(i = 0; i < collaborators.data.length; i++){
                if(author != collaborators.data[i].login){
                    reviewers.push(collaborators.data[i].login)
                }
            }
            if(reviewers.length <=0){
                core.info("Not enough collaborators to assign as a reviewer")
            } else {   
                const reviewer = reviewers[Math.floor(Math.random() * reviewers.length)];
                await octokit.rest.pulls.requestReviewers({
                    owner: context.repo.owner,
                    repo: context.repo.repo,
                    pull_number: context.payload.pull_request.number,
                    reviewers: [reviewer],
                    team_reviewers: undefined
                })
                core.info(`Assigned @${reviewer} as reviewer`);   
            }
        }
    
    }
    catch (error) {
        core.setFailed(error.message);
    }
}

run();