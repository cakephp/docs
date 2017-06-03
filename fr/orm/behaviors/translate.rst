Translate
#########

.. php:namespace:: Cake\ORM\Behavior

.. php:class:: TranslateBehavior

Le behavior Translate vous permet de créer et de récupérer les copies traduites
de vos entities en plusieurs langues. Il le fait en utilisant une table
``i18n`` séparée où il stocke la traduction pour chacun des champs de tout
objet Table donné auquel il est lié.

.. warning::

    TranslateBehavior ne supporte pas les clés primaires composite pour
    l'instant.

Un Rapide Aperçu
================

Après avoir créé la table ``i18n`` dans votre base de données, attachez le
behavior à l'objet Table que vous souhaitez rendre traduisible::

    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Translate', ['fields' => ['title']]);
        }
    }

Maintenant, sélectionnez une langue à utiliser pour récupérer les entities::

    // Dans un controller. Change la locale
    I18n::setLocale('es');
    $this->loadModel('Articles');

Ensuite, récupérez une entity existante::

    $article = $this->Articles->get(12);
    echo $article->title; // Affiche 'A title', pas encore traduit

Ensuite, traduisez votre entity::

    $article->title = 'Un Artículo';
    $this->Articles->save($article);

Vous pouvez maintenant essayer de récupérer à nouveau votre entity::

    $article = $this->Articles->get(12);
    echo $article->title; // Affiche 'Un Artículo', ouah facile!

Travailler avec plusieurs traductions peut être fait en utilisant un trait
spécial dans votre classe Entity::

    use Cake\ORM\Behavior\Translate\TranslateTrait;
    use Cake\ORM\Entity;

    class Article extends Entity
    {
        use TranslateTrait;
    }

Maintenant, vous pouvez trouver toutes les traductions pour une seule entity::

    $article = $this->Articles->>find('translations')->first();
    echo $article->translation('es')->title; // 'Un Artículo'

    echo $article->translation('en')->title; // 'An Article';

Il est également facile de sauvegarder plusieurs traductions en une fois::

    $article->translation('es')->title = 'Otro Título';
    $article->translation('fr')->title = 'Un autre Titre';
    $this->Articles->save($article);

Oui, aussi facilement. Si vous voulez aller plus en profondeur sur la façon
dont il fonctionne ou pour affiner le behavior à vos besoins, continuez de
lire le reste de ce chapitre.

Initialiser la Table i18n de la Base de Données
===============================================

Afin d'utiliser le behavior, vous avez besoin de créer une table ``i18n`` avec
le bon schéma. Habituellement, la seule façon de charger la table ``i18n`` est
en lançant manuellement le script SQL suivant dans votre base de données:

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

Le schéma est aussi disponible sous la forme d'un fichier sql dans
**/config/schema/i18n.sql**.

Une remarque sur les abréviations des langues: Le behavior Translate n'impose
aucune restriction sur l'identifieur de langues, les valeurs possibles sont
seulement restreintes par le type/la taille de la colonne ``locale``. ``locale``
est définie avec ``varchar(6)`` dans le cas où vous souhaitez utiliser les
abréviations comme ``es-419`` (Espagnol pour l'Amérique Latine, l'abréviation
des langues avec le code de zone
`UN M.49 <https://en.wikipedia.org/wiki/UN_M.49>`_).

.. tip::

    Il est sage d'utiliser les mêmes abréviations de langue que celles requises
    pour :doc:`l'Internationalisation et la Localisation
    </core-libraries/internationalization-and-localization>`. Ainsi vous êtes
    cohérent et le changement de langue fonctionne de la même manière à la fois
    pour le ``Translate Behaviour`` et ``l'Internationalisation et la
    Localisation``.

Il est donc recommandé d'utiliser soit le code ISO à 2 lettres de la langue,
comme ``en``, ``fr``, ``de``, soit le nom de la locale complète comme ``fr_FR``,
``es_AR``, ``da_DK`` qui contient à la fois la langue et le pays où elle est
parlée.

Attacher le Behavior Translate à Vos Tables
===========================================

Attacher le behavior peut être fait dans la méthode ``initialize()`` de votre
classe Table::

    class ArticlesTable extends Table
    {

        public function initialize(array $config)
        {
            $this->addBehavior('Translate', ['fields' => ['title', 'body']]);
        }
    }

La première chose à noter est que vous devez passer la clé ``fields`` dans le
tableau de configuration. La liste des champs est souhaitée pour dire au
behavior les colonnes qui pourront stocker les traductions.

Utiliser une Table de Traductions Séparée
-----------------------------------------

Si vous souhaitez utiliser une table autre que ``i18n`` pour la traduction
d'un dépôt particulier, vous pouvez le spécifier dans la configuration du
behavior. C'est le cas quand vous avez plusieurs tables à traduire et
que vous souhaitez une séparation propre des données qui sont stockées pour
chaque table spécifiquement::

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

Vous avez besoin de vous assurer que toute table personnalisée que vous utilisez
a les colonnes ``field``, ``foreign_key``, ``locale`` et ``model``.

Lire du Contenu Traduit
=======================

Comme montré ci-dessus, vous pouvez utiliser la méthode ``locale`` pour choisir
la traduction active pour les entities qui sont chargées::

    use Cake\I18n\I18n;

    // Change la langue dans votre action
    I18n::setLocale('es');
    $this->loadModel('Articles');

    // Toutes les entities dans les résultats vont contenir la traduction espagnol
    $results = $this->Articles->find()->all();

Cette méthode fonctionne avec n'importe quel finder se trouvant dans vos
tables. Par exemple, vous pouvez utiliser TranslateBehavior avec
``find('list')``::

    I18n::setLocale('es');
    $data = $this->Articles->find('list')->toArray();

    // Data va contenir
    [1 => 'Mi primer artículo', 2 => 'El segundo artículo', 15 => 'Otro articulo' ...]

Récupérer Toutes les Traductions Pour Une Entity
------------------------------------------------

Lorsque vous construisez des interfaces pour la mise à jour de contenu traduite,
il est souvent utile de montrer une ou plusieurs traduction(s) au même moment.
Vous pouvez utiliser le finder ``translations`` pour ceci::

    // Récupère le premier article avec toutes les traductions correspondantes
    $article = $this->Articles->find('translations')->first();

Dans l'exemple ci-dessus, vous obtiendrez une liste d'entities en retour qui
a une propriété ``_translations`` définie. Cette propriété va contenir une liste
d'entities de données traduites. Par exemple, les propriétés suivantes seront
accessibles::

    // Affiche 'en'
    echo $article->_translations['en']->locale;

    // Affiche 'title'
    echo $article->_translations['en']->field;

    // Affiche 'My awesome post!'
    echo $article->_translations['en']->body;

Une façon plus élégante pour gérer les données est d'ajouter un trait pour la
classe entity qui est utilisé pour votre table::

    use Cake\ORM\Behavior\Translate\TranslateTrait;
    use Cake\ORM\Entity;

    class Article extends Entity
    {
        use TranslateTrait;
    }

Ce trait contient une méthode unique appelée ``translation``, ce qui vous laisse
accéder ou créer à la volée des entities pour de nouvelles traductions::

    // Affiche 'title'
    echo $article->translation('en')->title;

    // Ajoute une nouvelle donnée de traduction de l'entity à l'article
    $article->translation('deu')->title = 'Wunderbar';

Limiter les Traductions à Récupérer
-----------------------------------

Vous pouvez limiter les langues que vous récupérez à partir de la base de
données pour un ensemble particulier d'enregistrements::

    $results = $this->Articles->find('translations', [
        'locales' => ['en', 'es']
    ]);
    $article = $results->first();
    $spanishTranslation = $article->translation('es');
    $englishTranslation = $article->translation('en');

Eviter la Récupération de Traductions Vides
-------------------------------------------

Les enregistrements traduits peuvent contenir tout type de chaîne, si un
enregistrement a été traduit et stocké comme étant une chaîne vide ('')
le behavior translate va prendre et utiliser ceci pour écraser la valeur du
champ originel.

Si ce n'est pas désiré, vous pouvez ignorer les traductions qui sont vides en
utilisant la clé de config ``allowEmptyTranslations``::

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

Ce qui est au-dessus va seulement charger les données traduites qui ont du
contenu.

Récupérer Toutes les Traductions pour des Associations
------------------------------------------------------

Il est aussi possible de trouver des traductions pour toute association dans une
unique opération de find::

    $article = $this->Articles->find('translations')->contain([
        'Categories' => function ($query) {
            return $query->find('translations');
        }
    ])->first();

    // Affiche 'Programación'
    echo $article->categories[0]->translation('es')->name;

Ceci implique que ``Categories`` a le TranslateBehavior attaché à celui-ci. Il
utilise simplement la fonction de construction de requête pour la clause
``contain`` d'utiliser les ``translations`` du finder personnalisé dans
l'association.

Récupérer une Langue sans Utiliser I18n::locale
-----------------------------------------------

Appeler ``I18n::setLocale('es');`` change la locale par défaut pour tous les finds
traduits, il peut y avoir des fois où vous souhaitez récupérer du contenu
traduit sans modification de l'état de l'application. Pour ces scenarios,
utilisez la méthode ``locale`` du behavior::

    I18n::setLocale('en'); // réinitialisation pour l'exemple

    $this->loadModel('Articles');
    $articles->locale('es'); // locale spécifique

    $article = $this->Articles->get(12);
    echo $article->title; // Echoes 'Un Artículo', yay piece of cake!

Notez que ceci va seulement changer la locale de la table Articles, cela ne
changera pas la langue des données associées. Pour utiliser cette technique
pour changer les données associées, il est nécessaire d'appeler la locale
pour chaque table par exemple::

    I18n::setLocale('en'); // reset for illustration

    $this->loadModel('Articles');
    $this->Articles->locale('es');
    $this->Articles->Categories->locale('es');

    $data = $this->Articles->find('all', ['contain' => ['Categories']]);

Cet exemple suppose que ``Categories`` a le TranslateBehavior attaché.

Faire une requête sur un champ traduit
--------------------------------------

Par défaut, le ``TranslateBehavior`` ne remplace rien dans les conditions des
``find``.
Vous devez utiliser la méthode ``translationField()`` pour composer des ``find``
basés sur des champs traduits::

    $this->Articles->locale('es');
    $data = $this->Articles->find()->where([
        $this->Articles->translationField('title') => 'Otro Título'
    ]);

Sauvegarder dans une Autre Langue
=================================

La philosophie derrière le TranslateBehavior est que vous avez une entity
représentant la langue par défaut, et plusieurs traductions qui peuvent
surcharger certains champs dans de telles entities. Garder ceci à l'esprit,
vous pouvez sauvegarder de façon intuitive les traductions pour une entity
donnée. Par exemple, étant donné la configuration suivante::

    // dans src/Model/Table/ArticlesTable.php
    class ArticlesTable extends Table
    {
        public function initialize(array $config)
        {
            $this->addBehavior('Translate', ['fields' => ['title', 'body']]);
        }
    }

    // dans src/Model/Entity/Article.php
    class Article extends Entity
    {
        use TranslateTrait;
    }

    // Dans un controller
    $articles = $this->loadModel('Articles');
    $article = new Article([
        'title' => 'My First Article',
        'body' => 'This is the content',
        'footnote' => 'Some afterwords'
    ]);

    $this->Articles->save($article);

Donc, après avoir sauvegardé votre premier article, vous pouvez maintenant
sauvegarder une traduction pour celui-ci. Il y a quelques façons de le faire. La
première est de configurer la langue directement dans une entity::

    $article->_locale = 'es';
    $article->title = 'Mi primer Artículo';

    $this->Articles->save($article);

Après que l'entity a été sauvegardé, le champ traduit va aussi être persistent,
une chose à noter est que les valeurs qui étaient par défaut surchargées à
partir de la langue, seront préservées::

    // Affiche 'This is the content'
    echo $article->body;

    // Affiche 'Mi primer Artículo'
    echo $article->title;

Une fois que vous surchargez la valeur, la traduction pour ce champ sera
sauvegardée et récupérée comme d'habitude::

    $article->body = 'El contendio';
    $this->Articles->save($article);

La deuxième manière de l'utiliser pour sauvegarder les entities dans une autre
langue est de définir par défaut la langue directement à la table::

    I18n::setLocale('es');
    $article->title = 'Mi Primer Artículo';
    $this->Articles->save($article);

Configurer la langue directement dans la table est utile quand vous avez besoin
à la fois de récupérer et de sauvegarder les entities pour la même langue
ou quand vous avez besoin de sauvegarder plusieurs entities en une fois.

.. _saving-multiple-translations:

Sauvegarder Plusieurs Traductions
=================================

C'est un prérequis habituel d'être capable d'ajouter ou de modifier plusieurs
traductions à l'enregistrement de la base de données au même moment. Ceci peut
être fait en utilisant ``TranslateTrait``::

    use Cake\ORM\Behavior\Translate\TranslateTrait;
    use Cake\ORM\Entity;

    class Article extends Entity
    {
        use TranslateTrait;
    }

Maintenant vous pouvez ajouter les translations avant de les sauvegarder::

    $translations = [
        'fr' => ['title' => "Un article"],
        'es' => ['title' => 'Un artículo']
    ];

    foreach ($translations as $lang => $data) {
        $article->translation($lang)->set($data, ['guard' => false]);
    }

    $this->Articles->save($article);

Depuis la version 3.3.0, le travail avec plusieurs traductions a été amélioré.
Vous pouvez créer des inputs de formulaire pour vos champs traduits::

    // Dans un template de vue.
    <?= $this->Form->create($article); ?>
    <fieldset>
        <legend>French</legend>
        <?= $this->Form->input('_translations.fr.title'); ?>
        <?= $this->Form->input('_translations.fr.body'); ?>
    </fieldset>
    <fieldset>
        <legend>Spanish</legend>
        <?= $this->Form->input('_translations.es.title'); ?>
        <?= $this->Form->input('_translations.es.body'); ?>
    </fieldset>

Dans votre controller, vous pouvez marshal les données comme d'habitude, mais
avec l'option ``translations`` activée::

    $article = $this->Articles->newEntity($this->request->data, [
        'translations' => true
    ]);
    $this->Articles->save($article);

Ceci va faire que votre article, les traductions françaises et espagnoles vont
tous persister. Vous devrez aussi vous souvenir d'ajouter ``_translations``
dans les champs accessibles ``$_accessible`` de votre entity.

Valider les Entities Traduites
------------------------------

Quand vous attachez ``TranslateBehavior`` à un model, vous pouvez définir le
validateur qui doit être utilisé quand les enregistrements de traduction sont
créés/mis à jours par le behavior pendant ``newEntity()`` ou ``patchEntity()``::

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

Ce qui est au-dessus va utiliser le validateur créé par les entities traduites
validées ``validationTranslated``.

.. versionadded:: 3.3.0
    La validation des entities traduites et l'amélioration de la sauvegarde des
    traductions ont été ajoutées dans la version 3.3.0
