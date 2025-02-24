# Contributing

Thank you for considering contributing to the project. To make the process as easy and effective as possible, please follow the guidelines below.

## Reporting Issues

If you find a bug or have a feature request, please report them at this repository's issues section. If you are reporting a bug, please include:

1. Your operating system name and version.
2. Any details about your local setup that might be helpful in troubleshooting.
3. Detailed steps to reproduce the bug.

## Development

To start development, follow these steps:

1. Fork this repository.
2. Create a new branch: `git checkout -b new-branch`.
3. Make your changes.
4. Run tests: `npm test`.
5. Lint your code: `npm run lint`.
6. Commit your changes: `git commit -m 'Add new feature'`.
7. Push to the branch: `git push origin new-branch`.
8. Submit a pull request.
9. Await code review.
10. If all goes well, your pull request will be merged. If it is not merged, we will do our best to explain the reason why.

### Commit Messages

Please ensure your commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format.

#### Commit Message Format

Every commit message should follow the format below:

1. **Type:** This describes the nature of the commit. Types include:

- **feat:** a new feature
- **fix:** a bug fix
- **docs:** changes to documentation
- **style:** formatting, missing semi colons, etc; no code change
- **refactor:** refactoring production code
- **test:** adding tests, refactoring test; no production code change
- **chore:** updating build tasks, package manager configs, etc; no production code change

2. **Scope:** This could be anything specifying the place of the commit change.

3. **Subject:** This is a very short description of the change. First word should be a verb in the present tense (e.g. change, fix, add).

4. Optionally, you can include a longer description of the change. Make sure these are wrapped at 100 characters. Also you can add a footer with information about breaking changes.

#### Examples

- `feat: allow provided config object to extend other configs`
- `fix: stop memory leak in EventManager`
- `docs: correct spelling of CHANGELOG`
- `style(components): remove empty line at the end of index.js`

## Commit Message Convention

We use the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification to enforce a consistent commit message format. This leads to more readable messages that are easy to follow when looking through the project history.

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line (optionally)

## Pull Request Guidelines

Before you submit a pull request, check that it meets these guidelines:

- **Squash your commits:** When you've finished with your feature or bug fix, squash your commits down to a single commit. This makes reverting changes easier and makes the git history easier to read. Use a descriptive commit message following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format.
- **PR Description:** Provide a description for your PR. This is a great place to provide context and discuss the problem you're solving.
- **Review the PR:** Once you submit your PR, it will be reviewed by a maintainer. If it is not approved, you will receive feedback on what to improve.

## License

By contributing to this project, you agree that your contributions will be licensed under its provided license. Also note that this project is released with a [Contributor Code of Conduct](CODE_OF_CONDUCT.md) and [Developer Certificate of Origin](DCO.md). By participating in this project you agree to abide by its terms.
