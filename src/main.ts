import * as core from '@actions/core'
import * as fs from 'fs'
import { commitVersionBump } from './commit'
import { addVersionBumpTag } from './createTag'
import { setupForVersionBump } from './gitSetupHelper'
import { createAndMergeVersionBumpPullRequest } from './githubHelper'

async function run() {
    const githubToken = process.env.GITHUB_TOKEN
    const versionName = core.getInput('version_name')
    const versionCode = core.getInput('version_code')
    const wearableVersionName = core.getInput('wearable_version_name')
    const wearableVersionCode = core.getInput('wearable_version_code')
    const brand = core.getInput('brand')
    const region = core.getInput('region')
    const GITHUB_REF = process.env.GITHUB_REF || ''
    const branch =
        core.getInput('branch') ||
        process.env.BRANCH ||
        GITHUB_REF.replace('refs/heads/', '') ||
        GITHUB_REF.split('/').reverse()[0] ||
        'develop'
    
    if (!versionName) {
        console.log('Skipping version bump')
    } else {
        const versionPath = core.getInput('version_file')
        if (!fs.existsSync(versionPath)) {
            fs.writeFileSync(versionPath, '0.0.0', 'utf8')
        }
    
        const versionsAsString = fs.readFileSync(versionPath, 'utf8').toString().trim()
        const versionsAsList = versionsAsString.split(/\r?\n/)
    
        var versionNameKey = `${brand.toUpperCase()}_${region.toUpperCase()}_VERSION_NAME`
        var versionCodeKey = `${brand.toUpperCase()}_${region.toUpperCase()}_VERSION_CODE`
        var wearableVersionNameKey = `${brand.toUpperCase()}_WEARABLE_${region.toUpperCase()}_VERSION_NAME`
        var wearableVersionCodeKey = `${brand.toUpperCase()}_WEARABLE_${region.toUpperCase()}_VERSION_CODE`
    
        var oldVersionName = ''
        var oldVersionCode = ''
        var newVersionName = ''
        var newVersionCode = ''

        const updatedVersions = versionsAsList.map( line => {
            const splitVersionLine = line.split('=')
            if (splitVersionLine[0] == versionNameKey) {
                oldVersionName = splitVersionLine[1]
                splitVersionLine[1] = versionName == '' ? oldVersionName : versionName
                newVersionName = splitVersionLine[1]
            }
            if (splitVersionLine[0] == versionCodeKey) {
                oldVersionCode = splitVersionLine[1]
                splitVersionLine[1] = versionCode == '' ? `${parseInt(oldVersionCode) + 1}` : versionCode
                newVersionCode = splitVersionLine[1]
            }
            if (splitVersionLine[0] == wearableVersionNameKey) {
                splitVersionLine[1] = wearableVersionName == '' ? versionName : wearableVersionName
            }
            if (splitVersionLine[0] == wearableVersionCodeKey) {
                splitVersionLine[1] = wearableVersionCode == '' ? `${parseInt(splitVersionLine[1]) + 1}` : wearableVersionCode
            }
            return splitVersionLine[0] + '=' + splitVersionLine[1]
        }
    ).join('\n')

        console.log('Old versions:')
        console.log(versionsAsString)
        console.log('New versions:')
        console.log(updatedVersions)
    
        console.log('Writing new version file')
        fs.writeFileSync(versionPath, updatedVersions, 'utf8')
    
        const prefix = 'prefix'
        const postfix = 'postfix'
    
        const tagName = `${prefix}-${versionName}`
        const commitMessage = `Bump ${brand} ${region} version from ${oldVersionName} (${oldVersionCode}) to ${newVersionName} (${newVersionCode})`
        const versionBumpBranch = `chore/${brand.toLocaleLowerCase()}-${postfix}-version-bump`

        await setupForVersionBump({
            userEmail: 'octtovius@bethinklabs.com',
            userName: 'Octto Octtovius',
            githubToken: githubToken,
            githubActor: process.env.GITHUB_ACTOR,
            githubRepository: process.env.GITHUB_REPOSITORY,
        })
    
        await commitVersionBump({
            versionBumpBranch: versionBumpBranch,
            commitMessage: commitMessage,
        })

        await createAndMergeVersionBumpPullRequest({
            versionBumpBranch: versionBumpBranch,
            commitMessage: commitMessage,
            branch: branch
        })

        await addVersionBumpTag({
            branch: branch,
            tagName: tagName
        })
    }
}

try {
    run()
} catch (e) {
    console.error(e)
}
