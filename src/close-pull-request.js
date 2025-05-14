import * as core from "@actions/core";
import * as github from "@actions/github";

export const run = async () => {
  const context = github.context;

  let token = process.env["GITHUB_TOKEN"] || "";
  if (token === "") {
    token = core.getInput("github_token");
  } else {
    core.warning("GITHUB_TOKEN environment variable is deprecated.");
    core.warning(
      "GitHub Token is passed automatically, so no longer needs to be set."
    );
  }

  const client = new github.GitHub(token);

  // *Optional*. Post an issue comment just before closing a pull request.
  const body = core.getInput("comment") || "";
  if (body.length > 0) {
    core.info("Creating a comment");
    await client.issues.createComment({
      ...context.repo,
      issue_number: context.issue.number,
      body,
    });
  }
  core.info("issue/PR number", context.issue.number);
  core.info("issue/PR number", context.payload?.self?.href);
  core.info("Updating the state of the provided pull request to closed");
  const PRNumber = context.issue.number;
  await client.pulls.update({
    ...context.repo,
    pull_number: PRNumber,
    state: "closed",
  });

  core.info(`Closed a pull request ${PRNumber}`);
};
