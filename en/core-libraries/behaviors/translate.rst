Translate
#########

.. php:class:: TranslateBehavior()

The Translate behavior allows you to create and retrieve translated copies
of your entities in multiple languages. It does so by using a separate
`i18n` table where it stores the translation for each of the field of any
giving Table object that is bound to

A Quick Tour
============

After creating the `i18n` table in your database attach the behavior to any
Table object you want to make translatable::

    class Articles extends Table {
    
        public function initialize(array $config) {
            $this->addBehavior('Translate', ['fields' => ['title']]);
        }
    }

Select a language to be used for retrieving entities::

    $articles = TableRegistry::get('Articles');
    $articles->locale('spa');

Get an existing entity::

    $article = $articles->get(12);
    echo $article->title; // Echoes 'A title', not translated yet

Translate your entity::

    $article->title = 'Un Artículo';
    $articles->save($article);

You can try getting your entity again::

    $article = $articles->get(12);
    echo $article->title; // Echoes 'Un Artículo', yay piece of cake!

Working with multiple translations can be done easy by using a special trait in
your Entity class::

    use Cake\Model\Behavior\Translate\TranslateTrait;
    use Cake\ORM\Entity;

    class Article extends Entity {
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

In order to use the behavior, you need to create a `i18n` table with the correct
schema, Currently the only way of loading the `i18n` table is by manually
running the following SQL script in your database

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


Attaching the Translate Behavior to your Tables
===============================================

Attaching the bahavior can be done in the ``initialize`` method in your Table
class::

    class Articles extends Table {
    
        public function initialize(array $config) {
            $this->addBehavior('Translate', ['fields' => ['title', 'body']]);
        }
    }

The first thing to note is that you are required to pass the ``fields`` key in
the configuration array. This list of fields is needed to tell the behavior what
columns will be able to store translations.

Using a Separate Translations Table
-----------------------------------

If you wish to use a table other than ``i18n`` for translating a particular
repository, you can specify it in the behavior's configuration. This is common to
do when you have multiple tables to translate and you want a cleaner separation
of the data that is stored for each different table::


    class Articles extends Table {
    
        public function initialize(array $config) {
            $this->addBehavior('Translate', [
                'fields' => ['title', 'body'],
                translationTable' => 'articles_i18n'
            ]);
        }
    }

You need to make sure that any custom table you use has the columns ``field``,
``foreign_key``, ``locale`` and ``model``.


Reading translated content
==========================

...

Retrieve all translations for an entity
---------------------------------------

...

Limiting the translations to be retrieved
-----------------------------------------

...

Saving in another language
==========================

...

Saving Multiple Translations
============================

...
