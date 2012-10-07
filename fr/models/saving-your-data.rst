Sauvegarder vos Données
#######################

CakePHP rend la sauvegarde des données d’un model très rapide. Les données 
prêtes à être sauvegardées doivent être passées à la méthode ``save()`` du model 
en utilisant le format basique suivant ::

    Array
    (
        [NomDuModele] => Array
        (
            [nomduchamp1] => 'valeur'
            [nomduchamp2] => 'valeur'
        )
    )

La plupart du temps vous n’aurez même pas à vous préoccuper de ce format : 
le :php:class:`FormHelper` et les méthodes de recherche de CakePHP réunissent 
les données sous cette forme. Si vous utilisez un de ces helpers, les données 
sont également disponibles dans ``$this->request->data`` pour un usage rapide 
et pratique.

Voici un exemple simple d’une action de controller qui utilise un model 
CakePHP pour sauvegarder les données dans une table de la base de données ::

    <?php
    public function modifier($id) {
        //Est-ce que des données de formulaires ont été POSTées ?
        if ($this->request->is('post')) {
           //Si les données du formulaire peuvent être validées et sauvegardées ...
           if($this->Recette->save($this->request->data)) {
               //On définit une message flash en session et on redirige.
               $this->Session->setFlash("Recette sauvegardée !");
               $this->redirect('/recettes');
           }
        }
        //Si aucune données de formulaire, on récupère la recette à éditer
        //et on la passe à la vue
        $this->set('recette', $this->Recette->findById($id));
    }

quand save() est appelée, la donnée qui lui est passée en premier paramètre 
est validée en utilisant le mécanisme de validation de CakePHP (voir le 
chapitre :doc:`/models/data-validation` pour plus d’informations). Si pour une 
raison quelconque vos données ne se sauvegardent pas, pensez à regarder si 
des règles de validation ne sont pas insatisfaites. Vous pouvez débugger cette
situation en produisant :php:attr:`Model::$validationErrors`::

    <?php
    if ($this->Recette->save($this->request->data)) {
        // Traite le succès.
    }
    debug($this->Recipe->validationErrors);

Il y a quelques autres méthodes du model liées à la sauvegarde que vous 
trouverez utiles :

:php:meth:`Model::set($one, $two = null)`
=========================================

``Model::set()`` peut être utilisé pour définir un ou plusieurs champs de 
données du tableau de donnés à l'intérieur d'un Model. C'est utile pour 
l'utilisation de models avec les fonctionnalités d'ActiveRecord offert 
par le model::

    <?php
    $this->Post->read(null, 1);
    $this->Post->set('title', 'Nouveau titre pour l'article');
    $this->Post->save();

Dans un exemple de l'utilisation de ``set()`` pour mettre à jour et sauvegarder 
les champs uniques, dans une approche ActiveRecord. Vous pouvez aussi utiliser 
``set()`` pour assigner de nouvelles valeurs aux champs multiples::

    <?php
    $this->Post->read(null, 1);
    $this->Post->set(array(
        'titre' => 'Nouveau titre',
        'publie' => false
    ));
    $this->Post->save();

Ce qui est au-dessus met à jour les champs titre et publie et les sauvegarde 
dans le base de données.

:php:meth:`Model::save(array $data = null, boolean $validate = true, array $fieldList = array())`
=================================================================================================

La méthode ci-dessus sauvegarde des données formatées sous forme tabulaire. 
Le second paramètre vous permet de mettre de côté la validation, et le 
troisième vous permet de fournir une liste des champs du model devant être 
sauvegardés. Pour une sécurité accrue, vous pouvez limiter les champs 
sauvegardés à ceux listés dans ``$fieldList``.

.. note::
    Si ``$fieldList`` n'est pas fourni, un utilisateur malicieux peut ajouter 
    des champs additionnels dans le formulaire de données (si vous n'utilisez 
    pas :php:class:`SecurityComponent`), et ainsi changer la valeur de champs 
    qui n'étaient pas prévus à l'origine.

La méthode save a aussi une syntaxe alternative::

    <?php
    save(array $data = null, array $params = array())

Le tableau ``$params`` peut avoir n'importe quelles des options disponibles 
suivantes en clés:

* ``validate`` Définit à true/false pour activer/désactiver la validation.
* ``fieldList`` Un tableau de champs que vous souhaitez autoriser pour la 
  sauvegarde.
* ``callbacks`` Définit à false la désactivation des callbacks. En utilisant
  'before' ou 'after' activera seulement ces callbacks.

Plus d'informations sur les callbacks du model sont disponibles 
:doc:`ici <callback-methods>`


.. tip::

    Si vous ne voulez pas le que champ mis à jour soit mis à jour pendant 
    la sauvegarde de certaines données, ajoutez ``'updated' => false`` 
    à votre tableau de ``$data``.

Une fois qu'une sauvegarde est terminée, l'ID de l'objet peut être trouvé dans 
l'attribut ``$id`` de l'objet Model - quelque chose de spécialement pratique 
quand on crée de nouveaux objets.

::

    <?php
    $this->Ingredient->save($nouvellesDonnees);
    $nouvelIngredientId = $this->Ingredient->id;

La création ou la mise à jour est contrôlée par le champ ``id`` du model. 
Si ``$Model->id`` est défini, l'enregistrement avec cette clé primaire est 
mis à jour. Sinon, un nouvel enregistrement est créé::

    <?php
    // Création: id n'est pas défini ou est null
    $this->Recipe->create();
    $this->Recipe->save($this->request->data);

    // Mise à jour: id est défini à une valeur numérique
    $this->Recipe->id = 2;
    $this->Recipe->save($this->request->data);

.. tip::

    Lors de l'appel à save() dans une boucle, n'oubliez pas d'appeler 
    ``create()``.


Si vous voulez mettre à jour une valeur, plutôt qu'en créer une, assurez-vous 
que vous avez passé le champ de la clé primaire  dans le tableau data::

    <?php
    $data = array('id' => 10, 'title' => 'Mon Nouveau Titre');
    // Cela mettra à jour la Recette avec un id 10
    $this->Recette->save($data);

:php:meth:`Model::create(array $data = array())`
================================================

Cette méthode initialise la classe du model pour sauvegarder de nouvelles 
informations.

Si vous renseignez le paramètre ``$data`` (en utilisant le format de tableau 
mentionné plus haut), le nouveau model créé sera prêt à être sauvegardé avec 
ces données (accessibles à ``$this->data``).

Si ``false`` est passé à la place d'un tableau, l'instance du model 
n'initialisera pas les champs du schéma de model qui ne sont pas encore 
définis, cela remettra à zéro les champs qui ont déjà été renseignés, et 
laissera les autres vides. Utilisez ceci pour éviter de mettre à jour des 
champs de la base données qui ont déjà été renseignés et doivent être mis 
à jour.

:php:meth:`Model::saveField(string $fieldName, string $fieldValue, $validate = false)`
======================================================================================

Utilisé pour sauvegarder la valeur d’un seul champ. Fixez l’ID du model 
(``$this->ModelName->id = $id``) juste avant d’appeler ``saveField()``. Lors de 
l'utilisation de cette méthode, ``$fieldName`` ne doit contenir que le nom du 
champ, pas le nom du model et du champ.

Par exemple, pour mettre à jour le titre d'un article de blog, l'appel 
depuis un controller à ``saveField`` ressemblerait à quelque chose comme::

    <?php
    $this->Post->saveField('title', 'Un nouveau titre pour un Nouveau Jour');

.. warning::

    Vous ne pouvez pas arrêter la mise à jour du champ mis à jour avec cette 
    méthode, vous devrez utiliser la méthode save().
    
:php:meth:`Model::updateAll(array $fields, array $conditions)`
==============================================================

Met à jour plusieurs enregistrements en un seul appel. Les enregistrements à 
mettre à jour sont identifiés par le tableau ``$conditions``, et les champs 
devant être mis à jour, ainsi que leurs valeurs, sont identifiés par 
le tableau ``$fields``.

Par exemple, si je voulais approuver tous les utilisateurs qui sont membres 
depuis plus d’un an, l’appel à update devrait ressembler à quelque chose 
du style:: 

    <?php
    $this_year = date('Y-m-d h:i:s', strtotime('-1 year'));

    $this->Baker->updateAll(
        array('Baker.approve' => true),
        array('Baker.created <=' => $cette_annee)
    );

.. tip::

    Le tableau $fields accepte des expressions SQL. Les valeurs litérales 
    doivent être manuellement quotées.

.. note::

    Même si le champ modifié existe pour le model qui vient d'être mis à jour, 
    il ne sera pas mis à jour automatiquement par l'ORM. Ajoutez le seulement
    manuellement au tableau si vous avez besoin de le mettre à jour.

Par exemple, pour fermer tous les tickets qui appartiennent à un certain 
client::

    <?php
    $this->Ticket->updateAll(
        array('Ticket.status' => "'closed'"),
        array('Ticket.client_id' => 453)
    );

Par défaut, updateAll() joindra automatiquement toute association belongsTo 
pour les bases de données qui suportent la jointure. Pour prévenir cela, 
délier les associations temporairement.

:php:meth:`Model::saveMany(array $data = null, array $options = array())`
=========================================================================

La méthode utilisée pour sauvegarder les lignes multiples du même model en 
une fois. Les options suivantes peuvent être utilisées:

* ``validate``: Défini à false pour désactiver la validation, true pour 
  valider chaque enregistrement avant la sauvegarde, 'first' pour valider 
  *tous* les enregistrements avant qu'un soit sauvegardé (par défaut),
* ``atomic``: Si true (par défaut), essaiera de sauvegarder tous les 
  enregistrements en une seule transaction.
  Devrait être défini à false si la base de données/table ne supporte pas les 
  transactions.
*  ``fieldList``: Equivalent au paramètre $fieldList dans Model::save()
*  ``deep``: (since 2.1) Si défini à true, les données associées sont aussi 
  sauvegardées, regardez aussi saveAssociated.

Pour sauvegarder de multiples enregistrements d'un unique model, $data 
a besoin d'être un tableau d'enregistrements indexé numériquement comme 
ceci::

    <?php
    $data = array(
        array('titre' => 'titre 1'),
        array('titre' => 'titre 2'),
    )

.. note::

    Note that we are passing numerical indices instead of usual
    ``$data`` containing the Article key. When saving multiple records
    of same model the records arrays should be just numerically indexed
    without the model key.

It is also acceptable to have the data in the following format::

    <?php
    $data = array(
        array('Article' => array('title' => 'title 1')),
        array('Article' => array('title' => 'title 2')),
    )

To save also associated data with ``$options['deep'] = true`` (since 2.1), the two above examples would look like::

    <?php
    $data = array(
        array('title' => 'title 1', 'Assoc' => array('field' => 'value')),
        array('title' => 'title 2'),
    )
    $data = array(
        array('Article' => array('title' => 'title 1'), 'Assoc' => array('field' => 'value')),
        array('Article' => array('title' => 'title 2')),
    )
    $Model->saveMany($data, array('deep' => true));

Keep in mind that if you want to update a record instead of creating a new
one you just need to add the primary key index to the data row::

    <?php
    array(
        array('Article' => array('title' => 'New article')), // This creates a new row
        array('Article' => array('id' => 2, 'title' => 'title 2')), // This updates an existing row
    )


:php:meth:`Model::saveAssociated(array $data = null, array $options = array())`
===============================================================================

Method used to save multiple model associations at once. The following
options may be used:

* ``validate``: Set to false to disable validation, true to validate each record before saving,
  'first' to validate *all* records before any are saved (default),
* ``atomic``: If true (default), will attempt to save all records in a single transaction.
  Should be set to false if database/table does not support transactions.
* ``fieldList``: Equivalent to the $fieldList parameter in Model::save()
* ``deep``: (since 2.1) If set to true, not only directly associated data is saved,
  but deeper nested associated data as well. Defaults to false.

For saving a record along with its related record having a hasOne
or belongsTo association, the data array should be like this::

    <?php
    array(
        'User' => array('username' => 'billy'),
        'Profile' => array('sex' => 'Male', 'occupation' => 'Programmer'),
    )

For saving a record along with its related records having hasMany
association, the data array should be like this::

    <?php
    array(
        'Article' => array('title' => 'My first article'),
        'Comment' => array(
            array('body' => 'Comment 1', 'user_id' => 1),
            array('body' => 'Comment 2', 'user_id' => 12),
            array('body' => 'Comment 3', 'user_id' => 40),
        ),
    )

.. note::

    If successful, the foreign key of the main model will be stored in
    the related models' id field, i.e. ``$this->RelatedModel->id``.

.. warning::

    Be careful when checking saveAssociated calls with atomic option set to
    false. It returns an array instead of boolean.

.. versionchanged:: 2.1
    You can now save deeper associated data as well with setting ``$options['deep'] = true;``

For saving a record along with its related records having hasMany
association and deeper associated Comment belongsTo User data as well,
the data array should be like this::

    <?php
    $data = array(
        'Article' => array('title' => 'My first article'),
        'Comment' => array(
            array('body' => 'Comment 1', 'user_id' => 1),
            array('body' => 'Save a new user as well', 'User' => array('first' => 'mad', 'last' => 'coder'))
        ),
    )

And save this data with::

    <?php
    $Article->saveAssociated($data, array('deep' => true));

.. versionchanged:: 2.1
    ``Model::saveAll()`` and friends now support passing the `fieldList` for multiple models. 

Example of using ``fieldList`` with multiple models::

    <?php
    $this->SomeModel->saveAll($data, array(
        'fieldList' => array(
            'SomeModel' => array('field_1'),
            'AssociatedModel' => array('field_2', 'field_3')
        )
    ));

The fieldList will be an array of model aliases as keys and arrays with fields as values.
The model names are not nested like in the data to be saved.

:php:meth:`Model::saveAll(array $data = null, array $options = array())`
========================================================================

The ``saveAll`` function is just a wrapper around the ``saveMany`` and ``saveAssociated``
methods. it will inspect the data and determine what type of save it should perform. If
data is formatted in a numerical indexed array, ``saveMany`` will be called, otherwise
``saveAssociated`` is used.

This function receives the same options as the former two, and is generally a backwards
compatible function. It is recommended using either ``saveMany`` or ``saveAssociated``
depending on the case.


Saving Related Model Data (hasOne, hasMany, belongsTo)
======================================================

When working with associated models, it is important to realize
that saving model data should always be done by the corresponding
CakePHP model. If you are saving a new Post and its associated
Comments, then you would use both Post and Comment models during
the save operation.

If neither of the associated model records exists in the system yet
(for example, you want to save a new User and their related Profile
records at the same time), you'll need to first save the primary,
or parent model.

To get an idea of how this works, let's imagine that we have an
action in our UsersController that handles the saving of a new User
and a related Profile. The example action shown below will assume
that you've POSTed enough data (using the FormHelper) to create a
single User and a single Profile::

    <?php
    public function add() {
        if (!empty($this->request->data)) {
            // We can save the User data:
            // it should be in $this->request->data['User']

            $user = $this->User->save($this->request->data);

            // If the user was saved, Now we add this information to the data
            // and save the Profile.

            if (!empty($user)) {
                // The ID of the newly created user has been set
                // as $this->User->id.
                $this->request->data['Profile']['user_id'] = $this->User->id;

                // Because our User hasOne Profile, we can access
                // the Profile model through the User model:
                $this->User->Profile->save($this->request->data);
            }
        }
    }

As a rule, when working with hasOne, hasMany, and belongsTo
associations, it's all about keying. The basic idea is to get the
key from one model and place it in the foreign key field on the
other. Sometimes this might involve using the ``$id`` attribute of
the model class after a ``save()``, but other times it might just
involve gathering the ID from a hidden input on a form that’s just
been POSTed to a controller action.

To supplement the basic approach used above, CakePHP also offers a
very handy method ``saveAssociated()``, which allows you to validate and
save multiple models in one shot. In addition, ``saveAssociated()``
provides transactional support to ensure data integrity in your
database (i.e. if one model fails to save, the other models will
not be saved either).

.. note::

    For transactions to work correctly in MySQL your tables must use
    InnoDB engine. Remember that MyISAM tables do not support
    transactions.

Let's see how we can use ``saveAssociated()`` to save Company and Account
models at the same time.

First, you need to build your form for both Company and Account
models (we'll assume that Company hasMany Account)::

    <?php
    echo $form->create('Company', array('action' => 'add'));
    echo $form->input('Company.name', array('label' => 'Company name'));
    echo $form->input('Company.description');
    echo $form->input('Company.location');

    echo $form->input('Account.0.name', array('label' => 'Account name'));
    echo $form->input('Account.0.username');
    echo $form->input('Account.0.email');

    echo $form->end('Add');

Take a look at the way we named the form fields for the Account
model. If Company is our main model, ``saveAssociated()`` will expect the
related model's (Account) data to arrive in a specific format. And
having ``Account.0.fieldName`` is exactly what we need.

.. note::

    The above field naming is required for a hasMany association. If
    the association between the models is hasOne, you have to use
    ModelName.fieldName notation for the associated model.

Now, in our CompaniesController we can create an ``add()``
action::

    <?php
    public function add() {
        if (!empty($this->request->data)) {
            // Use the following to avoid validation errors:
            unset($this->Company->Account->validate['company_id']);
            $this->Company->saveAssociated($this->request->data);
        }
    }

That's all there is to it. Now our Company and Account models will
be validated and saved all at the same time. By default ``saveAssociated``
will validate all values passed and then try to perform a save for each.

Saving hasMany through data
===========================

Let's see how data stored in a join table for two models is saved. As shown in the :ref:`hasMany-through`
section, the join table is associated to each model using a `hasMany` type of relationship.
Our example involves the Head of Cake School asking us to write an application that allows
him to log a student's attendance on a course with days attended and grade. Take
a look at the following code.::

   <?php
   // Controller/CourseMembershipController.php
   class CourseMembershipsController extends AppController {
       public $uses = array('CourseMembership');

       public function index() {
           $this->set('courseMembershipsList', $this->CourseMembership->find('all'));
       }

       public function add() {
           if ($this->request->is('post')) {
               if ($this->CourseMembership->saveAssociated($this->request->data)) {
                   $this->redirect(array('action' => 'index'));
               }
           }
       }
   }

   // View/CourseMemberships/add.ctp

   <?php echo $this->Form->create('CourseMembership'); ?>
       <?php echo $this->Form->input('Student.first_name'); ?>
       <?php echo $this->Form->input('Student.last_name'); ?>
       <?php echo $this->Form->input('Course.name'); ?>
       <?php echo $this->Form->input('CourseMembership.days_attended'); ?>
       <?php echo $this->Form->input('CourseMembership.grade'); ?>
       <button type="submit">Save</button>
   <?php echo  $this->Form->end(); ?>


The data array will look like this when submitted.::

    Array
    (
        [Student] => Array
        (
            [first_name] => Joe
            [last_name] => Bloggs
        )

        [Course] => Array
        (
            [name] => Cake
        )

        [CourseMembership] => Array
        (
            [days_attended] => 5
            [grade] => A
        )

    )

Cake will happily be able to save the lot together and assign
the foreign keys of the Student and Course into CourseMembership
with a `saveAssociated` call with this data structure. If we run the index
action of our CourseMembershipsController the data structure
received now from a find('all') is::

    Array
    (
        [0] => Array
        (
            [CourseMembership] => Array
            (
                [id] => 1
                [student_id] => 1
                [course_id] => 1
                [days_attended] => 5
                [grade] => A
            )

            [Student] => Array
            (
                [id] => 1
                [first_name] => Joe
                [last_name] => Bloggs
            )

            [Course] => Array
            (
                [id] => 1
                [name] => Cake
            )
        )
    )

There are of course many ways to work with a join model. The
version above assumes you want to save everything at-once. There
will be cases where you want to create the Student and Course
independently and at a later point associate the two together with
a CourseMembership. So you might have a form that allows selection
of existing students and courses from pick lists or ID entry and
then the two meta-fields for the CourseMembership, e.g.::

        // View/CourseMemberships/add.ctp

        <?php echo $form->create('CourseMembership'); ?>
            <?php echo $this->Form->input('Student.id', array('type' => 'text', 'label' => 'Student ID', 'default' => 1)); ?>
            <?php echo $this->Form->input('Course.id', array('type' => 'text', 'label' => 'Course ID', 'default' => 1)); ?>
            <?php echo $this->Form->input('CourseMembership.days_attended'); ?>
            <?php echo $this->Form->input('CourseMembership.grade'); ?>
            <button type="submit">Save</button>
        <?php echo $this->Form->end(); ?>

And the resultant POST::

    Array
    (
        [Student] => Array
        (
            [id] => 1
        )

        [Course] => Array
        (
            [id] => 1
        )

        [CourseMembership] => Array
        (
            [days_attended] => 10
            [grade] => 5
        )
    )

Again Cake is good to us and pulls the Student id and Course id
into the CourseMembership with the `saveAssociated`.

.. _saving-habtm:

Saving Related Model Data (HABTM)
---------------------------------

Saving models that are associated by hasOne, belongsTo, and hasMany
is pretty simple: you just populate the foreign key field with the
ID of the associated model. Once that's done, you just call the
``save()`` method on the model, and everything gets linked up
correctly. An example of the required format for the data array
passed to ``save()`` for the Tag model is shown below::

    Array
    (
        [Recipe] => Array
            (
                [id] => 42
            )
        [Tag] => Array 
            (
                [name] => Italian
            )
    )

You can also use this format to save several records and their
HABTM associations with ``saveAll()``, using an array like the
following::

    Array
    (
        [0] => Array
            (
                [Recipe] => Array
                    (
                        [id] => 42
                    )
                [Tag] => Array
                    (
                        [name] => Italian
                    )
            )
        [1] => Array
            (
                [Recipe] => Array
                    (
                        [id] => 42
                    )
                [Tag] => Array
                    (
                        [name] => Pasta
                    )
            )
        [2] => Array
            (
                [Recipe] => Array
                    (
                        [id] => 51
                    )
                [Tag] => Array
                    (
                        [name] => Mexican
                    )
            )
        [3] => Array
            (
                [Recipe] => Array
                    (
                        [id] => 17
                    )
                [Tag] => Array
                    (
                        [name] => American (new)
                    )
            )
    )

Passing the above array to ``saveAll()`` will create the contained tags,
each associated with their respective recipes.

As an example, we'll build a form that creates a new tag and
generates the proper data array to associate it on the fly with
some recipe.

The simplest form might look something like this (we'll assume that
``$recipe_id`` is already set to something)::

    <?php echo $this->Form->create('Tag');?>
        <?php echo $this->Form->input(
            'Recipe.id',
            array('type' => 'hidden', 'value' => $recipe_id)); ?>
        <?php echo $this->Form->input('Tag.name'); ?>
    <?php echo $this->Form->end('Add Tag'); ?>

In this example, you can see the ``Recipe.id`` hidden field whose
value is set to the ID of the recipe we want to link the tag to.

When the ``save()`` method is invoked within the controller, it'll
automatically save the HABTM data to the database.

::

    <?php
    public function add() {
        // Save the association
        if ($this->Tag->save($this->request->data)) {
            // do something on success
        }
    }

With the preceding code, our new Tag is created and associated with
a Recipe, whose ID was set in ``$this->request->data['Recipe']['id']``.

Other ways we might want to present our associated data can include
a select drop down list. The data can be pulled from the model
using the ``find('list')`` method and assigned to a view variable
of the model name. An input with the same name will automatically
pull in this data into a ``<select>``::

    <?php
    // in the controller:
    $this->set('tags', $this->Recipe->Tag->find('list'));

    // in the view:
    $form->input('tags');

A more likely scenario with a HABTM relationship would include a
``<select>`` set to allow multiple selections. For example, a
Recipe can have multiple Tags assigned to it. In this case, the
data is pulled out of the model the same way, but the form input is
declared slightly different. The tag name is defined using the
``ModelName`` convention::

    <?php
    // in the controller:
    $this->set('tags', $this->Recipe->Tag->find('list'));

    // in the view:
    $this->Form->input('Tag');

Using the preceding code, a multiple select drop down is created,
allowing for multiple choices to automatically be saved to the
existing Recipe being added or saved to the database.

What to do when HABTM becomes complicated?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

By default when saving a HasAndBelongsToMany relationship, Cake
will delete all rows on the join table before saving new ones. For
example if you have a Club that has 10 Children associated. You
then update the Club with 2 children. The Club will only have 2
Children, not 12.

Also note that if you want to add more fields to the join (when it
was created or meta information) this is possible with HABTM join
tables, but it is important to understand that you have an easy
option.

HasAndBelongsToMany between two models is in reality shorthand for
three models associated through both a hasMany and a belongsTo
association.

Consider this example::

    Child hasAndBelongsToMany Club

Another way to look at this is adding a Membership model::

    Child hasMany Membership
    Membership belongsTo Child, Club
    Club hasMany Membership.

These two examples are almost the exact same. They use the same
amount of named fields in the database and the same amount of
models. The important differences are that the "join" model is
named differently and its behavior is more predictable.

.. tip::

    When your join table contains extra fields besides two foreign
    keys, you can prevent losing the extra field values by setting
    ``'unique'`` array key to ``'keepExisting'``. You could think of
    this similar to 'unique' => true, but without losing data from
    the extra fields during save operation. See: :ref:`HABTM
    association arrays <ref-habtm-arrays>`.

However, in most cases it's easier to make a model for the join table
and setup hasMany, belongsTo associations as shown in example above
instead of using HABTM association.

Datatables
==========

While CakePHP can have datasources that aren't database driven, most of the
time, they are. CakePHP is designed to be agnostic and will work with MySQL,
MSSQL, Oracle, PostgreSQL and others. You can create your database tables as you
normally would. When you create your Model classes, they'll automatically map to
the tables that you've created. Table names are by convention lowercase and
pluralized with multi-word table names separated by underscores. For example, a
Model name of Ingredient expects the table name ingredients. A Model name of
EventRegistration would expect a table name of event_registrations. CakePHP will
inspect your tables to determine the data type of each field and uses this
information to automate various features such as outputting form fields in the
view. Field names are by convention lowercase and separated by underscores.

Using created and modified
--------------------------

By defining a created or modified field in your database table as datetime
fields, CakePHP will recognize those fields and populate them automatically
whenever a record is created or saved to the database (unless the data being
saved already contains a value for these fields).

The created and modified fields will be set to the current date and time when
the record is initially added. The modified field will be updated with the
current date and time whenever the existing record is saved.

If you have updated, created or modified data in your $this->data (e.g. from a
Model::read or Model::set) before a Model::save() then the values will be taken
from $this->data and not automagically updated. Either use
``unset($this->data['Model']['modified'])``, etc. Alternatively you can override
the Model::save() to always do it for you::

    <?php
    class AppModel extends Model {

        public function save($data = null, $validate = true, $fieldList = array()) }
            // Clear modified field value before each save
            $this->set($data);
            if (isset($this->data[$this->alias]['modified'])) {
                unset($this->data[$this->alias]['modified']);
            }
            return parent::save($this->data, $validate, $fieldList);
        }

    }


.. meta::
    :title lang=fr: Sauvegarder vos Données
    :keywords lang=fr: modèles doc,règles de validation,donnée validation,message flash,modèle null,table php,donnée requêtée,classe php,donnée modèle,table de base de données,tableau,recettes,succès,raison,snap,modèle de données