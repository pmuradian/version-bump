import { exec } from '@actions/exec'
import * as core from '@actions/core'

export async function createAndMergeVersionBumpPullRequest ({
    versionBumpBranch,
    commitMessage,
    branch
}) {
    try {
        await exec('git', ['push', 'origin', versionBumpBranch,])

        await exec(`gh pr create --base ${branch} --title "${commitMessage}" --body "${commitMessage}"`)

        await exec('gh pr merge --merge --admin')

    } catch (err: any) {
        // remove version bump branch from remote if creating or merging fails
        await exec('git', ['push', 'origin', `:${versionBumpBranch}`])

        core.setFailed(err.message)
        console.log(err)
        process.exit(1)
    }
}