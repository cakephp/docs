Paginator
#########

.. php:namespace:: Cake\View\Helper

.. php:class:: PaginatorHelper(View $view, array $config = [])

Le Helper Paginator est utilisé pour présenter des contrôles de pagination
comme les numéros de pages et les liens suivant/précédent. Il travaille en
tamdem avec :php:class:`PaginatorComponent`.

Voir aussi :doc:`/controllers/components/pagination` pour des informations
sur la façon de créer des jeux de données paginés et faire des requêtes
paginées.

.. _paginator-templates:

Templates de PaginatorHelper
============================

En interne, PaginatorHelper utilise une série simple de templates HTML pour
générer les balises. Vous pouvez modifier ces templates pour personnaliser le
HTML généré par PaginatorHelper.

Templates utilise des placeholders de style ``{{var}}``. Il est important de ne
pas ajouter d'espaces autour du `{{}}` ou les remplacements ne fonctionneront
pas.

Charger les Templates à partir d'un Fichier
-------------------------------------------

Lors de l'ajout de PaginatorHelper dans votre controller, vous pouvez définir
la configuration de 'templates' pour définir un fichier de template à charger.
Cela vous permet de personnaliser plusieurs templates et de garder votre code
DRY::

    // Dans votre fichier AppView.php
    public function initialize()
    {
        ...
        $this->loadHelper('Paginator', ['templates' => 'paginator-templates']);
    }

Cela va charger le fichier qui se trouve dans
**config/paginator-templates.php**. Regardez l'exemple ci-dessous pour voir à
quoi doit ressembler le fichier. Vous pouvez aussi charger les templates à
partir d'un plugin en utilisant la :term:`syntaxe de plugin`::

    // Dans votre fichier AppView.php
    public function initialize()
    {
        ...
        $this->loadHelper('Paginator', ['templates' => 'MyPlugin.paginator-templates']);
    }

Si vos templates sont dans l'application principale ou dans un plugin, vos
fichiers de templates devraient ressembler à ceci::

    return [
        'number' => '<a href="{{url}}">{{text}}</a>',
    ];

Changer les Templates à la Volée
--------------------------------

.. php:method:: templates($templates = null)

Cette méthode vous permet de changer les templates utilisés par PaginatorHelper
à la volée. Ceci peut être utile quand vous voulez personnaliser des templates
pour l'appel d'une méthode particulière::

    // Lire la valeur du template actuel.
    $result = $this->Paginator->templates('number');

    // Changez un template
    $this->Paginator->templates([
        'number' => '<em><a href="{{url}}">{{text}}</a></em>'
    ]);

.. warning::

    Les chaînes de template contenant un signe pourcentage (``%``) nécessitent
    une attention spéciale, vous devriez préfixer ce caractère avec un autre
    pourcentage pour qu'il ressemble à ``%%``. La raison est que les templates
    sont compilés en interne pour être utilisés avec ``sprintf()``.
    Exemple: '<div style="width:{{size}}%%">{{content}}</div>'

Noms du Template
----------------

PaginatorHelper utilise les templates suivants:

- ``nextActive`` L'état activé pour un lien généré par next().
- ``nextDisabled`` L'état désactivé pour next().
- ``prevActive`` L'état activé pour un lien généré par prev().
- ``prevDisabled`` L'état désactivé pour prev()
- ``counterRange`` Le template counter() utilisé quand format == range.
- ``counterPages`` The template counter() utilisé quand format == pages.
- ``first`` Le template utilisé pour un lien généré par first().
- ``last`` Le template utilisé pour un lien généré par last()
- ``number`` Le template utilisé pour un lien généré par numbers().
- ``current`` Le template utilisé pour la page courante.
- ``ellipsis`` Le template utilisé pour des ellipses générées par numbers().
- ``sort`` Le template pour un lien trié sans direction.
- ``sortAsc`` Le template pour un lien trié avec une direction ascendante.
- ``sortDesc`` Le template pour un lien trié avec une direction descendante.

Création de liens triés
=======================

.. php:method:: sort($key, $title = null, $options = [])

    :param string $key: Le nom de la clé du jeu d'enregistrement qui doit être
        triée.
    :param string $title: Titre du lien. Si $title est null $key sera
        utilisée pour le titre et sera générée par inflexion.
    :param array $options: Options pour le tri des liens.

Génère un lien de tri. Définit le nom ou les paramètres de la chaîne de
recherche pour le tri et la direction. Les liens par défaut fourniront un tri
ascendant. Après le premier clique, les liens générés avec ``sort()`` gèreront
le changement de direction automatiquement. Les liens de tri par défaut
ascendant. Si le jeu de résultat est trié en ascendant avec la clé spécifiée
le liens retourné triera en 'décroissant'.

Les clés acceptées pour ``$options``:

* ``escape`` Si vous voulez que le contenu soit encodé en HTML, ``true`` par
  défaut.
* ``model`` Le model à utiliser, par défaut à
  :php:meth:`PaginatorHelper::defaultModel()`.
* ``direction`` La direction par défaut à utiliser quand ce lien n'est pas
  actif.
* ``lock`` Verrouiller la direction. Va seulement utiliser la direction par
  défaut, par défaut à ``false``.

En considérant que vous paginez des posts, qu'ils sont sur la page un::

    echo $this->Paginator->sort('user_id');

Sortie:

.. code-block:: html

    <a href="/posts/index?page=1&amp;sort=user_id&amp;direction=asc">User Id</a>

Vous pouvez utiliser le paramètre title pour créer des textes personnalisés
pour votre lien::

    echo $this->Paginator->sort('user_id', 'User account');

Sortie:

.. code-block:: html

    <a href="/posts/index?page=1&amp;sort=user_id&amp;direction=asc">User account</a>

Si vous utilisez de l'HTML comme des images dans vos liens rappelez-vous de
paramétrer l'échappement::

    echo $this->Paginator->sort(
      'user_id',
      '<em>User account</em>',
      ['escape' => false]
    );

Sortie:

.. code-block:: html

    <a href="/posts/index?page=1&amp;sort=user_id&amp;direction=asc"><em>User account</em></a>

L'option de direction peut être utilisée pour paramétrer la direction par
défaut pour un lien. Une fois qu'un lien est activé, il changera
automatiquement de direction comme habituellement::

    echo $this->Paginator->sort('user_id', null, ['direction' => 'desc']);

Sortie

.. code-block:: html

    <a href="/posts/index?page=1&amp;sort=user_id&amp;direction=desc">User Id</a>

L'option lock peut être utilisée pour verrouiller le tri dans la direction
spécifiée::

    echo $this->Paginator->sort('user_id', null, ['direction' => 'asc', 'lock' => true]);

.. php:method:: sortDir(string $model = null, mixed $options = [])

    récupère la direction courante du tri du jeu d'enregistrement.

.. php:method:: sortKey(string $model = null, mixed $options = [])

    récupère la clé courante selon laquelle le jeu d'enregistrement est trié.

Création des liens de page numérotés
====================================

.. php:method:: numbers($options = [])

Retourne un ensemble de nombres pour le jeu de résultat paginé. Utilise un
modulo pour décider combien de nombres à présenter de chaque coté de la page
courante. Par défaut 8 liens de chaque coté de la page courante seront créés
si cette page existe. Les liens ne seront pas générés pour les pages qui
n'existent pas. La page courante n'est pas un lien également.

Les options supportées sont:

* ``before`` Contenu a insérer avant les nombres.
* ``after`` Contenu a insérer après les nombres.
* ``model`` Model pour lequel créer des nombres, par défaut à
  :php:meth:`PaginatorHelper::defaultModel()`.
* ``modulus`` combien de nombres à inclure sur chacun des cotés de la page
  courante, par défaut à 8.
* ``first`` Si vous voulez que les premiers liens soit générés, définit à un
  entier pour définir le nombre de 'premier' liens à générer. Par défaut à
  ``false``. Si une chaîne est définie un lien pour la première page sera
  générée avec la valeur comme titre::

      echo $this->Paginator->numbers(['first' => 'First page']);

* ``last`` Si vous voulez que les derniers liens soit générés, définit à un
  entier pour définir le nombre de 'dernier' liens à générer. Par défaut à
  ``false``. Suit la même logique que l'option ``first``. il y a méthode
  :php:meth:`~PaginatorHelper::last()` à utiliser séparément si vous le voulez.

Bien que cette méthode permette beaucoup de personnalisation pour ses sorties,
elle peut aussi être appelée sans aucun paramètre::

    echo $this->Paginator->numbers();

En utilisant les options first et last vous pouvez créer des liens pour le
début et la fin du jeu de page. Le code suivant pourrait créer un jeu de liens
de page qui inclut les liens des deux premiers et deux derniers résultats de
pages::

    echo $this->Paginator->numbers(['first' => 2, 'last' => 2]);

Création de liens de sauts
==========================

En plus de générer des liens qui vont directement sur des numéros de pages
spécifiques, vous voudrez souvent des liens qui amènent vers le lien précédent
ou suivant, première et dernière pages dans le jeu de données paginées.

.. php:method:: prev($title = '<< Previous', $options = [])

    :param string $title: Titre du lien.
    :param mixed $options: Options pour le lien de pagination.

    Génère un lien vers la page précédente dans un jeu d'enregistrements
    paginés.

    ``$options`` supporte les clés suivantes:

    * ``escape`` Si vous voulez que le contenu soit encodé en HTML,
      par défaut à ``true``.
    * ``model`` Le model à utiliser, par défaut
      :php:meth:`PaginatorHelper::defaultModel()`.
    * ``disabledTitle`` Le texte à utiliser quand le lien est désactivé. Par
      défaut, la valeur du paramètre ``$title``.

    Un simple exemple serait::

        echo $this->Paginator->prev(' << ' . __('previous'));

    Si vous étiez actuellement sur la secondes pages des posts (articles),
    vous obtenez le résultat suivant:

    .. code-block:: html

        <li class="prev">
            <a rel="prev" href="/posts/index?page=1&amp;sort=title&amp;order=desc">
                &lt;&lt; previous
            </a>
        </li>

    S'il n'y avait pas de page précédente vous obtenez:

    .. code-block:: html

        <li class="prev disabled"><span>&lt;&lt; previous</span></li>

    Pour changer les templates utilisés par cette méthode, regardez
    :ref:`paginator-templates`.

.. php:method:: next($title = 'Next >>', $options = [])

    Cette méthode est identique a :php:meth:`~PagintorHelper::prev()` avec
    quelques exceptions. il crée le lien pointant vers la page suivante au
    lieu de la précédente. elle utilise aussi ``next`` comme valeur d'attribut
    rel au lieu de ``prev``.

.. php:method:: first($first = '<< first', $options = [])

    Retourne une première ou un nombre pour les premières pages. Si une chaîne
    est fournie, alors un lien vers la première page avec le texte fourni sera
    créé::

        echo $this->Paginator->first('< first');

    Ceci crée un simple lien pour la première page. Ne retournera rien si vous
    êtes sur la première page. Vous pouvez aussi utiliser un nombre entier pour
    indiquer combien de premier liens paginés vous voulez générer::

        echo $this->Paginator->first(3);

    Ceci créera des liens pour les 3 premières pages, une fois la troisième
    page ou plus atteinte. Avant cela rien ne sera retourné.

    Les paramètres d'option acceptent ce qui suit:

    - ``model`` Le model à utiliser par défaut PaginatorHelper::defaultModel().
    - ``escape`` Si le contenu HTML doit être échappé ou pas. ``true``
      par défaut.

.. php:method:: last($last = 'last >>', $options = [])

    Cette méthode fonctionne très bien comme la méthode
    :php:meth:`~PaginatorHelper::first()`. Elle a quelques différences
    cependant. Elle ne générera pas de lien si vous êtes sur la dernière
    page avec la valeur chaîne ``$last``. Pour une valeur entière de ``$last``
    aucun lien ne sera généré une fois que l'utilisateur sera dans la zone
    des dernières pages.

Vérifier l'Etat de la Pagination
================================

.. php:method:: current(string $model = null)

    récupère la page actuelle pour le jeu d'enregistrement du model donné::

        // Ou l'URL est: http://example.com/comments/view/page:3
        echo $this->Paginator->current('Comment');
        // la sortie est 3

.. php:method:: hasNext(string $model = null)

    Retourne ``true`` si le résultat fourni n'est pas sur la dernière page.

.. php:method:: hasPrev(string $model = null)

    Retourne ``true`` si le résultat fourni n'est pas sur la première page.

.. php:method:: hasPage(string $model = null, integer $page = 1)

    Retourne ``true`` si l'ensemble de résultats fourni a le numéro de page
    fourni par ``$page``.

Création d'un compteur de page
==============================

.. php:method:: counter($options = [])

Retourne une chaîne compteur pour le jeu de résultat paginé. En Utilisant
une chaîne formatée fournie et un nombre d'options vous pouvez créer des
indicateurs et des éléments spécifiques de l'application indiquant ou
l'utilisateur se trouve dans l'ensemble de données paginées.

Il y a un certain nombre d'options supportées pour ``counter()``. celles
supportées sont:

* ``format`` Format du compteur. Les formats supportés sont 'range', 'pages'
  et custom. Par défaut à pages qui pourrait ressortir comme '1 of 10'.
  Dans le mode custom la chaîne fournie est analysée (parsée) et les jetons
  sont remplacées par des valeurs réelles. Les jetons autorisés sont:

  -  ``{{page}}`` - la page courante affichée.
  -  ``{{pages}}`` - le nombre total de pages.
  -  ``{{current}}`` - le nombre actuel d'enregistrements affichés.
  -  ``{{count}}`` - le nombre total d'enregistrements dans le jeu de résultat.
  -  ``{{start}}`` - le nombre de premier enregistrement affichés.
  -  ``{{end}}`` - le nombre de dernier enregistrements affichés.
  -  ``{{model}}`` - La forme plurielle du nom de model.
     Si votre model était 'RecettePage', ``{{model}}`` devrait être
     'recipe pages'.

  Vous pouvez aussi fournir simplement une chaîne à la méthode counter en
  utilisant les jetons autorisés. Par exemple::

      echo $this->Paginator->counter(
          'Page {{page}} of {{pages}}, showing {{current}} records out of
           {{count}} total, starting on record {{start}}, ending on {{end}}'
      );

  En définissant 'format' à 'range' donnerait en sortie '1 - 3 of 13'::

      echo $this->Paginator->counter([
          'format' => 'range'
      ]);

* ``model`` Le nom du model en cours de pagination, par défaut à
  :php:meth:`PaginatorHelper::defaultModel()`. Ceci est utilisé en conjonction
  avec la chaîne personnalisée de l'option 'format'.

Configurer les Options de Pagination
====================================

.. php:method:: options($options = [])

Définit toutes les options pour le Helper Paginator Helper. Les options
supportées sont:

* ``url`` L'URL de l'action de pagination. 'url' comporte quelques sous options
  telles que:

  -  ``sort`` La clé qui décrit la façon de trier les enregistrements.
  -  ``direction`` La direction du tri. Par défaut à 'ASC'.
  -  ``page`` Le numéro de page à afficher.

  Les options mentionnées ci-dessus peuvent être utilisées pour forcer
  des pages/directions particulières. Vous pouvez aussi ajouter des contenu
  d'URL supplémentaires dans toutes les URLs générées dans le helper::

      $this->Paginator->options([
          'url' => [
              'sort' => 'email',
              'direction' => 'desc',
              'page' => 6,
              'lang' => 'en'
          ]
      ]);

  Ce qui se trouve ci-dessus  ajoutera ``en`` comme paramètre de route pour
  chacun des liens que le helper va générer. Il créera également des liens avec
  des tris, direction et valeurs de page spécifiques. Par défaut
  PaginatorHelper fusionnera cela dans tous les paramètres passés et nommés.
  Ainsi vous n'aurez pas à le faire dans chacun des fichiers de vue.

* ``escape`` Définit si le HTMl du champ titre des liens doit être échappé.
  Par défaut à ``true``.

* ``model`` Le nom du model en cours de pagination, par défaut à
  :php:meth:`PaginatorHelper::defaultModel()`.

Exemple d'Utilisation
=====================

C'est à vous de décider comment afficher les enregistrements à l'utilisateur,
mais la plupart des fois, ce sera fait à l'intérieur des tables HTML. L'exemple
ci-dessous suppose une présentation tabulaire, mais le Helper Paginator
disponible dans les vues n'a pas toujours besoin d'être limité en tant que tel.

Voir les détails sur
`PaginatorHelper <https://api.cakephp.org/3.0/class-Cake.View.Helper.PaginatorHelper.html>`_
dans l' API. Comme mentionné précédemment, le Helper Paginator offre également
des fonctionnalités de tri qui peuvent être intégrées dans vos en-têtes de
colonne de table:

.. code-block:: php

    <!-- src/Template/Posts/index.ctp -->
    <table>
        <tr>
            <th><?= $this->Paginator->sort('id', 'ID') ?></th>
            <th><?= $this->Paginator->sort('title', 'Title') ?></th>
        </tr>
           <?php foreach ($recipes as $recipe): ?>
        <tr>
            <td><?= $recipe->id ?> </td>
            <td><?= h($recipe->title) ?> </td>
        </tr>
        <?php endforeach; ?>
    </table>

Les liens en retour de la méthode ``sort()`` du ``PaginatorHelper`` permettent
aux utilisateurs de cliquer sur les entêtes de table pour faire basculer l'ordre
de tri des données d'un champ donné.

Il est aussi possible de trier une colonne basée sur des associations:

.. code-block:: php

    <table>
        <tr>
            <th><?= $this->Paginator->sort('title', 'Title') ?></th>
            <th><?= $this->Paginator->sort('Authors.name', 'Author') ?></th>
        </tr>
           <?php foreach ($recipes as $recipe): ?>
        <tr>
            <td><?= h($recipe->title) ?> </td>
            <td><?= h($recipe->name) ?> </td>
        </tr>
        <?php endforeach; ?>
    </table>

L'ingrédient final pour l'affichage de la pagination dans les vues est
l'addition de pages de navigation, aussi fournies par le Helper de Pagination::

    // Montre les numéros de page
    <?= $this->Paginator->numbers() ?>

    // Montre les liens précédent et suivant
    <?= $this->Paginator->prev('« Previous') ?>
    <?= $this->Paginator->next('Next »') ?>

    // affiche X et Y, ou X est la page courante et Y est le nombre de pages
    <?= $this->Paginator->counter() ?>

Le texte de sortie de la méthode counter() peut également être personnalisé en
utilisant des marqueurs spéciaux::

    <?= $this->Paginator->counter([
        'format' => 'Page {{page}} of {{pages}}, showing {{current}} records out of
                 {{count}} total, starting on record {{start}}, ending on {{end}}'
    ]) ?>

Générer des Url de Pagination
=============================

.. php:method:: generateUrl(array $options = [], $model = null, $full = false)

Retourne par défaut une chaine de l'URL de pagination complète pour utiliser
dans contexte non-standard(ex. JavaScript)::

    echo $this->Paginator->generateUrl(['sort' => 'title']);

.. _paginator-helper-multiple:

Paginer Plusieurs Résultats
===========================

Si vous :ref:`faîtes des requêtes de pagination
multiple <paginating-multiple-queries>` vous devrez définir l'option ``model`` quand vous générez les
éléments de la pagination. Vous pouvez soit utiliser l'option ``model`` sur
chaque appel de méthode que vous faîtes au ``PaginatorHelper``, soit utiliser
``options()`` pour définir le model par défaut::

    // Passe l'option model
    echo $this->Paginator->sort('title', ['model' => 'Articles']);

    // Définit le model par défaut.
    $this->Paginator->options(['defaultModel' => 'Articles']);
    echo $this->Paginator->sort('title');

En utilisant l'option ``model``, ``PaginatorHelper`` va automatiquement utiliser
le ``scope`` défini quand la reqûete a été paginée.

.. versionadded:: 3.3.0
    La pagination multiple a été ajoutée dans la version 3.3.0

.. meta::
    :title lang=fr: PaginatorHelper
    :description lang=fr: PaginationHelper est utilisé pour le contrôle des sorties paginées comme le nombre de page et les liens précédents/suivants.
    :keywords lang=fr: paginator helper,pagination,sort,page number links,pagination in views,prev link,next link,last link,first link,page counter
