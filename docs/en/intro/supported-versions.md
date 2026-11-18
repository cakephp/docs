# Semantic Versioning

See [CakePHP Development Process](../appendices/cakephp-development-process.md) and the [Backwards Compatibility Guide](../contributing/backwards-compatibility)

## CakePHP Supported Versions

This table was last updated in November 2026.
See the [CakePHP wiki](https://github.com/cakephp/cakephp/wiki#supported-versions)
for the latest support status.

| Major Version | Supported Version | PHP Version    | Active Support | Security Support        |
|---------------|-------------------|----------------|----------------|-------------------------|
| `6.x`         | In development    | `8.5`          | Not released   | Not released            |
| `5.x`         | `5.4`             | `8.2` to `8.5` | ✅              | Until the release of `5.7` |
| `5.x`         | `5.3`             | `8.2` to `8.5` | ❌              | Until the release of `5.6` |
| `5.x`         | `5.2`             | `8.1` to `8.5` | ❌              | Until the release of `5.5` |
| `4.x`         | `4.6`             | `7.4` to `8.5` | Until `6.0`    | Until the release of `6.0` |
| `3.x`         | None              | `5.6` to `7.4` | ❌              | ❌                       |
| `2.x`         | None              | `5.3` to `7.4` | ❌              | ❌                       |
| `1.x`         | None              | `¯\_(ツ)_/¯`    | ❌              | ❌                       |

CakePHP 5.5 and 6.0 are in development and do not have release dates yet.
CakePHP 5.5 requires PHP 8.2 or later.

### Major Version Support

We generally support the previous major version for

- 24 months of `active support` (includes new features and bugfixes) and
- 36 months of `security support`

after the release of a new major version. These periods can be extended.

CakePHP 4.4 and 4.5 reached the end of security support on September 9th 2026.
CakePHP 4.6 continues to receive bug fixes and security fixes until CakePHP 6.0 is released.

### Minor Version Support

`Active support` for a minor branch ends when a new minor branch is released,
unless an extension is announced. For example, active support for CakePHP 5.3
ended when CakePHP 5.4 was released. CakePHP 4.6 is an exception, as described above.

`Security updates` will be provided until

- the end of the support period for the major version, or
- 3 new minor releases have been published (e.g. `5.2` support ends when `5.5` is released)

whichever comes first.

> [!TIP]
> Keep production applications on a currently supported major line and plan
> regular upgrades to stay within supported minor ranges.

> [!TIP]
> Each minor and major release of CakePHP includes automated upgrade commands which you
> can use to upgrade your application or plugin. See e.g. the
> [upgrade guide](../appendices/5-0-upgrade-guide.md#use-the-upgrade-tool)
> for more details on how to use these commands.
