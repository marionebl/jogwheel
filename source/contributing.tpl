<%= props.partials.header('', ['found-an-issue', 'want-to-contribute', 'coding-rules', 'commit-rules']) %>

Yeay! You want to contribute to ${props.pkg.name}. That's amazing!
To smoothen everyone's experience involved with the project please take note of the following guidelines and rules.

## Found an Issue?
Thank you for reporting any issues you find. We do our best to test and make ${props.pkg.name} as solid as possible, but any reported issue is a real help.
[![Issues][issue-image]][issue-url]

Please follow these guidelines when reporting issues:
* Provide a title in the format of `<Error> when <Task>`
* Tag your issue with the tag `bug`
* Provide a short summary of what you are trying to do
* Provide the log of the encountered error if applicable
* Provide the exact version of ${props.pkg.name}. Check `npm ls ${props.pkg.name}` when in doubt
* Be awesome and consider contributing a [pull request](#want-to-contribute)

## Want to contribute?
You consider contributing changes to ${props.pkg.name} – we dig that!
Please consider these guidelines when filing a pull request:

> ${props.pkg.name} pull requests

[![Pull requests][pr-image]][pr-url]

* Follow the [Coding Rules](#coding-rules)
* Follow the [Commit Rules](#commit-rules)
* Make sure you rebased the current master branch when filing the pull request
* Squash your commits when filing the pull request
* Provide a short title with a maximum of 100 characters
* Provide a more detailed description containing
	* What you want to achieve
	* What you changed
	* What you added
	* What you removed

## Coding Rules
To keep the code base of ${props.pkg.name} neat and tidy the following rules apply to every change

> Coding standards

![Ecmascript version][ecma-image] [![Javascript coding style][codestyle-image]][codestyle-url]

* [Happiness](/sindresorhus/xo) enforced via eslint
* Use advanced language features where possible
* JSdoc comments for everything
* Favor micro library over swiss army knives (rimraf, ncp vs. fs-extra)
* Coverage never drops below 90%
* No change may lower coverage by more than 5%
* Be awesome

## Commit Rules
To help everyone with understanding the commit history of ${props.pkg.name} the following commit rules are enforced.
To make your life easier ${props.pkg.name} is commitizen-friendly and provides the npm run-script `commit`.

> Commit standards

[![Commitizen friendly][commitizen-image]][commitizen-url]

* [conventional-changelog](/commitizen/cz-conventional-changelog)
* present tense
* maximum of 100 characters
* message format of `$type($scope): $message`

<%= props.partials.footer() %>
