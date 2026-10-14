# Maintained Plugins

The [Piece of Cake 2](https://github.com/pieceofcake2) project maintains the
framework fork together with related repositories and forks of popular
CakePHP 2 plugins. All maintained plugins are compatible with PHP 8.x, and
their CI checks them with [PHPStan](/development/static-analysis) at level 5.
Names link to the documentation site of each package, or to the GitHub
repository where the package has no documentation site.

## Core repositories

- [CakePHP](https://github.com/pieceofcake2/cakephp) - CakePHP 2.x framework
- [App Skeleton](https://pieceofcake2.github.io/app/) - Application skeleton
- [Plugin Skeleton](https://github.com/pieceofcake2/plugin) - Plugin skeleton
- [Bake Plugin](https://pieceofcake2.github.io/bake/) - Code generation tool
- [Upgrade Plugin](https://pieceofcake2.github.io/upgrade/) - Upgrade utility (CakePHP 1.3 to 2.0)

## Development tools

- [PHPStan CakePHP](https://pieceofcake2.github.io/phpstan-cakephp2/) - PHPStan extension for static analysis
  (see [Static Analysis](/development/static-analysis))
- [E2E Test](https://pieceofcake2.github.io/e2e-test/) - Browser end-to-end tests
  with PHPUnit and Symfony Panther (Chrome, PC and mobile)
  (see [E2E Testing](/development/e2e-testing))

## Maintained plugins

### Debugging

- [DebugKit Plugin](https://pieceofcake2.github.io/debug_kit/) - Debug toolbar

### Infrastructure

- [Aws Plugin](https://pieceofcake2.github.io/aws/) - AWS SDK integration
- [Bref Plugin](https://github.com/pieceofcake2/bref) - AWS Lambda deployment with Bref

### Logging & Monitoring

- [Monolog Plugin](https://pieceofcake2.github.io/monolog/) - Monolog integration
- [Sentry Plugin](https://pieceofcake2.github.io/sentry/) - Error tracking and monitoring

### Templating

- [TwigView Plugin](https://pieceofcake2.github.io/twig-view/) - Twig template engine
- [CsvView Plugin](https://pieceofcake2.github.io/csv-view/) - CSV view class

### View Helpers

- [Markdown Plugin](https://pieceofcake2.github.io/markdown/) - Markdown helper
- [MenuBuilder Plugin](https://pieceofcake2.github.io/menu_builder/) - Navigation menu helper
- [Vite Plugin](https://pieceofcake2.github.io/vite/) - Vite asset helper with dev server support
- [WebpackEncore Plugin](https://pieceofcake2.github.io/webpack-encore/) - Webpack Encore asset helper

### Forms & Validation

- [Xform Plugin](https://pieceofcake2.github.io/xform/) - Extended form helper
- [Cakeplus Plugin](https://pieceofcake2.github.io/cakeplus/) - Form utilities and enhancements
- [Captcha Plugin](https://pieceofcake2.github.io/captcha/) - CAPTCHA widget and
  server-side verification with Cloudflare Turnstile (default), Google
  reCAPTCHA v2/v3 or hCaptcha

### Database

- [Datasources Plugin](https://pieceofcake2.github.io/datasources/) - Additional datasources (CSV / TSV files, arrays and more)

### Authentication and Authorization

- [Authenticate Plugin](https://pieceofcake2.github.io/authenticate/) - Authentication classes
- [AclExtras Plugin](https://pieceofcake2.github.io/acl_extras/) - Console tools for managing ACL tables

### Files

- [Upload Plugin](https://pieceofcake2.github.io/upload/) - File upload handling
- [Imagine Plugin](https://pieceofcake2.github.io/imagine/) - Image processing library wrapper
- [CakePdf Plugin](https://pieceofcake2.github.io/cakepdf/) - PDF generation

### SEO

- [Seo Plugin](https://pieceofcake2.github.io/seo/) - Search engine optimization
- [Sitemap Plugin](https://pieceofcake2.github.io/sitemap/) - Sitemap generation

### I18n

- [Localized Plugin](https://pieceofcake2.github.io/localized/) - Localization utilities

## Installing a plugin

Install plugins with Composer and load them as usual with `CakePlugin::load()`.
See each plugin's documentation site for the package name and setup. With the
[modern layout](/appendices/migrating-to-the-modern-layout), Composer installs plugins
into `plugins/` through the `installer-paths` setting.

Plugins that don't support Composer autoloading still need `App::uses()` for
their classes, for example `App::uses('MyPluginHelper', 'MyPlugin.View/Helper')`.

## Contributing

The project welcomes bug reports (especially PHP 8.x compatibility issues),
security vulnerability reports and pull requests.
