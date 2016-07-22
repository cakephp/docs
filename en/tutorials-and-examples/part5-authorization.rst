Part 5 - Authorizations
#######################

Restricting Articles Access
===========================

Now that users can log in, we'll want to limit the articles they can see to the
ones they made. We'll do this using an 'authorization' adapter.

As stated before, we are converting this blog into a multi-user authoring tool,
and in order to do this, we need to modify the articles table a bit to add the
reference to the Users table::

    ALTER TABLE articles ADD COLUMN user_id INT(11);

Let's secure our app to prevent some authors from editing or deleting the
others' articles. Basic rules for our app are that admin users can access every
URL, while normal users (the author role) can only access the permitted actions.
Again, open the AppController class and add a few more options to the Auth
config.

Also, add the following to the configuration for ``Auth`` in your
``AppController``::

    'authorize' => 'Controller',

Your ``initialize()`` method should now look like::

    public function initialize()
    {
        $this->loadComponent('RequestHandler');
        $this->loadComponent('Flash');
        $this->loadComponent('Auth', [
            'authorize'=> 'Controller',//added this line
            'authenticate' => [
                'Form' => [
                    'fields' => [
                        'username' => 'username',
                        'password' => 'password'
                    ]
                ]
            ],
            'loginAction' => [
                'controller' => 'Users',
                'action' => 'login'
            ],
            'logoutRedirect' => [
                'controller' => 'Pages',
                'action' => 'display',
                'home'
            ],
            'unauthorizedRedirect' => $this->referer()
        ]);

        // Allow the display action so our pages controller
        // continues to work.
        $this->Auth->allow(['index', 'view', 'display']);
    }

    public function isAuthorized($user)
    {
        // Admin can access every action
        if (isset($user['role']) && $user['role'] === 'admin') {
            return true;
        }

        // Default deny
        return false;
    }

We just created a simple authorization mechanism. Users with the ``admin``
role will be able to access any URL in the site when logged-in. All other
users -- those with the ``author`` role -- will have the same access as
users who aren't logged-in.

This is not exactly what we want. We need to supply more rules to our
``isAuthorized()`` method. However instead of doing it in AppController,
we'll delegate supplying those extra rules to each individual controller.
The rules we're going to add to ArticlesController should permit authors
to create articles but prevent authors from editing articles they do not
own.  Add the following content to your **ArticlesController.php**::

    // src/Controller/ArticlesController.php

    public function isAuthorized($user)
    {
        $action = $this->request->params['action'];

        // The add and index actions are always allowed.
        if (in_array($action, ['index', 'add', 'tags'])) {
            return true;
        }
        // All other actions require an id.
        if (empty($this->request->params['pass'][0])) {
            return false;
        }

        // Check that the article belongs to the current user.
        $id = $this->request->params['pass'][0];
        $articleId = (int)$this->request->params['pass'][0];
        if ($this->Articles->isOwnedBy($articleId, $user['id'])) {
            return true;
        }
        return parent::isAuthorized($user);
    }

We're now overriding the AppController's ``isAuthorized()`` call and internally
checking if the parent class is already authorizing the user. If he isn't, then
just allow him to access the add action, and conditionally access edit and
delete. One final thing has not been implemented. To tell whether or not the
user is authorized to edit the article, we're calling a ``isOwnedBy()`` function
in the Articles table. Let's then implement that function::

    // src/Model/Table/ArticlesTable.php

    public function isOwnedBy($articleId, $userId)
    {
        return $this->exists(['id' => $articleId, 'user_id' => $userId]);
    }

Now if you try to view, edit or delete a article that does not belong to you,
you should be redirected back to the page you came from. However, there is no
error message being displayed, so let's rectify that next::

    // In src/Template/Layout/default.ctp
    // Under the existing flash message.
    <?= $this->Flash->render('auth') ?>

You should now see the authorization error messages.

Fixing List view and Forms
==========================

While view and delete are working, edit, add and index have a few problems:

We'll update the ``add()`` action from **src/Controller/ArticlesController.php**
to look like::

    public function add()
    {
        $article = $this->Articles->newEntity();
        if ($this->request->is('post')) {
            $article = $this->Articles->patchEntity($article, $this->request->data);
            $article->user_id = $this->Auth->user('id');
            if ($this->Articles->save($article)) {
                $this->Flash->success('The article has been saved.');
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error('The article could not be saved. Please, try again.');
        }
        $tags = $this->Articles->Tags->find('list');
        $this->set(compact('article', 'tags'));
        $this->set('_serialize', ['article']);
    }

By setting the entity property with the session data, we remove any possibility
of the user modifying which user a article is for. We'll do the same for the
edit form and action. Your ``edit()`` action from
**src/Controller/ArticlesController.php** should look like::

    public function edit($id = null)
    {
        $article = $this->Articles->get($id, [
            'contain' => ['Tags']
        ]);
        if ($this->request->is(['patch', 'post', 'put'])) {
            $article = $this->Articles->patchEntity($article, $this->request->data);
            $article->user_id = $this->Auth->user('id');
            if ($this->Articles->save($article)) {
                $this->Flash->success('The article has been saved.');
                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error('The article could not be saved. Please, try again.');
        }
        $tags = $this->Articles->Tags->find('list');
        $this->set(compact('article', 'tags'));
        $this->set('_serialize', ['article']);
    }

List View
---------

Now, we only need to show articles for the currently logged in user. We can do
that by updating the call to ``paginate()``. Make your ``index()`` action from
**src/Controller/ArticlesController.php** look like::

    public function index()
    {
        $this->paginate = [
            'conditions' => [
                'Articles.user_id' => $this->Auth->user('id'),
            ]
        ];
        $this->set('articles', $this->paginate($this->Articles));
        $this->set('_serialize', ['articles']);
    }

We should also update the ``tags()`` action and the related finder method, but
we'll leave that as an exercise you can complete on your own.

Improving the Tagging Experience
================================

Right now, adding new tags is a difficult process, as the ``TagsController``
disallows all access. Instead of allowing access, we can improve the tag
selection UI by using a comma separated text field. This will let us give
a better experience to our users, and use some more great features in the ORM.

Adding a Computed Field
-----------------------

Because we'll want a simple way to access the formatted tags for an entity, we
can add a virtual/computed field to the entity. In
**src/Model/Entity/Article.php** add the following::

    use Cake\Collection\Collection;

    protected function _getTagString()
    {
        if (isset($this->_properties['tag_string'])) {
            return $this->_properties['tag_string'];
        }
        if (empty($this->tags)) {
            return '';
        }
        $tags = new Collection($this->tags);
        $str = $tags->reduce(function ($string, $tag) {
            return $string . $tag->title . ', ';
        }, '');
        return trim($str, ', ');
    }

This will let us access the ``$article->tag_string`` computed property. We'll
use this property in inputs later on. Remember to add the ``tag_string``
property to the ``_accessible`` list in your entity, as we'll want to 'save' it
later on.

In **src/Model/Entity/Article.php** add the ``tag_string`` to ``$_accessible``
this way::

    protected $_accessible = [
        'user_id' => true,
        'title' => true,
        'description' => true,
        'url' => true,
        'user' => true,
        'tags' => true,
        'tag_string' => true,
    ];


Updating the Views
------------------

With the entity updated we can add a new input for our tags. In
**src/Template/Articles/add.ctp** and **src/Template/Articles/edit.ctp**,
replace the existing ``tags._ids`` input with the following::

    echo $this->Form->input('tag_string', ['type' => 'text']);

Persisting the Tag String
-------------------------

Now that we can view existing tags as a string, we'll want to save that data as
well. Because we marked the ``tag_string`` as accessible, the ORM will copy that
data from the request into our entity. We can use a ``beforeSave()`` hook method
to parse the tag string and find/build the related entities. Add the following
to **src/Model/Table/ArticlesTable.php**::


    public function beforeSave($event, $entity, $options)
    {
        if ($entity->tag_string) {
            $entity->tags = $this->_buildTags($entity->tag_string);
        }
    }

    protected function _buildTags($tagString)
    {
        // Trim tags
        $newTags = array_map('trim', explode(',', $tagString));
        // Remove all empty tags
        $newTags = array_filter($newTags);
        // Reduce duplicated tags
        $newTags = array_unique($newTags);

        $out = [];
        $query = $this->Tags->find()
            ->where(['Tags.title IN' => $newTags]);

        // Remove existing tags from the list of new tags.
        foreach ($query->extract('title') as $existing) {
            $index = array_search($existing, $newTags);
            if ($index !== false) {
                unset($newTags[$index]);
            }
        }
        // Add existing tags.
        foreach ($query as $tag) {
            $out[] = $tag;
        }
        // Add new tags.
        foreach ($newTags as $tag) {
            $out[] = $this->Tags->newEntity(['title' => $tag]);
        }
        return $out;
    }

While this code is a bit more complicated than what we've done so far, it helps
to showcase how powerful the ORM in CakePHP is. You can manipulate query
results using the :doc:`/core-libraries/collections` methods, and handle
scenarios where you are creating entities on the fly with ease.

Wrapping Up
===========

We've expanded our articleing application to handle authentication and basic
authorization/access control scenarios. We've also added some nice UX
improvements by leveraging the FormHelper and ORM capabilities.

Thanks for taking the time to explore CakePHP. Next, you can complete the
:doc:`/tutorials-and-examples/part6-categorization-tree`, learn more about the
:doc:`/orm`, or you can peruse the :doc:`/topics`.

.. meta::
    :title lang=en: Blog Tutorial Part 5 - Authorization
    :keywords lang=en: tuto, blog, access control, authorization, part4
