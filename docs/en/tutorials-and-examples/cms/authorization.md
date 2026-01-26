# CMS Tutorial - Authorization

With users now able to login to our CMS, we want to apply authorization rules
to ensure that each user only edits the posts they own. We'll use the
[authorization plugin](https://book.cakephp.org/authorization/2) to do this.

## Installing Authorization Plugin

Use composer to install the Authorization Plugin:

``` bash
composer require "cakephp/authorization:^3.0"
```

Load the plugin by adding the following statement to the `bootstrap()` method in **src/Application.php**:

``` php
$this->addPlugin('Authorization');
```

## Enabling the Authorization Plugin

The Authorization plugin integrates into your application as a middleware layer
and optionally a component to make checking authorization easier. First, lets
apply the middleware. In **src/Application.php** add the following to the class
imports:

``` php
use Authorization\AuthorizationService;
use Authorization\AuthorizationServiceInterface;
use Authorization\AuthorizationServiceProviderInterface;
use Authorization\Middleware\AuthorizationMiddleware;
use Authorization\Policy\OrmResolver;
```

Add the `AuthorizationServiceProviderInterface` to the implemented interfaces on your application:

    class Application extends BaseApplication
        implements AuthenticationServiceProviderInterface,
        AuthorizationServiceProviderInterface

Then add the following to your `middleware()` method:

``` php
// Add authorization **after** authentication
$middlewareQueue->add(new AuthorizationMiddleware($this));
```

The `AuthorizationMiddleware` will call a hook method on your application when
it starts handling the request. This hook method allows your application to
define the `AuthorizationService` it wants to use. Add the following method your
**src/Application.php**:

``` php
public function getAuthorizationService(ServerRequestInterface $request): AuthorizationServiceInterface
{
    $resolver = new OrmResolver();

    return new AuthorizationService($resolver);
}
```

The OrmResolver lets the authorization plugin find policy classes for ORM
entities and queries. Other resolvers can be used to find policies for other
resources types.

Next, lets add the `AuthorizationComponent` to `AppController`. In
**src/Controller/AppController.php** add the following to the `initialize()`
method:

``` php
$this->loadComponent('Authorization.Authorization');
```

Lastly we'll mark the add, login, and logout actions as not requiring
authorization by adding the following to
**src/Controller/UsersController.php**:

``` php
// In the add, login, and logout methods
$this->Authorization->skipAuthorization();
```

The `skipAuthorization()` method should be called in any controller action
that should be accessible to all users even those who have not logged in yet.

## Creating our First Policy

The Authorization plugin models authorization and permissions as Policy classes.
These classes implement the logic to check whether or not a **identity** is
allowed to **perform an action** on a given **resource**. Our **identity** is
going to be our logged in user, and our **resources** are our ORM entities and
queries. Lets use bake to generate a basic policy:

``` bash
bin/cake bake policy --type entity Article
```

This will generate an empty policy class for our `Article` entity. You can
find the generated policy in **src/Policy/ArticlePolicy.php**. Next update the
policy to look like the following:

``` php
<?php
namespace App\Policy;

use App\Model\Entity\Article;
use Authorization\IdentityInterface;

class ArticlePolicy
{
    public function canAdd(IdentityInterface $user, Article $article)
    {
        // All logged in users can create articles.
        return true;
    }

    public function canEdit(IdentityInterface $user, Article $article)
    {
        // logged in users can edit their own articles.
        return $this->isAuthor($user, $article);
    }

    public function canDelete(IdentityInterface $user, Article $article)
    {
        // logged in users can delete their own articles.
        return $this->isAuthor($user, $article);
    }

    protected function isAuthor(IdentityInterface $user, Article $article)
    {
        return $article->user_id === $user->getIdentifier();
    }
}
```

While we've defined some very simple rules, you can use as complex logic as your
application requires in your policies.

## Checking Authorization in the ArticlesController

With our policy created we can start checking authorization in each controller
action. If we forget to check or skip authorization in an controller action the
Authorization plugin will raise an exception letting us know we forgot to apply
authorization. In **src/Controller/ArticlesController.php** add the following to
the `add`, `edit` and `delete` methods:

``` php
public function add()
{
    $article = $this->Articles->newEmptyEntity();
    $this->Authorization->authorize($article);
    // Rest of the method
}

public function edit($slug)
{
    $article = $this->Articles
        ->findBySlug($slug)
        ->contain('Tags') // load associated Tags
        ->firstOrFail();
    $this->Authorization->authorize($article);
    // Rest of the method.
}

public function delete($slug)
{
    $this->request->allowMethod(['post', 'delete']);

    $article = $this->Articles->findBySlug($slug)->firstOrFail();
    $this->Authorization->authorize($article);
    // Rest of the method.
}
```

The `AuthorizationComponent::authorize()` method will use the current
controller action name to generate the policy method to call. If you'd like to
call a different policy method you can call `authorize` with the operation
name:

``` php
$this->Authorization->authorize($article, 'update');
```

Lastly add the following to the `tags`, `view`, and `index` methods on the
`ArticlesController`:

``` php
// View, index and tags actions are public methods
// and don't require authorization checks.
$this->Authorization->skipAuthorization();
```

## Fixing the Add & Edit Actions

While we've blocked access to the edit action, we're still open to users
changing the `user_id` attribute of articles during edit. We
will solve these problems next. First up is the `add` action.

When creating articles, we want to fix the `user_id` to be the currently
logged in user. Replace your add action with the following:

``` php
// in src/Controller/ArticlesController.php

public function add()
{
    $article = $this->Articles->newEmptyEntity();
    $this->Authorization->authorize($article);

    if ($this->request->is('post')) {
        $article = $this->Articles->patchEntity($article, $this->request->getData());

        // Changed: Set the user_id from the current user.
        $article->user_id = $this->request->getAttribute('identity')->getIdentifier();

        if ($this->Articles->save($article)) {
            $this->Flash->success(__('Your article has been saved.'));

            return $this->redirect(['action' => 'index']);
        }
        $this->Flash->error(__('Unable to add your article.'));
    }
    $tags = $this->Articles->Tags->find('list')->all();
    $this->set(compact('article', 'tags'));
}
```

Next we'll update the `edit` action. Replace the edit method with the following:

``` php
// in src/Controller/ArticlesController.php

public function edit($slug)
{
    $article = $this->Articles
        ->findBySlug($slug)
        ->contain('Tags') // load associated Tags
        ->firstOrFail();
    $this->Authorization->authorize($article);

    if ($this->request->is(['post', 'put'])) {
        $this->Articles->patchEntity($article, $this->request->getData(), [
            // Added: Disable modification of user_id.
            'patchableFields' => ['user_id' => false]
        ]);
        if ($this->Articles->save($article)) {
            $this->Flash->success(__('Your article has been updated.'));

            return $this->redirect(['action' => 'index']);
        }
        $this->Flash->error(__('Unable to update your article.'));
    }
    $tags = $this->Articles->Tags->find('list')->all();
    $this->set(compact('article', 'tags'));
}
```

Here we're modifying which properties can be mass-assigned, via the options
for `patchEntity()`. See the [Changing Accessible Fields](../../orm/saving-data#changing-accessible-fields) section for
more information. Remember to remove the `user_id` control from
**templates/Articles/edit.php** as we no longer need it.

## Wrapping Up

We've built a simple CMS application that allows users to login, post articles,
tag them, explore posted articles by tag, and applied basic access control to
articles. We've also added some nice UX improvements by leveraging the
FormHelper and ORM capabilities.

Thank you for taking the time to explore CakePHP. Next, you should learn more about
the [Database Access & ORM](../../orm), or you peruse the [Using CakePHP](../../topics).
