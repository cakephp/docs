---
title: "Structure & Conventions"
description: "Follow CakePHP's convention over configuration approach. Learn file structure, naming conventions, and how conventions enable automatic wiring."
---

# Structure & Conventions

CakePHP embraces **convention over configuration**. By following conventions, you get free functionality without tracking config files, and create a uniform codebase that other developers can quickly understand. This guide covers both where files go and how to name them.

> [!TIP]
> Following these conventions means CakePHP automatically wires up your application - controllers find their models, views find their templates, and URLs map to actions without any configuration.

## Application Folder Structure

After downloading the CakePHP application skeleton, you'll see these top-level folders:

**Essential Folders:**

- `src/` - Your application's source code (Controllers, Models, Commands, etc.)
- `templates/` - View template files, elements, layouts, and error pages
- `config/` - [Configuration](../development/configuration) files for database, routes, and application settings
- `webroot/` - Public document root containing publicly accessible files

::: details Other Application Folders

**Development & Testing:**

- `tests/` - Your application's test cases
- `bin/` - Cake console executables (`bin/cake bake all`, etc.)

**Runtime & Dependencies:**

- `tmp/` - Temporary data (cache, sessions, logs). Must be writable!
- `logs/` - Application log files. Must be writable!
- `vendor/` - Dependencies installed by [Composer](https://getcomposer.org). **Don't edit - Composer will overwrite changes!**

**Extensions & Localization:**

- `plugins/` - [Plugins](../plugins) used by your application
- `resources/` - Contains `locales/` subfolder for internationalization files

:::

> [!WARNING]
> Make sure `tmp/` and `logs/` folders are writable! Poor performance or errors will occur otherwise. CakePHP warns you in debug mode if they're not writable.

## The src/ Directory

The `src/` folder is where you'll do most development. Here's what goes in each subfolder:

| Folder | Contains | Naming Convention |
|--------|----------|-------------------|
| **Command** | Console commands | `*Command.php` - See [Command Objects](../console-commands/commands) |
| **Console** | Installation scripts | Executed by Composer |
| **Controller** | HTTP request handlers | [Controllers](../controllers), [Components](../controllers/components) |
| **Middleware** | Request/response filters | `*Middleware.php` - See [Middleware](../controllers/middleware) |
| **Model** | Data layer | [Tables](../orm/table-objects), [Entities](../orm/entities), [Behaviors](../orm/behaviors) |
| **View** | Presentation logic | [Views](../views), [Cells](../views/cells), [Helpers](../views/helpers) |

> [!NOTE]
> The `Command/` folder isn't present by default - it's auto-generated when you create your first command using bake.

## Naming Conventions

### Controllers

::: code-group

```php [✅ Correct]
// File: src/Controller/UsersController.php
namespace App\Controller;

class UsersController extends AppController
{
    // URL: /users/view-me
    public function viewMe()
    {
        // camelBacked method names
    }
}
```

```php [❌ Incorrect]
// Wrong: singular, lowercase, no suffix
class user extends AppController
{
    // Wrong: underscores instead of camelCase
    public function view_me()
    {
    }
}
```

:::

**Rules:**

- **Class names:** Plural, CamelCased, end in `Controller`
  - `UsersController`, `MenuLinksController`
- **File names:** Match class name exactly - `UsersController.php`
- **Location:** `src/Controller/UsersController.php`
- **Actions:** camelBacked public methods - `viewMe()`, `editProfile()`
- **URLs:** Lowercase with dashes - `/users/view-me` maps to `viewMe()`

> [!WARNING]
> Only **public** methods are accessible through routing. Protected and private methods cannot be accessed via URLs, providing automatic security for internal helper methods.

> [!TIP]
> **Acronyms:** Treat them as words. `CMS` becomes `CmsController`, not `CMSController`

> [!NOTE]
> CakePHP uses the `DashedRoute` class by convention to automatically convert camelCase action names to dashed URLs. See [Routes Configuration](../development/routing#routes-configuration) for details.

**URL Arrays:**

```php
$this->Html->link('title', [
    'prefix' => 'MyPrefix',      // CamelCased
    'plugin' => 'MyPlugin',      // CamelCased
    'controller' => 'Users',     // CamelCased
    'action' => 'viewProfile'    // camelBacked
]);
```

### Models (Tables & Entities)

::: code-group

```php [✅ Table Class]
// File: src/Model/Table/UsersTable.php
namespace App\Model\Table;

class UsersTable extends Table
{
    // Plural, CamelCased, ends in "Table"
}
```

```php [✅ Entity Class]
// File: src/Model/Entity/User.php
namespace App\Model\Entity;

class User extends Entity
{
    // Singular, CamelCased, no suffix
}
```

:::

**Rules:**

- **Table class:** Plural, CamelCased, ends in `Table`
  - `UsersTable`, `MenuLinksTable`, `UserFavoritePagesTable`
- **Entity class:** Singular, CamelCased, no suffix
  - `User`, `MenuLink`, `UserFavoritePage`
- **Enum class:** `{Entity}{Column}` - e.g., `UserStatus`, `OrderState`
- **Behavior class:** Ends in `Behavior` - `TimestampBehavior`

### Views & Templates

::: code-group

```php [✅ Template Files]
// Controller method: ArticlesController::viewAll()
templates/Articles/view_all.php

// Controller method: MenuLinksController::editItem()
templates/MenuLinks/edit_item.php
```

```php [✅ View Classes]
// File: src/View/ArticlesView.php
class ArticlesView extends View
{
}
```

:::

**Rules:**

- **Template files:** `templates/{Controller}/{underscored_action}.php`
  - Method `viewAll()` → `templates/Articles/view_all.php`
- **View classes:** CamelCased, end in `View` - `ArticlesView.php`
- **Helpers:** CamelCased, end in `Helper` - `BestEverHelper.php`
- **Cells:** CamelCased, end in `Cell` - `InboxCell.php`

> [!NOTE]
> CakePHP uses English inflections by default. For other languages, use `Cake\Utility\Inflector` to define custom rules. See [Inflector](../core-libraries/inflector) documentation.

### Database Tables

::: code-group

```sql [✅ Correct Table Names]
-- Plural, underscored
CREATE TABLE users;
CREATE TABLE menu_links;
CREATE TABLE user_favorite_pages;

-- Foreign keys: {singular_table}_id
ALTER TABLE articles ADD user_id INT;
ALTER TABLE photos ADD menu_link_id INT;

-- Junction tables: alphabetically sorted plurals
CREATE TABLE articles_tags;
```

```sql [❌ Incorrect]
-- Wrong: singular
CREATE TABLE user;

-- Wrong: not underscored
CREATE TABLE MenuLinks;

-- Wrong: plural both words
CREATE TABLE users_favorites_pages;

-- Wrong: not alphabetical
CREATE TABLE tags_articles;
```

:::

**Rules:**

- **Table names:** Plural, underscored - `users`, `menu_links`
- **Multiple words:** Only pluralize the last word - `user_favorite_pages` (not `users_favorites_pages`)
- **Columns:** Underscored - `first_name`, `created_at`
- **Foreign keys:** `{singular_table}_id` - `user_id`, `menu_link_id`
- **Junction tables:** Alphabetically sorted plurals - `articles_tags` (not `tags_articles`)

> [!WARNING]
> The bake command requires junction tables to be alphabetically sorted! Use `articles_tags`, not `tags_articles`.

**Primary Keys:**

- Auto-incrementing integers (default)
- UUIDs: CakePHP generates automatically with `Cake\Utility\Text::uuid()` when using `Table::save()`

> [!TIP]
> If your junction table has extra columns beyond the foreign keys, create a dedicated Table and Entity class for it.

### Plugins

::: code-group

```text [✅ Good Plugin Names]
your-name/cakephp-blog
awesome-dev/cakephp-payment
company/cakephp-api-client
```

```text [❌ Bad Plugin Names]
cakephp/blog          // Reserved namespace!
YourName/CakePHP-Blog // Use lowercase & dashes
your-name/blog        // Missing cakephp- prefix
```

:::

**Rules:**

- Prefix with `cakephp-` in package name
- Use lowercase letters and dashes
- **Never** use `cakephp/` as vendor name (reserved for official plugins)
- Format: `your-vendor/cakephp-plugin-name`

See [awesome list recommendations](https://github.com/FriendsOfCake/awesome-cakephp/blob/master/CONTRIBUTING.md#tips-for-creating-cakephp-plugins) for details.

<a id="file-and-classname-conventions"></a>
<a id="model-and-database-conventions"></a>

## File and Class Name Conventions

All files follow **PSR-4 autoloading** - filenames must match class names exactly:

| Class Type | Class Name | File Name | Location |
|------------|-----------|-----------|----------|
| Controller | `LatestArticlesController` | `LatestArticlesController.php` | `src/Controller/` |
| Component | `MyHandyComponent` | `MyHandyComponent.php` | `src/Controller/Component/` |
| Table | `OptionValuesTable` | `OptionValuesTable.php` | `src/Model/Table/` |
| Entity | `OptionValue` | `OptionValue.php` | `src/Model/Entity/` |
| Behavior | `EspeciallyFunkableBehavior` | `EspeciallyFunkableBehavior.php` | `src/Model/Behavior/` |
| View | `SuperSimpleView` | `SuperSimpleView.php` | `src/View/` |
| Helper | `BestEverHelper` | `BestEverHelper.php` | `src/View/Helper/` |
| Command | `UpdateCacheCommand` | `UpdateCacheCommand.php` | `src/Command/` |

## Complete Example: Articles Feature

Here's how all the conventions work together for a complete feature:

**Database:**

```sql
CREATE TABLE articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    title VARCHAR(255),
    body TEXT,
    created DATETIME,
    modified DATETIME
);

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50),
    email VARCHAR(255)
);
```

**File Structure:**

```text
src/
├── Controller/
│   └── ArticlesController.php    → class ArticlesController
├── Model/
│   ├── Table/
│   │   └── ArticlesTable.php     → class ArticlesTable
│   └── Entity/
│       └── Article.php           → class Article
templates/
└── Articles/
    ├── index.php                 → ArticlesController::index()
    ├── view.php                  → ArticlesController::view()
    └── add.php                   → ArticlesController::add()
```

**How It Works:**

URL: `https://example.com/articles/view/5`

1. Routes to `ArticlesController::view()`
2. Controller automatically loads `ArticlesTable`
3. Method fetches `Article` entity with ID 5
4. Renders `templates/Articles/view.php`

**No configuration required!** CakePHP wires everything automatically through conventions.

::: details Click to see comprehensive reference table

| Component | `articles` Example | `menu_links` Example | Convention |
|-----------|-------------------|---------------------|------------|
| **Database Table** | `articles` | `menu_links` | Plural, underscored |
| **Table Class** | `ArticlesTable` | `MenuLinksTable` | Plural, CamelCased, ends in `Table` |
| **Entity Class** | `Article` | `MenuLink` | Singular, CamelCased |
| **Controller Class** | `ArticlesController` | `MenuLinksController` | Plural, CamelCased, ends in `Controller` |
| **Template Path** | `templates/Articles/` | `templates/MenuLinks/` | Matches controller name |
| **Template File** | `index.php`, `add.php` | `index.php`, `add.php` | Underscored action name |
| **Behavior** | `ArticlesBehavior` | `MenuLinksBehavior` | Ends in `Behavior` |
| **Helper** | `ArticlesHelper` | `MenuLinksHelper` | Ends in `Helper` |
| **Component** | `ArticlesComponent` | `MenuLinksComponent` | Ends in `Component` |
| **View Class** | `ArticlesView` | `MenuLinksView` | Ends in `View` |
| **Plugin Package** | `you/cakephp-articles` | `you/cakephp-menu-links` | Lowercase, dashed, prefixed |

:::

::: details Database Convention Summary

| Convention | Description | Example |
|------------|-------------|---------|
| **Foreign Keys** | `{singular_table}_id` for hasMany/belongsTo/hasOne | Users hasMany Articles → `articles.user_id` |
| **Multi-word FKs** | Use singular of full table name | `menu_links` table → `menu_link_id` |
| **Junction Tables** | Alphabetically sorted plurals | `articles_tags` (not `tags_articles`) |
| **Primary Keys** | Auto-increment INT or UUID | UUID auto-generated via `Text::uuid()` |
| **Column Names** | Underscored for multiple words | `first_name`, `created_at` |

> [!WARNING]
> If junction tables have additional data columns, create a dedicated Table and Entity class for them.

:::

## Next Steps

Now that you understand CakePHP's structure and conventions, try the [Content Management Tutorial](../tutorials-and-examples/cms/installation) to see how everything fits together in a real application.

For routing and URL handling, see [Routes Configuration](../development/routing#routes-configuration).
