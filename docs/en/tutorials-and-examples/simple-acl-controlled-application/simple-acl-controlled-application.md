# Simple Acl controlled Application

> [!NOTE]
> This isn't a beginner level tutorial. If you are just starting out with
> CakePHP we would advise you to get a better overall experience of the
> framework's features before trying out this tutorial.

In this tutorial you will create a simple application with
[Authentication](../../core-libraries/components/authentication) and
[Access Control Lists](../../core-libraries/components/access-control-lists). This
tutorial assumes you have read the [Blog Tutorial](../../tutorials-and-examples/blog/blog)
and you are familiar with
[Code Generation with Bake](../../console-and-shells/code-generation-with-bake). You should have
some experience with CakePHP, and be familiar with MVC concepts.
This tutorial is a brief introduction to the
`AuthComponent` and `AclComponent`.

What you will need

1.  PHP 8.0 or greater and [Composer](https://getcomposer.org/).
2.  A web server. PHP's built-in web server, started with `bin/cake server`,
    is enough for this tutorial.
3.  A database server. We're going to be using MySQL in this
    tutorial. You'll need to know enough about SQL in order to create a
    database: CakePHP will be taking the reins from there.
4.  Basic PHP knowledge. The more object-oriented programming you've
    done, the better: but fear not if you're a procedural fan.

## Preparing our Application

First, let's create a new application with Composer:

``` bash
composer create-project pieceofcake2/app acl
cd acl
```

Copy `config/database.php.default` to `config/database.php` and set up your
database connection, and change the values of `Security.salt` and
`Security.cipherSeed` in your `config/core.php`, as described in the
[Blog Tutorial](../../tutorials-and-examples/blog/blog).

The skeleton already contains the [Bake plugin](../../console-and-shells/code-generation-with-bake)
as a development dependency, installed in `plugins/Bake/` (the skeleton's
`composer.json` already has the `installer-paths` setting for this). Load it in
`config/bootstrap.php`:

``` php
// config/bootstrap.php
CakePlugin::load('Bake');
```

From there we will build a simple database schema to build our
application on. Execute the following SQL statements into your database:

``` sql
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    group_id INT NOT NULL,
    created DATETIME,
    modified DATETIME
);

CREATE TABLE `groups` (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created DATETIME,
    modified DATETIME
);

CREATE TABLE posts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT,
    created DATETIME,
    modified DATETIME
);

CREATE TABLE widgets (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    part_no VARCHAR(12),
    quantity INT
);
```

`GROUPS` is a reserved word in MySQL 8.0, so the table name must be quoted
with backticks in your own SQL. CakePHP quotes table and column names in the
queries it generates, so the `Group` model works without further changes.

These are the tables we will be using to build the rest of our
application. Once we have the table structure in the database we
can start cooking. Use
[Code Generation with Bake](../../console-and-shells/code-generation-with-bake) to quickly
create your models, controllers, and views.

To use bake, call `bin/cake bake all` and this will list the 4
tables you inserted into MySQL. Select "1. Group", and follow the
prompts. Repeat for the other 3 tables, and this will have
generated the 4 controllers, models and your views for you.
Bake writes the view templates to `templates/<Controller>/` (this requires
pieceofcake2/bake 1.0.3 or later; see
[Code Generation with Bake](../../console-and-shells/code-generation-with-bake)).

Avoid using Scaffold here. The generation of the ACOs will be
seriously affected if you bake the controllers with the Scaffold
feature.

While baking the Models cake will automagically detect the
associations between your Models (or relations between your
tables). Let cake supply the correct hasMany and belongsTo
associations. If you are prompted to pick hasOne or hasMany,
generally speaking you'll need a hasMany (only) relationships for
this tutorial.

Leave out admin routing for now, this is a complicated enough
subject without them. Also be sure **not** to add either the Acl or
Auth Components to any of your controllers as you are baking them.
We'll be doing that soon enough. You should now have models,
controllers, and baked views for your users, groups, posts and
widgets.

## Preparing to Add Auth

We now have a functioning CRUD application. Bake should have setup
all the relations we need, otherwise add them right now. There are a
few other pieces that need to be added before we can add the Auth and
Acl components. First add a login and logout action to your
`UsersController`:

``` php
public function login()
{
    if ($this->request->is('post')) {
        if ($this->Auth->login()) {
            return $this->redirect($this->Auth->redirectUrl());
        }
        $this->Flash->error(__('Your username or password was incorrect.'));
    }
}

public function logout()
{
    //Leave empty for now.
}
```

Then create the following view file for login at
`templates/Users/login.ctp`:

``` php
<?php
// templates/Users/login.ctp
echo $this->Form->create('User', ['url' => ['action' => 'login']]);
echo $this->Form->inputs([
    'legend' => __('Login'),
    'username',
    'password',
]);
echo $this->Form->end('Login');
?>
```

Next we'll have to update our User model to hash passwords before they go into
the database. Storing plaintext passwords is extremely insecure and
AuthComponent will expect that your passwords are hashed. We use
`BlowfishPasswordHasher`, which hashes passwords with bcrypt. In
`src/Model/User.php` add the following:

``` php
// src/Model/User.php
class User extends AppModel
{
    // other code.

    public function beforeSave($options = [])
    {
        if (!empty($this->data['User']['password'])) {
            $passwordHasher = new BlowfishPasswordHasher();
            $this->data['User']['password'] = $passwordHasher->hash(
                $this->data['User']['password'],
            );
        }

        return true;
    }
}
```

Next we need to make some modifications to `AppController`. If
you don't have `src/Controller/AppController.php`, create it. Since we want our entire
site controlled with Auth and Acl, we will set them up in
`AppController`. The baked controllers use the FlashComponent for their
messages, so we load it here as well:

``` php
// src/Controller/AppController.php
class AppController extends Controller
{
    public $components = [
        'Acl',
        'Auth' => [
            'authenticate' => [
                'Form' => ['passwordHasher' => 'Blowfish'],
            ],
            'authorize' => [
                'Actions' => ['actionPath' => 'controllers'],
            ],
        ],
        'Session',
        'Flash',
    ];
    public $helpers = ['Html', 'Form', 'Flash'];

    public function beforeFilter()
    {
        //Configure AuthComponent
        $this->Auth->loginAction = [
          'controller' => 'users',
          'action' => 'login',
        ];
        $this->Auth->logoutRedirect = [
          'controller' => 'users',
          'action' => 'login',
        ];
        $this->Auth->loginRedirect = [
          'controller' => 'posts',
          'action' => 'add',
        ];
    }
}
```

Before we set up the ACL at all we will need to add some users and
groups. With `AuthComponent` in use we will not be able to access
any of our actions, as we are not logged in. We will now add some
exceptions so `AuthComponent` will allow us to create some groups
and users. In **both** your `GroupsController` and your
`UsersController` Add the following:

``` php
public function beforeFilter()
{
    parent::beforeFilter();
    $this->Auth->allow();
}
```

These statements tell AuthComponent to allow public access to all
actions. This is only temporary and will be removed once we get a
few users and groups into our database. Don't add any users or
groups just yet though.

## Initialize the Db Acl tables

Before we create any users or groups we will want to connect them
to the Acl. However, we do not at this time have any Acl tables and
if you try to view any pages right now, you may get a missing
table error ("Error: Database table acos for model Aco was not
found."). To remove these errors we need to run a schema file. In a
shell run the following:

    bin/cake schema create DbAcl

This schema will prompt you to drop and create the tables. Say yes
to dropping and creating the tables. The schema file is
`config/Schema/db_acl.php` in your application.

If you are having trouble using the console, you can run the SQL file
`config/Schema/db_acl.sql` instead.

With the controllers setup for data entry, and the Acl tables
initialized we are ready to go right? Not entirely, we still have a
bit of work to do in the user and group models. Namely, making them
auto-magically attach to the Acl.

## Acts As a Requester

For Auth and Acl to work properly we need to associate our users
and groups to rows in the Acl tables. In order to do this we will
use the `AclBehavior`. The `AclBehavior` allows for the
automagic connection of models with the Acl tables. Its use
requires an implementation of `parentNode()` on your model. In
our `User` model we will add the following:

``` php
class User extends AppModel
{
    public $belongsTo = ['Group'];
    public $actsAs = ['Acl' => ['type' => 'requester']];

    public function parentNode()
    {
        if (!$this->id && empty($this->data)) {
            return null;
        }
        if (isset($this->data['User']['group_id'])) {
            $groupId = $this->data['User']['group_id'];
        } else {
            $groupId = $this->field('group_id');
        }
        if (!$groupId) {
            return null;
        }

        return ['Group' => ['id' => $groupId]];
    }
}
```

Then in our `Group` Model Add the following:

``` php
class Group extends AppModel
{
    public $actsAs = ['Acl' => ['type' => 'requester']];

    public function parentNode()
    {
        return null;
    }
}
```

What this does, is tie the `Group` and `User` models to the
Acl, and tell CakePHP that every-time you make a User or Group you
want an entry on the `aros` table as well. This makes Acl
management a piece of cake as your AROs become transparently tied
to your `users` and `groups` tables. So anytime you create or
delete a user/group the Aro table is updated.

Our controllers and models are now prepared for adding some initial
data, and our `Group` and `User` models are bound to the Acl
table. So add some groups and users using the baked forms by
browsing to <http://localhost:8765/groups/add> and
<http://localhost:8765/users/add>. I made the following groups:

- administrators
- managers
- users

I also created a user in each group so I had a user of each
different access group to test with later. Write everything down or
use easy passwords so you don't forget. If you do a
`SELECT * FROM aros;` from a MySQL prompt you should get
something like the following:

``` text
+----+-----------+-------+-------------+-------+------+------+
| id | parent_id | model | foreign_key | alias | lft  | rght |
+----+-----------+-------+-------------+-------+------+------+
|  1 |      NULL | Group |           1 | NULL  |    1 |    4 |
|  2 |      NULL | Group |           2 | NULL  |    5 |    8 |
|  3 |      NULL | Group |           3 | NULL  |    9 |   12 |
|  4 |         1 | User  |           1 | NULL  |    2 |    3 |
|  5 |         2 | User  |           2 | NULL  |    6 |    7 |
|  6 |         3 | User  |           3 | NULL  |   10 |   11 |
+----+-----------+-------+-------------+-------+------+------+
6 rows in set (0.00 sec)
```

This shows us that we have 3 groups and 3 users. The users are
nested inside the groups, which means we can set permissions on a
per-group or per-user basis.

### Group-only ACL

In case we want simplified per-group only permissions, we need to
implement `bindNode()` in `User` model:

``` php
public function bindNode($user)
{
    return ['model' => 'Group', 'foreign_key' => $user['User']['group_id']];
}
```

Then modify the `actsAs` for the model `User` and disable the requester directive:

``` php
public $actsAs = ['Acl' => ['type' => 'requester', 'enabled' => false]];
```

These two changes will tell ACL to skip checking `User` Aro's and to check only `Group`
Aro's. This also avoids the afterSave being called.

Note: Every user has to have `group_id` assigned for this to work.

Now the `aros` table will look like this:

``` text
+----+-----------+-------+-------------+-------+------+------+
| id | parent_id | model | foreign_key | alias | lft  | rght |
+----+-----------+-------+-------------+-------+------+------+
|  1 |      NULL | Group |           1 | NULL  |    1 |    2 |
|  2 |      NULL | Group |           2 | NULL  |    3 |    4 |
|  3 |      NULL | Group |           3 | NULL  |    5 |    6 |
+----+-----------+-------+-------------+-------+------+------+
3 rows in set (0.00 sec)
```

Note: If you have followed the tutorial up to this point you need to drop your tables, including `aros`, `groups` and `users`, and create the groups and users again from scratch in order to get the `aros` table seen above.

## Creating ACOs (Access Control Objects)

Now that we have our users and groups (aros), we can begin
inputting our existing controllers into the Acl and setting
permissions for our groups and users, as well as enabling login /
logout.

Our ARO are automatically creating themselves when new users and
groups are created. What about a way to auto-generate ACOs from our
controllers and their actions? Well unfortunately there is no magic
way in CakePHP's core to accomplish this. The core classes offer a
few ways to manually create ACO's though. You can create ACO
objects from the Acl shell or You can use the `AclComponent`.
Creating Acos from the shell looks like:

    bin/cake acl create aco root controllers

While using the AclComponent would look like:

``` php
$this->Acl->Aco->create(['parent_id' => null, 'alias' => 'controllers']);
$this->Acl->Aco->save();
```

Both of these examples would create our 'root' or top level ACO
which is going to be called 'controllers'. The purpose of this root
node is to make it easy to allow/deny access on a global
application scope, and allow the use of the Acl for purposes not
related to controllers/actions such as checking model record
permissions. As we will be using a global root ACO we need to make
a small modification to our `AuthComponent` configuration.
`AuthComponent` needs to know about the existence of this root
node, so that when making ACL checks it can use the correct node
path when looking up controllers/actions. In `AppController` ensure
that your `$components` array contains the `actionPath` defined earlier:

``` php
class AppController extends Controller
{
    public $components = [
        'Acl',
        'Auth' => [
            'authenticate' => [
                'Form' => ['passwordHasher' => 'Blowfish'],
            ],
            'authorize' => [
                'Actions' => ['actionPath' => 'controllers'],
            ],
        ],
        'Session',
        'Flash',
    ];
```

Continue to [Part Two](part-two) to continue the tutorial.
