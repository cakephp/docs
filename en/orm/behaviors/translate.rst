Translate
#########

.. php:namespace:: Cake\ORM\Behavior

.. php:class:: TranslateBehavior

The Translate behavior allows you to create and retrieve translated copies
of your entities in multiple languages. It does so by using a separate
``i18n`` table where it stores the translation for each of the fields of any
given Table object that it's bound to.

.. warning::

    The TranslateBehavior does not support composite primary keys at this point
    in time.

A Quick Tour
============

After creating the ``i18n`` table in your database attach the behavior to any
Table object you want to make translatable::

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Translate', ['fields' => ['title']]);
        }
    }

Now, select a language to be used for retrieving entities by changing
the application language, which will affect all translations::

    // In a controller. Change the locale, e.g. to Spanish
    I18n::setLocale('es');
    $this->loadModel('Articles');

Then, get an existing entity::

    $article = $this->Articles->get(12);
    echo $article->title; // Echoes 'A title', not translated yet

Next, translate your entity::

    $article->title = 'Un Artículo';
    $this->Articles->save($article);

You can try now getting your entity again::

    $article = $this->Articles->get(12);
    echo $article->title; // Echoes 'Un Artículo', yay piece of cake!

Working with multiple translations can be done by using a special trait
in your Entity class::

    use Cake\ORM\Behavior\Translate\TranslateTrait;
    use Cake\ORM\Entity;

    class Article extends Entity
    {
        use TranslateTrait;
    }

Now you can find all translations for a single entity::

    $article = $this->Articles->find('translations')->first();
    echo $article->translation('es')->title; // 'Un Artículo'

    echo $article->translation('en')->title; // 'An Article';

It is equally easy to save multiple translations at once::

    $article->translation('es')->title = 'Otro Título';
    $article->translation('fr')->title = 'Un autre Titre';
    $this->Articles->save($article);

If you want to go deeper on how it works or how to tune the
behavior for your needs, keep on reading the rest of this chapter.

Initializing the i18n Database Table
====================================

In order to use the behavior, you need to create a ``i18n`` table with the
correct schema. Currently the only way of loading the ``i18n`` table is by
manually running the following SQL script in your database:

.. code-block:: sql

    CREATE TABLE i18n (
        id int NOT NULL auto_increment,
        locale varchar(6) NOT NULL,
        model varchar(255) NOT NULL,
        foreign_key int(10) NOT NULL,
        field varchar(255) NOT NULL,
        content text,
        PRIMARY KEY	(id),
        UNIQUE INDEX I18N_LOCALE_FIELD(locale, model, foreign_key, field),
        INDEX I18N_FIELD(model, foreign_key, field)
    );

The schema is also available as sql file in **/config/schema/i18n.sql**.

A note on language abbreviations: The Translate Behavior doesn't impose any
restrictions on the language identifier, the possible values are only restricted
by the ``locale`` column type/size. ``locale`` is defined as ``varchar(6)`` in
case you want to use abbreviations like ``es-419`` (Spanish for Latin America,
language abbreviation with area code `UN M.49
<https://en.wikipedia.org/wiki/UN_M.49>`_).

.. tip::

    It's wise to use the same language abbreviations as required for
    :doc:`Internationalization and Localization
    </core-libraries/internationalization-and-localization>`. Thus you are
    consistent and switching the language works identical for both, the
    ``Translate Behaviour`` and ``Internationalization and Localization``.

So it's recommended to use either the two letter ISO code of the language like
``en``, ``fr``, ``de`` or the full locale name such as ``fr_FR``, ``es_AR``,
``da_DK`` which contains both the language and the country where it is spoken.

Attaching the Translate Behavior to Your Tables
===============================================

Attaching the behavior can be done in the ``initialize()`` method in your Table
class::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->addBehavior('Translate', ['fields' => ['title', 'body']]);
        }
    }

The first thing to note is that you are required to pass the ``fields`` key in
the configuration array. This list of fields is needed to tell the behavior what
columns will be able to store translations.

Using a Separate Translations Table
-----------------------------------

If you wish to use a table other than ``i18n`` for translating a particular
repository, you can specify it in the behavior's configuration. This is common
when you have multiple tables to translate and you want a cleaner separation
of the data that is stored for each different table::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->addBehavior('Translate', [
                'fields' => ['title', 'body'],
                'translationTable' => 'ArticlesI18n'
            ]);
        }
    }

You need to make sure that any custom table you use has the columns ``field``,
``foreign_key``, ``locale`` and ``model``.

Reading Translated Content
==========================

As shown above you can use the ``locale()`` method to choose the active
translation for entities that are loaded::

    // Load I18n core functions at the beginning of your Controller:
    use Cake\I18n\I18n;

    // Then you can change the language in your action:
    I18n::setLocale('es');
    $this->loadModel('Articles');

    // All entities in results will contain spanish translation
    $results = $this->Articles->find()->all();

This method works with any finder in your tables. For example, you can
use TranslateBehavior with ``find('list')``::

    I18n::setLocale('es');
    $data = $this->Articles->find('list')->toArray();

    // Data will contain
    [1 => 'Mi primer artículo', 2 => 'El segundo artículo', 15 => 'Otro articulo' ...]

Retrieve All Translations For An Entity
---------------------------------------

When building interfaces for updating translated content, it is often helpful to
show one or more translation(s) at the same time. You can use the
``translations`` finder for this::

    // Find the first article with all corresponding translations
    $article = $this->Articles->find('translations')->first();

In the example above you will get a list of entities back that have a
``_translations`` property set. This property will contain a list of translation
data entities. For example the following properties would be accessible::

    // Outputs 'en'
    echo $article->_translations['en']->locale;

    // Outputs 'title'
    echo $article->_translations['en']->field;

    // Outputs 'My awesome post!'
    echo $article->_translations['en']->body;

A more elegant way for dealing with this data is by adding a trait to the entity
class that is used for your table::

    use Cake\ORM\Behavior\Translate\TranslateTrait;
    use Cake\ORM\Entity;

    class Article extends Entity
    {
        use TranslateTrait;
    }

This trait contains a single method called ``translation``, which lets you
access or create new translation entities on the fly::

    // Outputs 'title'
    echo $article->translation('en')->title;

    // Adds a new translation data entity to the article
    $article->translation('de')->title = 'Wunderbar';

Limiting the Translations to be Retrieved
-----------------------------------------

You can limit the languages that are fetched from the database for a particular
set of records::

    $results = $this->Articles->find('translations', [
        'locales' => ['en', 'es']
    ]);
    $article = $results->first();
    $spanishTranslation = $article->translation('es');
    $englishTranslation = $article->translation('en');

Preventing Retrieval of Empty Translations
------------------------------------------

Translation records can contain any string, if a record has been translated
and stored as an empty string ('') the translate behavior will take and use
this to overwrite the original field value.

If this is undesired, you can ignore translations which are empty using the
``allowEmptyTranslations`` config key::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->addBehavior('Translate', [
                'fields' => ['title', 'body'],
                'allowEmptyTranslations' => false
            ]);
        }
    }

The above would only load translated data that had content.

Retrieving All Translations For Associations
--------------------------------------------

It is also possible to find translations for any association in a single find
operation::

    $article = $this->Articles->find('translations')->contain([
        'Categories' => function ($query) {
            return $query->find('translations');
        }
    ])->first();

    // Outputs 'Programación'
    echo $article->categories[0]->translation('es')->name;

This assumes that ``Categories`` has the TranslateBehavior attached to it. It
simply uses the query builder function for the ``contain`` clause to use the
``translations`` custom finder in the association.

Retrieving one language without using I18n::locale
--------------------------------------------------

calling ``I18n::setLocale('es');`` changes the default locale for all translated
finds, there may be times you wish to retrieve translated content without
modifying the application's state. For these scenarios use the behavior
``setLocale()`` method::

    I18n::setLocale('en'); // reset for illustration

    $this->loadModel('Articles');
    $this->Articles->locale('es'); // specific locale

    $article = $this->Articles->get(12);
    echo $article->title; // Echoes 'Un Artículo', yay piece of cake!

Note that this only changes the locale of the Articles table, it would not
affect the langauge of associated data. To affect associated data it's necessary
to call locale on each table for example::

    I18n::setLocale('en'); // reset for illustration

    $this->loadModel('Articles');
    $this->Articles->locale('es');
    $this->Articles->Categories->locale('es');

    $data = $this->Articles->find('all', ['contain' => ['Categories']]);

This example also assumes that ``Categories`` has the TranslateBehavior attached
to it.

Querying Translated Fields
--------------------------

TranslateBehavior does not substitute find conditions by default. You need to use
``translationField()`` method to compose find conditions on translated fields::

    $this->Articles->locale('es');
    $data = $this->Articles->find()->where([
        $this->Articles->translationField('title') => 'Otro Título'
    ]);

Saving in Another Language
==========================

The philosophy behind the TranslateBehavior is that you have an entity
representing the default language, and multiple translations that can override
certain fields in such entity. Keeping this in mind, you can intuitively save
translations for any given entity. For example, given the following setup::

    // in src/Model/Table/ArticlesTable.php
    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Translate', ['fields' => ['title', 'body']]);
        }
    }

    // in src/Model/Entity/Article.php
    class Article extends Entity
    {
        use TranslateTrait;
    }

    // In a Controller
    $articles = $this->loadModel('Articles');
    $article = new Article([
        'title' => 'My First Article',
        'body' => 'This is the content',
        'footnote' => 'Some afterwords'
    ]);

    $this->Articles->save($article);

So, after you save your first article, you can now save a translation for it,
there are a couple ways to do it. The first one is setting the language directly
into the entity::

    $article->_locale = 'es';
    $article->title = 'Mi primer Artículo';

    $this->Articles->save($article);

After the entity has been saved, the translated field will be persisted as well,
one thing to note is that values from the default language that were not
overridden will be preserved::

    // Outputs 'This is the content'
    echo $article->body;

    // Outputs 'Mi primer Artículo'
    echo $article->title;

Once you override the value, the translation for that field will be saved and
can be retrieved as usual::

    $article->body = 'El contendio';
    $this->Articles->save($article);

The second way to use for saving entities in another language is to set the
default language directly to the table::

    I18n::setLocale('es');
    $article->title = 'Mi Primer Artículo';
    $this->Articles->save($article);

Setting the language directly in the table is useful when you need to both
retrieve and save entities for the same language or when you need to save
multiple entities at once.

.. _saving-multiple-translations:

Saving Multiple Translations
============================

It is a common requirement to be able to add or edit multiple translations to
any database record at the same time. This can be done using the
``TranslateTrait``::

    use Cake\ORM\Behavior\Translate\TranslateTrait;
    use Cake\ORM\Entity;

    class Article extends Entity
    {
        use TranslateTrait;
    }

Now, You can populate translations before saving them::

    $translations = [
        'fr' => ['title' => "Un article"],
        'es' => ['title' => 'Un artículo']
    ];

    foreach ($translations as $lang => $data) {
        $article->translation($lang)->set($data, ['guard' => false]);
    }

    $this->Articles->save($article);

As of 3.3.0, working with multiple translations has been streamlined. You can
create form controls for your translated fields::

    // In a view template.
    <?= $this->Form->create($article); ?>
    <fieldset>
        <legend>French</legend>
        <?= $this->Form->control('_translations.fr.title'); ?>
        <?= $this->Form->control('_translations.fr.body'); ?>
    </fieldset>
    <fieldset>
        <legend>Spanish</legend>
        <?= $this->Form->control('_translations.es.title'); ?>
        <?= $this->Form->control('_translations.es.body'); ?>
    </fieldset>

In your controller, you can marshal the data as normal::

    $article = $this->Articles->newEntity($this->request->getData());
    $this->Articles->save($article);

This will result in your article, the french and spanish translations all being
persisted. You'll need to remember to add ``_translations`` into the
``$_accessible`` fields of your entity as well.

Validating Translated Entities
------------------------------

When attaching ``TranslateBehavior`` to a model, you can define the validator
that should be used when translation records are created/modified by the
behavior during ``newEntity()`` or ``patchEntity()``::

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Translate', [
                'fields' => ['title'],
                'validator' => 'translated'
            ]);
        }
    }

The above will use the validator created by ``validationTranslated`` to
validated translated entities.

.. versionadded:: 3.3.0
    Validating translated entities, and streamlined translation saving was added
    in 3.3.0
