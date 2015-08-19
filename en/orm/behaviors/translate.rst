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

    I18n::locale('spa');
    $articles = TableRegistry::get('Articles');

Then, get an existing entity::

    $article = $articles->get(12);
    echo $article->title; // Echoes 'A title', not translated yet

Next, translate your entity::

    $article->title = 'Un Artículo';
    $articles->save($article);

You can try now getting your entity again::

    $article = $articles->get(12);
    echo $article->title; // Echoes 'Un Artículo', yay piece of cake!

Working with multiple translations can be done easily by using a special trait
in your Entity class::

    use Cake\ORM\Behavior\Translate\TranslateTrait;
    use Cake\ORM\Entity;

    class Article extends Entity
    {
        use TranslateTrait;
    }

Now you can find all translations for a single entity::

    $article = $articles->find('translations')->first();
    echo $article->translation('spa')->title; // 'Un Artículo'

    echo $article->translation('eng')->title; // 'An Article';

It is equally easy to save multiple translations at once::

    $article->translation('spa')->title = 'Otro Título';
    $article->translation('fre')->title = 'Un autre Titre';
    $articles->save($articles);

Yes, that easy. If you want to go deeper on how it works or how to tune the
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

    class Articles extends Table
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

    I18n::locale('spa');
    $articles = TableRegistry::get('Articles');

    // All entities in results will contain spanish translation
    $results = $articles->find()->all();

This method works with any finder in your tables. For example, you can
use TranslateBehavior with ``find('list')``::

    I18n::locale('spa');
    $data = $articles->find('list')->toArray();

    // Data will contain
    [1 => 'Mi primer artículo', 2 => 'El segundo artículo', 15 => 'Otro articulo' ...]

Retrieve All Translations For An Entity
---------------------------------------

When building interfaces for updating translated content, it is often helpful to
show one or more translation(s) at the same time. You can use the
``translations`` finder for this::

    // Find the first article with all corresponding translations
    $article = $articles->find('translations')->first();

In the example above you will get a list of entities back that have a
``_translations`` property set. This property will contain a list of translation
data entities. For example the following properties would be accessible::

    // Outputs 'eng'
    echo $article->_translations['eng']->locale;

    // Outputs 'title'
    echo $article->_translations['eng']->field;

    // Outputs 'My awesome post!'
    echo $article->_translations['eng']->body;

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
    echo $article->translation('eng')->title;

    // Adds a new translation data entity to the article
    $article->translation('deu')->title = 'Wunderbar';

Limiting the Translations to be Retrieved
-----------------------------------------

You can limit the languages that are fetched from the database for a particular
set of records::

    $results = $articles->find('translations', ['locales' => ['eng', 'spa']]);
    $article = $results->first();
    $spanishTranslation = $article->translation('spa');
    $englishTranslation = $article->translation('eng');

Preventing Retrieval of Empty Translations
------------------------------------------

Translation records can contain any string, if a record has been translated
and stored as an empty string ('') the translate behavior will take and use
this to overwrite the original field value.

If this is undesired, you can ignore translations which are empty using the
``allowEmptyTranslations`` config key::

    class Articles extends Table
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

    $article = $articles->find('translations')->contain([
        'Categories' => function ($query) {
            return $query->find('translations');
        }
    ])->first();

    // Outputs 'Programación'
    echo $article->categories[0]->translation('spa')->name;

This assumes that ``Categories`` has the TranslateBehavior attached to it. It
simply uses the query builder function for the ``contain`` clause to use the
``translations`` custom finder in the association.

Retrieving one language without using I18n::locale
--------------------------------------------------

calling ``I18n::locale('spa');`` changes the default locale for all translated
finds, there may be times you wish to retrieve translated content without modifying
the application's state. For these scenarios use the behavior ``locale()`` method::

    I18n::locale('eng'); // reset for illustration
    $articles = TableRegistry::get('Articles');
    $articles->locale('spa'); // specific locale

    $article = $articles->get(12);
    echo $article->title; // Echoes 'Un Artículo', yay piece of cake!

Note that this only changes the locale of the Articles table, it would not affect
the langauge of associated data. To use this technique to affect associated data
it's necessary to call locale on each table for example::

    I18n::locale('eng'); // reset for illustration
    $articles = TableRegistry::get('Articles');
    $articles->locale('spa');
    $articles->categories->locale('spa');

    $data = $articles->find('all', ['contain' => ['Categories']]);

This example also assumes that ``Categories`` has the TranslateBehavior attached to it.

Saving in Another Language
==========================

The philosophy behind the TranslateBehavior is that you have an entity
representing the default language, and multiple translations that can override
certain fields in such entity. Keeping this in mind, you can intuitively save
translations for any given entity. For example, given the following setup::

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Translate', ['fields' => ['title', 'body']]);
        }
    }

    class Article extends Entity
    {
        use TranslateTrait;
    }

    $articles = TableRegistry::get('Articles');
    $article = new Article([
        'title' => 'My First Article',
        'body' => 'This is the content',
        'footnote' => 'Some afterwords'
    ]);

    $articles->save($article);

So, after you save your first article, you can now save a translation for it,
there are a couple ways to do it. The first one is setting the language directly
into the entity::

    $article->_locale = 'spa';
    $article->title = 'Mi primer Artículo';

    $articles->save($article);

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
    $articles->save($article);

The second way to use for saving entities in another language is to set the
default language directly to the table::

    I18n::locale('spa');
    $article->title = 'Mi Primer Artículo';
    $articles->save($article);

Setting the language directly in the table is useful when you need to both
retrieve and save entities for the same language or when you need to save
multiple entities at once.

Saving Multiple Translations
============================

It is a common requirement to be able to add or edit multiple translations to
any database record at the same time. This can be easily done using the
``TranslateTrait``::

    use Cake\ORM\Behavior\Translate\TranslateTrait;
    use Cake\ORM\Entity;

    class Article extends Entity
    {
        use TranslateTrait;
    }

Now, You can populate translations before saving them::

    $translations = [
        'fra' => ['title' => "Un article"],
        'spa' => ['title' => 'Un artículo']
    ];

    foreach ($translations as $lang => $data) {
        $article->translation($lang)->set($data, ['guard' => false]);
    }

    $articles->save($article);
