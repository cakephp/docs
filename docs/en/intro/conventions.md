# CakePHP Conventions

We are big fans of convention over configuration. While it takes a bit of time
to learn CakePHP's conventions, you save time in the long run. By following
conventions, you get free functionality, and you liberate yourself from the
maintenance nightmare of tracking config files. Conventions also make for a very
uniform development experience, allowing other developers to jump in and help.

## Controller Conventions

Controller class names are plural, CamelCased, and end in `Controller`.
`UsersController` and `MenuLinksController` are both examples of
conventional controller names.

Public methods on Controllers are often exposed as 'actions' accessible through
a web browser. They are camelBacked. For example the `/users/view-me` maps to the `viewMe()` method
of the `UsersController` out of the box (if one uses default dashed inflection in routing).
Protected or private methods cannot be accessed with routing.

For inflection of acronyms it is useful to treat them as words, so `CMS` would be `Cms`.

### URL Considerations for Controller Names

As you've just seen, single word controllers map to a simple lower case URL
path. For example, `UsersController` (which would be defined in the file name
**UsersController.php**) is accessed from `http://example.com/users`.

While you can route multiple word controllers in any way you like, the
convention is that your URLs are lowercase and dashed using the `DashedRoute`
class, therefore `/menu-links/view-all` is the correct form to access
the `MenuLinksController::viewAll()` action.

When you create links using `this->Html->link()`, you can use the following
conventions for the url array:

``` php
$this->Html->link('link-title', [
    'prefix' => 'MyPrefix' // CamelCased
    'plugin' => 'MyPlugin', // CamelCased
    'controller' => 'ControllerName', // CamelCased
    'action' => 'actionName' // camelBacked
]
```

For more information on CakePHP URLs and parameter handling, see
[Routes Configuration](../development/routing#routes-configuration).

<a id="file-and-classname-conventions"></a>

## File and Class Name Conventions

In general, filenames match the class names, and follow the PSR-4 standard for
autoloading. The following are some examples of class names and their filenames:

- The Controller class `LatestArticlesController` would be found in a file
  named **LatestArticlesController.php**
- The Component class `MyHandyComponent` would be found in a file named
  **MyHandyComponent.php**
- The Table class `OptionValuesTable` would be found in a file named
  **OptionValuesTable.php**.
- The Entity class `OptionValue` would be found in a file named
  **OptionValue.php**.
- The Behavior class `EspeciallyFunkableBehavior` would be found in a file
  named **EspeciallyFunkableBehavior.php**
- The View class `SuperSimpleView` would be found in a file named
  **SuperSimpleView.php**
- The Helper class `BestEverHelper` would be found in a file named
  **BestEverHelper.php**

Each file would be located in the appropriate folder/namespace in your app
folder.

<a id="model-and-database-conventions"></a>

## Database Conventions

Table names corresponding to CakePHP models are plural and underscored. For
example `users`, `menu_links`, and `user_favorite_pages`
respectively. Table name whose name contains multiple words should only
pluralize the last word, for example, `menu_links`.

Column names with two or more words are underscored, for example, `first_name`.

Foreign keys in hasMany, belongsTo/hasOne relationships are recognized by
default as the (singular) name of the related table followed by `_id`. So if
Users hasMany Articles, the `articles` table will refer to the `users`
table via a `user_id` foreign key. For a table like `menu_links`
whose name contains multiple words, the foreign key would be
`menu_link_id`.

Join (or "junction") tables are used in BelongsToMany relationships between
models. These should be named for the tables they connect. The names should be
pluralized and sorted alphabetically: `articles_tags`, not `tags_articles`
or `article_tags`. *The bake command will not work if this convention is not
followed.* If the junction table holds any data other than the linking foreign
keys, you should create a concrete entity/table class for the table.

In addition to using an auto-incrementing integer as primary keys, you can also
use UUID columns. CakePHP will create UUID values automatically using
(`Cake\Utility\Text::uuid()`) whenever you save new records using
the `Table::save()` method.

## Model Conventions

Table class names are plural, CamelCased and end in `Table`. `UsersTable`,
`MenuLinksTable`, and `UserFavoritePagesTable` are all examples of
table class names matching the `users`, `menu_links` and
`user_favorite_pages` tables respectively.

Entity class names are singular CamelCased and have no suffix. `User`,
`MenuLink`, and `UserFavoritePage` are all examples of entity names
matching the `users`, `menu_links` and `user_favorite_pages`
tables respectively.

Enum class names should use a `{Entity}{Column}` convention, and enum cases
should use CamelCased names.

## View Conventions

View template files are named after the controller functions they display, in an
underscored form. The `viewAll()` function of the `ArticlesController` class
will look for a view template in **templates/Articles/view_all.php**.

The basic pattern is
**templates/Controller/underscored_function_name.php**.

> [!NOTE]
> By default CakePHP uses English inflections. If you have database
> tables/columns that use another language, you will need to add inflection
> rules (from singular to plural and vice-versa). You can use
> `Cake\Utility\Inflector` to define your custom inflection
> rules. See the documentation about [Inflector](../core-libraries/inflector) for more
> information.

## Plugins Conventions

It is useful to prefix a CakePHP plugin with "cakephp-" in the package name.
This makes the name semantically related on the framework it depends on.

Do **not** use the CakePHP namespace (cakephp) as vendor name as this is
reserved to CakePHP owned plugins. The convention is to use lowercase letters
and dashes as separator:

``` text
// Bad
cakephp/foo-bar

// Good
your-name/cakephp-foo-bar
```

See [awesome list recommendations](https://github.com/FriendsOfCake/awesome-cakephp/blob/master/CONTRIBUTING.md#tips-for-creating-cakephp-plugins)
for details.

## Summarized

By naming the pieces of your application using CakePHP conventions, you gain
functionality without the hassle and maintenance tethers of configuration.
Here's a final example that ties the conventions together:

- Database table: "articles", "menu_links"
- Table class: `ArticlesTable`, found at **src/Model/Table/ArticlesTable.php**
- Entity class: `Article`, found at **src/Model/Entity/Article.php**
- Controller class: `ArticlesController`, found at
  **src/Controller/ArticlesController.php**
- View template, found at **templates/Articles/index.php**

Using these conventions, CakePHP knows that a request to
`http://example.com/articles` maps to a call on the `index()` method of the
`ArticlesController`, where the `Articles` model is automatically available.
None of these relationships have been configured by any means other than by
creating classes and files that you'd need to create anyway.

<table style="width:98%;">
<colgroup>
<col style="width: 10%" />
<col style="width: 23%" />
<col style="width: 20%" />
<col style="width: 43%" />
</colgroup>
<tbody>
<tr>
<td>Example</td>
<td>articles</td>
<td>menu_links</td>
<td></td>
</tr>
<tr>
<td>Database Table</td>
<td>articles</td>
<td>menu_links</td>
<td>Table names corresponding to CakePHP models are plural and underscored.</td>
</tr>
<tr>
<td>File</td>
<td>ArticlesController.php</td>
<td>MenuLinksController.php</td>
<td></td>
</tr>
<tr>
<td>Table</td>
<td>ArticlesTable.php</td>
<td>MenuLinksTable.php</td>
<td>Table class names are plural, CamelCased and end in Table</td>
</tr>
<tr>
<td>Entity</td>
<td>Article.php</td>
<td>MenuLink.php</td>
<td>Entity class names are singular, CamelCased: Article and MenuLink</td>
</tr>
<tr>
<td>Class</td>
<td>ArticlesController</td>
<td>MenuLinksController</td>
<td></td>
</tr>
<tr>
<td>Controller</td>
<td>ArticlesController</td>
<td>MenuLinksController</td>
<td>Plural, CamelCased, end in Controller</td>
</tr>
<tr>
<td>Templates</td>
<td>Articles/index.php Articles/add.php Articles/get_list.php</td>
<td>MenuLinks/index.php MenuLinks/add.php MenuLinks/get_list.php</td>
<td>View template files are named after the controller functions they display, in an underscored form</td>
</tr>
<tr>
<td>Behavior</td>
<td>ArticlesBehavior.php</td>
<td>MenuLinksBehavior.php</td>
<td></td>
</tr>
<tr>
<td>View</td>
<td>ArticlesView.php</td>
<td>MenuLinksView.php</td>
<td></td>
</tr>
<tr>
<td>Helper</td>
<td>ArticlesHelper.php</td>
<td>MenuLinksHelper.php</td>
<td></td>
</tr>
<tr>
<td>Component</td>
<td>ArticlesComponent.php</td>
<td>MenuLinksComponent.php</td>
<td></td>
</tr>
<tr>
<td>Plugin</td>
<td>Bad: cakephp/articles Good: you/cakephp-articles</td>
<td>cakephp/menu-links you/cakephp-menu-links</td>
<td>Useful to prefix a CakePHP plugin with "cakephp-" in the package name. Do not use the CakePHP namespace (cakephp) as vendor name as this is reserved to CakePHP owned plugins. The convention is to use lowercase letters and dashes as separator.</td>
</tr>
<tr>
<td colspan="4">Each file would be located in the appropriate folder/namespace in your app folder.</td>
</tr>
</tbody>
</table>

## Database Convention Summary

<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 77%" />
</colgroup>
<tbody>
<tr>
<td><p>Foreign keys</p>
<p>hasMany belongsTo/ hasOne BelongsToMany</p></td>
<td>Relationships are recognized by default as the (singular) name of the related table followed by <code>_id</code>. Users hasMany Articles, <code>articles</code> table will refer to the <code>users</code> table via a <code>user_id</code> foreign key.</td>
</tr>
<tr>
<td>Multiple Words</td>
<td><code>menu_links</code> whose name contains multiple words, the foreign key would be <code>menu_link_id</code>.</td>
</tr>
<tr>
<td>Auto Increment</td>
<td>In addition to using an auto-incrementing integer as primary keys, you can also use UUID columns. CakePHP will create UUID values automatically using (<code class="interpreted-text" role="php:meth">Cake\Utility\Text::uuid()</code>) whenever you save new records using the <code>Table::save()</code> method.</td>
</tr>
<tr>
<td>Join tables</td>
<td>Should be named after the model tables they will join or the bake command won't work, arranged in alphabetical order (<code>articles_tags</code> rather than <code>tags_articles</code>). Additional columns on the junction table you should create a separate entity/table class for that table.</td>
</tr>
</tbody>
</table>

Now that you've been introduced to CakePHP's fundamentals, you might try a run
through the [Content Management Tutorial](../tutorials-and-examples/cms/installation) to see how things fit
together.
