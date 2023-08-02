# Contributing

Thank you for your interest in contributing to the AirSwap Voter Rewards app! We welcome contributions no matter their size.

## Issues

While we use GitHub for issue tracking and project management, development is generally coordinated on the [Discord server](https://chat.airswap.io/), which you should join to learn more about how and where to contribute.

## Key libraries

TODO: add this.
- React-Query
- TailwindCSS
- Viem
- Wagmi

## Code Style

When multiple people are working on the same body of code, it is important that everyone conforms to a style. We use a linter for code style, which you can use with a simple command.

```
$ yarn lint
```

For code formatting we use [prettier](https://www.npmjs.com/package/prettier). This will be run after you commit your code but can also be run manually.

```
$ yarn prettier
```

## Styling

TODO:

- Brief intro to tailwind
  - Theming
  - intellisense
- Combining classes with twMerge
- Tailwind best practices
- Giving components `className` prop
- tailwind resources

The tailwind prettier plugin automatically orders classes to ensure a consistent pattern.

## Tanstack query

## Translations (POEditor)

New translations should be added manually to `public/locales/en/translation.json` first. After your PR is merged an admin will add the new translations in [POEditor](https://poeditor.com/). Everything in `public/locales` will eventually be overwritten by POEditor. If you want to help with translating please let us know.

## Pull Requests (PRs)

It’s a good idea to make PRs early on. A PR represents the start of a discussion, and doesn’t necessarily need to be the final, completed submission. Create a [draft PR](https://github.blog/2019-02-14-introducing-draft-pull-requests/) if you're looking for feedback but not ready for a final review. If the PR is in response to a GitHub issue, make sure to notate the issue as well.

Usually your PR is connected to a ticket number, so please put the ticket number (for example 101) in the description of your PR like so:

`Fixes #101`

GitHub’s documentation for working on PRs is available [here](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests).

Once your PR is ready, ensure all checks are passing and request a review.
