Translate
#########

.. php:namespace:: Cake\ORM\Behavior

.. php:class:: TranslateBehavior

O comportamento Translate permite criar e recuperar cópias traduzidas de suas 
entidades em vários idiomas. Isso é feito usando uma tabela ``i18n`` separada, 
na qual armazena a tradução para cada um dos campos de qualquer objeto de Tabela 
ao qual está vinculado.

.. warning::

    O TranslateBehavior não suporta chaves primárias compostas neste momento.

Um Tour Rápido
==============

Depois de criar a tabela ``i18n`` no seu banco de dados, anexe o comportamento 
a qualquer objeto da Tabela que você deseja tornar traduzível::

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Translate', ['fields' => ['title']]);
        }
    }

Agora, selecione um idioma a ser usado para recuperar entidades alterando 
o idioma do aplicativo, o que afetará todas as traduções::

    // Em um controlador. Alterar a localidade, por exemplo para espanhol
    I18n::setLocale('es');
    $this->loadModel('Articles');

Em seguida, obtenha uma entidade existente::

    $article = $this->Articles->get(12);
    echo $article->title; // Eco em 'Um título', ainda não traduzido

Em seguida, traduza sua entidade::

    $article->title = 'Un Artículo';
    $this->Articles->save($article);

Agora você pode tentar obter sua entidade novamente::

    $article = $this->Articles->get(12);
    echo $article->title; // Echo em 'Un Artículo', yay pedaço de bolo!

O trabalho com várias traduções pode ser feito usando uma característica 
especial na sua classe Entity::

    use Cake\ORM\Behavior\Translate\TranslateTrait;
    use Cake\ORM\Entity;

    class Article extends Entity
    {
        use TranslateTrait;
    }

Agora você pode encontrar todas as traduções para uma única entidade::

    $article = $this->Articles->find('translations')->first();
    echo $article->translation('es')->title; // 'Un Artículo'

    echo $article->translation('en')->title; // 'An Article';

É igualmente fácil salvar várias traduções ao mesmo tempo::

    $article->translation('es')->title = 'Otro Título';
    $article->translation('fr')->title = 'Un autre Titre';
    $this->Articles->save($article);

Se você quiser se aprofundar em como ele funciona ou como ajustar o 
comportamento às suas necessidades, continue lendo o restante deste capítulo.

Inicializando a Tabela do Banco de Dados i18n
=============================================

Para usar o comportamento, você precisa criar uma tabela ``i18n`` com o 
esquema correto. Atualmente, a única maneira de carregar a tabela ``i18n`` 
é executando manualmente o seguinte script SQL no seu banco de dados:

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

O esquema também está disponível como arquivo sql em **/config/schema/i18n.sql**.

Uma observação sobre as abreviações de idioma: O comportamento de tradução não 
impõe restrições ao identificador de idioma; os valores possíveis são restritos 
apenas pelo tipo/tamanho da coluna ``locale``. ``locale`` é definido como 
``varchar(6)`` caso você queira usar abreviações como ``es-419`` (espanhol para América Latina, 
abreviação de idioma com código de área `UN M.49 <https://en.wikipedia.org/wiki/UN_M.49>`_).

.. tip::

    É aconselhável usar as mesmas abreviações de idioma necessárias para 
    :doc:`Internacionalização e localização</core-libraries/internationalization-and-location>`. 
    Assim, é consistente e a alternância do idioma funciona de forma idêntica para 
    ambos, o ``Translate Behaviour`` e ``Internationalization and Localization``.

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
repository, you can specify the name of the table class name for your custom
table in the behavior's configuration. This is common when you have multiple
tables to translate and you want a cleaner separation of the data that is stored
for each different table::

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

As shown above you can use the ``setLocale()`` method to choose the active
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

.. _retrieving-one-language-without-using-i18n-locale:

Retrieving one language without using I18n::setLocale
-----------------------------------------------------

calling ``I18n::setLocale('es');`` changes the default locale for all translated
finds, there may be times you wish to retrieve translated content without
modifying the application's state. For these scenarios use the behavior's
``setLocale()`` method::

    I18n::setLocale('en'); // reset for illustration

    $this->loadModel('Articles');

    // specific locale. Use locale() prior to 3.6
    $this->Articles->setLocale('es');

    $article = $this->Articles->get(12);
    echo $article->title; // Echoes 'Un Artículo', yay piece of cake!

Note that this only changes the locale of the Articles table, it would not
affect the language of associated data. To affect associated data it's necessary
to call the method on each table, for example::

    I18n::setLocale('en'); // reset for illustration

    $this->loadModel('Articles');
    // Use locale() prior to 3.6
    $this->Articles->setLocale('es');
    $this->Articles->Categories->setLocale('es');

    $data = $this->Articles->find('all', ['contain' => ['Categories']]);

This example also assumes that ``Categories`` has the TranslateBehavior attached
to it.

Querying Translated Fields
--------------------------

TranslateBehavior does not substitute find conditions by default. You need to use
``translationField()`` method to compose find conditions on translated fields::

    // Use locale() prior to 3.6
    $this->Articles->setLocale('es');
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
    $this->loadModel('Articles');
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

    $article->title = 'Mi Primer Artículo';

    // Use locale() prior to 3.6
    $this->Articles->setLocale('es');
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
