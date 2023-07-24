import { exec } from '@actions/exec'
import * as core from '@actions/core'

export async function commitVersionBump ({
    versionBumpBranch,
    commitMessage,
}) {
    try {       
        const options = {
            cwd: process.env.GITHUB_WORKSPACE,
            listeners: {
                stdline: core.debug,
                stderr: core.debug,
                debug: core.debug,
            },
        } as any
        await exec('git', ['checkout', '-b', versionBumpBranch])
        await exec('git', ['add', '-A'], options)
        console.log(`committing changes with message "${commitMessage}"`)
        try {
            await exec('git', ['commit', '-v', '-m', `${commitMessage}`], options)
        } catch (err) {
            core.debug('nothing to commit')
            return
        }
    } catch (err: any) {
        core.setFailed(err.message)
        console.log(err)
        process.exit(1)
    }
}