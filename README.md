# Bump Android version

Initially forked from [remorses/bump-version](https://github.com/remorses/bump-version), but got heavily modified to suit our needs on our project.

This actions does 2 things:

-   Bumps the version number in the provided `version_file`.
-   Creates a tag for the new version (matching our projects tag namming convention).

**Please use the `main` branch as it is the one up to date.**

This is a 4 part process.

- update version file with provided value (src/main.ts)
- commit updated version file into a separate branch (src/gitSetupHelper.ts)
- create and merge a pull request with version update changes (src/commit.ts)
- pull chages and add tag for version update, push tag to remote (src/githubHelper.ts)

**DO NOT FORGET TO RUN `npm run build` AFTER MAKING CHANGES IN .ts FILES.**

## Usage:

```yaml
- name: Bump version
  uses: pmuradian/android-bump-version@main
  with:
      version_file: << version file path >>
      version_name: ${{ inputs.versionName }}
      ... (see full list of arguments in action.yml)
  env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

If git commands get rejected during the workflow it may be because of branch protection rules. In that case pass an admin token instead of default secrets.GITHUB_TOKEN.
