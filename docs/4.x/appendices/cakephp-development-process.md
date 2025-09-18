# CakePHP Development Process

CakePHP projects broadly follow [semver](https://semver.org/). This means that:

- Releases are numbered in the form of **A.B.C**
- **A** releases are *major releases*. They contain breaking changes and will
  require non-trivial amounts of work to upgrade to from a lower **A** release.
- **A.B** releases are *feature releases*. Each version will be backwards
  compatible but may introduce new deprecations. If a breaking change is
  absolutely required it will be noted in the migration guide for that release.
- **A.B.C** releases are *patch* releases. They should be backwards compatible
  with the previous patch release. The exception to this rule is if a security
  issue is discovered and the only solution is to break an existing API.

See the [Backwards Compatibility Guide](../contributing/backwards-compatibility) for what we consider to be
backwards compatible and a breaking changes.

## Major Releases

Major releases introduce new features and can remove functionality deprecated in
an earlier release. These releases live in `next` branches that match their
version number such as `5.next`. Once released they are promoted into `master`
and then `5.next` branch is used for future feature releases.

## Feature Releases

Feature releases are where new features or extensions to existing features are
shipped. Each release series receiving updates will have a `next` branch. For
example `4.next`. If you would like to contribute a new feature please target
these branches.

## Patch Releases

Patch releases fix bugs in existing code/documentation and should always be
compatible with earlier patch releases from the same feature release. These
releases are created from the stable branches. Stable branches are often named
after the release series such as `3.x`.

## Release Cadence

- *Major Releases* are delivered approximately every two to three years. This timeframe
  forces us to be deliberate and considerate with our breaking changes and gives
  time for the community to keep up without feeling like they are being left
  behind.
- *Feature Releases* are delivered every five to eight months.
- *Patch Releases* Are initially delivered every two weeks. As a feature release
  matures this cadence relaxes to a monthly schedule.

## Deprecation Policy

Before a feature can be removed in a major release it needs to be deprecated.
When a behavior is deprecated in release **A.x** it will continue to work for
remainder of all **A.x** releases. Deprecations are generally indicated via PHP
warnings. You can enable deprecation warnings by adding `E_USER_DEPRECATED` to
your application's `Error.level` value.

Once deprecated behavior is not removed until the next major release. For
example behavior deprecated in `4.1` will be removed in `5.0`.
