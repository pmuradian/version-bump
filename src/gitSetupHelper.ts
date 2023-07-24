import { exec } from '@actions/exec'
import * as core from '@actions/core'

export async function setupForVersionBump({
    userName,
    userEmail,
    githubToken,
    githubActor,
    githubRepository,
}) {
    try {
        if (!githubToken) {
            console.log('missing required env vars, skipping commit creation')
            core.setFailed('missing required env vars')
            return
        }
    
        const REMOTE_REPO = `https://${githubActor}:${githubToken}@github.com/${githubRepository}.git`

        const options = {
            cwd: process.env.GITHUB_WORKSPACE,
            listeners: {
                stdline: core.debug,
                stderr: core.debug,
                debug: core.debug,
            },
        } as any

        await exec('git', ['config', 'user.name', `${userName}`], options)
        await exec('git', ['config', 'user.email', `${userEmail}`], options)
        await exec('git', ['remote', 'set-url', 'origin', REMOTE_REPO], options)
    } catch (err: any) {
        core.setFailed(err.message)
        console.log(err)
        process.exit(1)
    }
}


