import { exec } from '@actions/exec'

export async function addVersionBumpTag({ branch, tagName}) {
    try {
        await exec(`git pull origin ${branch} --rebase`)

        await exec(`git tag "${tagName}"`)

        await exec('git push origin --tags')

    } catch (err: any) {
        console.log(`Failed to create create tag ${tagName}`)
    }
}
