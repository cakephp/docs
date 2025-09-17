# Release Policy

CakePHP follows Semantic Versioning for all releases. This follows the versioning
convention of **major.minor.patch**.

The development team tries to guarantee each release follow the restrictions and
and guarantees below.

## Major Releases

Major releases are generally not backwards compatible. Although CakePHP tries
to not change many large features in major releases, there are API changes.

Changes in major release can include almost anything but are always used to
remove deprecated features and update interfaces.

Any behavior changes that are not backwards compatible are made in major changes.

Each major release typically comes with an upgrade guide and many automatic
code upgrades using rector.

## Minor Releases

Minor release are generally backwards compatible with the previous minor and patch
release.

Features might be deprecated, but they are never removed in a minor release.

Interfaces are not changed, but annotations might be added for new methods exposed
in implementations provided by CakePHP.

New features are usually only added in minor releases so users can follow migration
notes. New features can also include new exceptions thrown when behavior is fixed
or bugs are reported.

Behavior changes that require documentation are made in minor releases, but these are
still typically backwards compatible. Some exceptions can be made if the issue is severe.

## Patch Releases

Patch releases are always backwards compatible. Only changes that fix broken features
are made.

Typically, users should be able to rely on patch releases not changing behavior except
to fix an issue.

Issues that change long-standing behavior are typically not in patch releases. These are
considered behavior changes and will go into either minor or major releases so users can
migrate.

## Experimental Features

When a new feature is added where the API is still changing, it can be marked **experimental**.

Experimental features should follow the same minor and bug fix release convention. However,
API changes can go into minor releases which might significantly change behavior.

Users should always expect an API to change before experimental features are fully released.
