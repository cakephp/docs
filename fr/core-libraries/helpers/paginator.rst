Paginator
#########

.. php:class:: PaginatorHelper(View $view, array $settings = array())

Le Helper Paginator est utilisé pour présenter des contrôles de pagination
comme les numéros de pages et les liens suivant/précédent. Il travaille en
tandem avec :php:class:`PaginatorComponent`.

Voir aussi :doc:`/core-libraries/components/pagination` pour des informations
sur la façon de créer des jeux de données paginés et faire des requêtes paginées.

Création de liens triés
=======================

.. php:method:: sort($key, $title = null, $options = array())

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

Les clés acceptée pour ``$options``:

* ``escape`` Si vous voulez que le contenu soit encodé en HTML, true par
  défaut.
* ``model`` Le model à utiliser, par défaut à PaginatorHelper::defaultModel().
* ``direction`` La direction par défaut à utiliser quand ce lien n'est pas actif.
* ``lock`` Verrouiller la direction. Va seulement utiliser la direction par
  défaut, par défaut à false.

  .. versionadded:: 2.5
    Vous pouvez maintenant définir l'option lock à true afin de verrouiller
    la direction du tri dans la direction spécifiée.

En considérant que vous paginez des posts, qu'ils sont sur la page un::

    echo $this->Paginator->sort('user_id');

Sortie:

.. code-block:: html

    <a href="/posts/index/page:1/sort:user_id/direction:asc/">User Id</a>

Vous pouvez utiliser le paramètre title pour créer des textes personnalisés
pour votre lien::

    echo $this->Paginator->sort('user_id', 'User account');

Sortie:

.. code-block:: html

    <a href="/posts/index/page:1/sort:user_id/direction:asc/">User account</a>

Si vous utilisez de l'HTML comme des images dans vos liens rappelez-vous de
paramétrer l'échappement::

    echo $this->Paginator->sort(
      'user_id',
      '<em>User account</em>',
      array('escape' => false)
    );

Sortie:

.. code-block:: html

    <a href="/posts/index/page:1/sort:user_id/direction:asc/">
      <em>User account</em>
    </a>

L'option de direction peut être utilisée pour paramétrer la direction par
défaut pour un lien. Une fois qu'un lien est activé, il changera
automatiquement de direction comme habituellement::

    echo $this->Paginator->sort('user_id', null, array('direction' => 'desc'));

Sortie

.. code-block:: html

    <a href="/posts/index/page:1/sort:user_id/direction:desc/">User Id</a>

L'option lock peut être utilisée pour verrouiller le tri dans la direction
spécifiée::

    echo $this->Paginator->sort('user_id', null, array('direction' => 'asc', 'lock' => true));

.. php:method:: sortDir(string $model = null, mixed $options = array())

    récupère la direction courante du tri du jeu d'enregistrement.

.. php:method:: sortKey(string $model = null, mixed $options = array())

    récupère la clé courante selon laquelle le jeu d'enregistrement est trié.

Création des liens de page numérotés
====================================

.. php:method:: numbers($options = array())

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
* ``separator`` Séparateur, par défaut à `` | ``
* ``tag`` La balise dans laquelle envelopper les liens, par défaut à 'span'.
* ``class`` Le nom de classe de la balise entourante.
* ``currentClass`` Le nom de classe à utiliser sur le lien courant/actif. Par
  défaut à *current*.
* ``first`` Si vous voulez que les premiers liens soit générés, définit à un
  entier pour définir le nombre de 'premier' liens à générer. Par défaut à
  false. Si une chaîne est définie un lien pour la première page sera générée
  avec la valeur comme titre::

      echo $this->Paginator->numbers(array('first' => 'Première page'));

* ``last`` Si vous voulez que les derniers liens soit générés, définit à un
  entier pour définir le nombre de 'dernier' liens à générer. Par défaut à
  false. Suit la même logique que l'option ``first``. il y a méthode
  :php:meth:`~PaginatorHelper::last()` à utiliser séparément si vous le voulez.
* ``ellipsis`` Contenu des suspensions, par défaut à '...'
* La balise ``currentTag`` à utiliser pour le nombre de page courant, par
  défaut à null.
  Cela vous autorise à générer par exemple le Bootstrap Twitter comme les
  liens avec le nombre de page courant enroulé dans les balises
  'a' ou 'span' supplémentaires.

Bien que cette méthode permette beaucoup de customisation pour ses sorties.
Elle est aussi prête pour être appelée sans aucun paramètres. ::

    echo $this->Paginator->numbers();

En utilisant les options first et last vous pouvez créer des liens pour le
début et la fin du jeu de page. Le code suivant pourrait créer un jeu de liens
de page qui inclut les liens des deux premiers et deux derniers résultats de
pages::

    echo $this->Paginator->numbers(array('first' => 2, 'last' => 2));

.. versionchanged:: 2.1
    L'option ``currentClass`` à été ajoutée dans la version 2.1.

.. versionadded:: 2.3
    L'option ``currentTag`` a été ajoutée dans 2.3.

Création de liens de sauts
==========================

En plus de générer des liens qui vont directement sur des numéros de pages
spécifiques, vous voudrez souvent des liens qui amènent vers le lien précédent
ou suivant, première et dernière pages dans le jeu de données paginées.

.. php:method:: prev($title = '<< Previous', $options = array(), $disabledTitle = null, $disabledOptions = array())

    :param string $title: Titre du lien.
    :param mixed $options: Options pour le lien de pagination.
    :param string $disabledTitle: Titre quand le lien est désactivé, comme
        quand vous êtes déjà sur la première page, sans page précédente où
        aller.
    :param mixed $disabledOptions: Options pour le lien de pagination désactivé.

    Génère un lien vers la page précédente dans un jeu d'enregistrements
    paginés.

    ``$options`` et ``$disabledOptions`` supportent les clés suivantes:

    * ``tag`` La balise enveloppante que vous voulez utiliser, 'span' par
      défaut.
    * ``escape`` Si vous voulez que le contenu soit encodé en HTML,
      par défaut à true.
    * ``model`` Le model à utiliser, par défaut PaginatorHelper::defaultModel()

    Un simple exemple serait::

        echo $this->Paginator->prev(
          '<< ' . __('previous'),
          array(),
          null,
          array('class' => 'prev disabled')
        );

    Si vous étiez actuellement sur la secondes pages des posts (articles),
    vous obtenez le résultat suivant:

    .. code-block:: html

        <span class="prev">
          <a rel="prev" href="/posts/index/page:1/sort:title/order:desc">
            &lt;&lt; previous
          </a>
        </span>

    Si il n'y avait pas de page précédente vous obtenez:

    .. code-block:: html

        <span class="prev disabled">&lt;&lt; previous</span>

    Vous pouvez changer la balise enveloppante en utilisant l'option ``tag``::

        echo $this->Paginator->prev(__('previous'), array('tag' => 'li'));

    Sortie:

    .. code-block:: html

        <li class="prev">
          <a rel="prev" href="/posts/index/page:1/sort:title/order:desc">
            previous
          </a>
        </li>

    Vous pouvez aussi désactiver la balise enroulante::

        echo $this->Paginator->prev(__('previous'), array('tag' => false));

    Output:

    .. code-block:: html

        <a class="prev" rel="prev"
          href="/posts/index/page:1/sort:title/order:desc">
          previous
        </a>

.. versionchanged:: 2.3
    Pour les méthodes: :php:meth:`PaginatorHelper::prev()` et
    :php:meth:`PaginatorHelper::next()`, il est maintenant possible de définir
    l'option ``tag`` à ``false`` pour désactiver le wrapper.
    Les nouvelles options ``disabledTag`` ont été ajoutées.

    Si vous laissez vide ``$disabledOptions``, le paramètre ``$options`` sera
    utilisé. Vous pouvez enregistrer d'autres saisies si les deux groupes
    d'options sont les mêmes.

.. php:method:: next($title = 'Next >>', $options = array(), $disabledTitle = null, $disabledOptions = array())

    Cette méthode est identique à :php:meth:`~PaginatorHelper::prev()` avec
    quelques exceptions. il créé le lien pointant vers la page suivante au
    lieu de la précédente. elle utilise aussi ``next`` comme valeur d'attribut
    rel au lieu de ``prev``.

.. php:method:: first($first = '<< first', $options = array())

    Retourne une première ou un nombre pour les premières pages. Si une chaîne
    est fournie, alors un lien vers la première page avec le texte fourni sera
    créé::

        echo $this->Paginator->first('< first');

    Ceci créé un simple lien pour la première page. Ne retournera rien si vous
    êtes sur la première page. Vous pouvez aussi utiliser un nombre entier pour
    indiquer combien de premier liens paginés vous voulez générer::

        echo $this->Paginator->first(3);

    Ceci créera des liens pour les 3 premières pages, une fois la troisième
    page ou plus atteinte. Avant cela rien ne sera retourné.

    Les paramètres d'option acceptent ce qui suit:

    - ``tag`` La balise tag enveloppante que vous voulez utiliser, par défaut
      à 'span'.
    - ``after`` Contenu à insérer après le lien/tag.
    - ``model`` Le model à utiliser par défaut PaginatorHelper::defaultModel().
    - ``separator`` Contenu entre les liens générés, par défaut à ' | '.
    - ``ellipsis`` Contenu pour les suspensions, par défaut à '...'.

.. php:method:: last($last = 'last >>', $options = array())

    Cette méthode fonctionne très bien comme la méthode
    :php:meth:`~PaginatorHelper::first()`. Elle a quelques différences
    cependant. Elle ne générera pas de lien si vous êtes sur la dernière
    page avec la valeur chaîne ``$last``. Pour une valeur entière de ``$last``
    aucun lien ne sera généré une fois que l'utilisateur sera dans la zone
    des dernières pages.

.. php:method:: current(string $model = null)

    récupère la page actuelle pour le jeu d'enregistrement du model donné::

        // Ou l'URL est: http://example.com/comments/view/page:3
        echo $this->Paginator->current('Comment');
        // la sortie est 3

.. php:method:: hasNext(string $model = null)

    Retourne true si le résultat fourni n'est pas sur la dernière page.

.. php:method:: hasPrev(string $model = null)

    Retourne true si le résultat fourni n'est pas sur la première page.

.. php:method:: hasPage(string $model = null, integer $page = 1)

    Retourne true si l'ensemble de résultats fourni a le numéro de page fourni
    par ``$page``.

Création d'un compteur de page
==============================

.. php:method:: counter($options = array())

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

  -  ``{:page}`` - la page courante affichée.
  -  ``{:pages}`` - le nombre total de pages.
  -  ``{:current}`` - le nombre actuel d'enregistrements affichés.
  -  ``{:count}`` - le nombre total d'enregistrements dans le jeu de résultat.
  -  ``{:start}`` - le nombre de premier enregistrement affichés.
  -  ``{:end}`` - le nombre de dernier enregistrements affichés.
  -  ``{:model}`` - La forme plurielle du nom de model.
     Si  votre model était 'RecettePage', ``{:model}`` devrait être
     'recipe pages'.
     cette option a été ajoutée dans la 2.0.

  Vous pouvez aussi fournir simplement une chaîne à la méthode counter en
  utilisant les jetons autorisés. Par exemple::

      echo $this->Paginator->counter(
          'Page {:page} of {:pages}, showing {:current} records out of
           {:count} total, starting on record {:start}, ending on {:end}'
      );

  En définissant 'format' à 'range' donnerait en sortie '1 - 3 of 13'::

      echo $this->Paginator->counter(array(
          'format' => 'range'
      ));

* ``separator`` Le séparateur entre la page actuelle et le nombre de pages.
  Par défaut à ' of '. Ceci est utilisé en conjonction  avec 'format' ='pages'
  qui la valeur par défaut de 'format'::

      echo $this->Paginator->counter(array(
          'separator' => ' sur un total de '
      ));

* ``model`` Le nom du model en cours de pagination, par défaut à
  :php:meth:`PaginatorHelper::defaultModel()`. Ceci est utilisé en conjonction
  avec la chaîne personnalisée de l'option 'format'.

Modification des options que le Helper Paginator utilise
========================================================

.. php:method:: options($options = array())

    :param mixed $options: Options par défaut pour les liens de pagination. Si
       une chaîne est fournie - elle est utilisée comme id de l'élément DOM à
       actualiser.

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

      $this->Paginator->options(array(
          'url' => array(
              'sort' => 'email', 'direction' => 'desc', 'page' => 6,
              'lang' => 'en'
          )
      ));

  Ce qui se trouve ci-dessus  ajoutera ``en`` comme paramètre de route pour
  chacun des liens que le helper va générer. Il créera également des liens avec
  des tris, direction et valeurs de page spécifiques. Par défaut
  PaginatorHelper fusionnera cela dans tous les paramètres passés et nommés.
  Ainsi vous n'aurez pas à le faire dans chacun des fichiers de vue.

* ``escape`` Définit si le champ titre des liens doit être échappé HTML.
  Par défaut à true.

* ``update`` Le selecteur CSS de l'élément à actualiser avec le résultat de
  l'appel de pagination  AJAX. Si cela n'est pas spécifié, des liens réguliers
  seront créés::

    $this->Paginator->options(array('update' => '#content'));

  Ceci est utile lors de l'utilisation de la pagination AJAX
  :ref:`ajax-pagination`. Gardez à l'esprit que la valeur actualisée peut
  être un selecteur CSS valide, mais il est souvent plus simple d'utiliser un
  selecteur id.

* ``model`` Le nom du model en cours de pagination, par défaut à
  :php:meth:`PaginatorHelper::defaultModel()`.


Utilisation de paramètres GET pour la pagination
------------------------------------------------

Normalement la Pagination dans CakePHP utilise :ref:`named-parameters`. Il
y a des fois ou vous souhaiterez utilisez des paramètres GET à la place. Alors
que la principale option de configuration pour cette fonctionnalité est dans
:php:class:`PaginatorComponent`, vous avez des contrôles supplémentaires dans
les vues. Vous pouvez utiliser `options()`` pour indiquer que vous voulez la
conversion d'autres paramètres nommés::

    $this->Paginator->options(array(
      'convertKeys' => array('your', 'keys', 'here')
    ));

Configurer le Helper Paginator pour utiliser le Helper Javascript
-----------------------------------------------------------------

Par défaut le ``Helper Paginator`` utilise :php:class:`JsHelper` pour effectuer
les fonctionnalités AJAX. Toutefois, si vous ne voulez pas cela et que vous
voulez utiliser un Helper personnalisé pour les liens AJAX, vous pouvez le
faire en changeant le tableau ``$helpers`` dans votre controller.
Après avoir lancé ``paginate()`` faîtes ce qui suit::

    // Dans l'action de votre controller.
    $this->set('posts', $this->paginate());
    $this->helpers['Paginator'] = array('ajax' => 'CustomJs');

Changera le ``Helper Paginator`` pour utiliser ``CustomJs`` pour
les opérations AJAX. Vous pourriez aussi définir la clé AJAX
pour être un Helper, tant que la classe implémente la méthode
``link()`` qui se comporte comme :php:meth:`HtmlHelper::link()`.

La Pagination dans les Vues
===========================

C'est à vous de décider comment afficher les enregistrements à
l'utilisateur, mais la plupart des fois, ce sera fait à l'intérieur des
tables HTML. L'exemple ci-dessous suppose une présentation
tabulaire, mais le Helper Paginator disponible dans les vues
N'a pas toujours besoin d'être limité en tant que tel.

Voir les détails sur
`PaginatorHelper <https://api.cakephp.org/2.x/class-PaginatorHelper.html>`_
dans l' API. Comme mentionné précédemment, le Helper Paginator
offre également des fonctionnalités de tri qui peuvent être facilement
intégrés dans vos en-têtes de colonne de table:

.. code-block:: php

    // app/View/Posts/index.ctp
    <table>
        <tr>
            <th><?php echo $this->Paginator->sort('id', 'ID'); ?></th>
            <th><?php echo $this->Paginator->sort('title', 'Title'); ?></th>
        </tr>
           <?php foreach ($data as $recipe): ?>
        <tr>
            <td><?php echo $recipe['Recipe']['id']; ?> </td>
            <td><?php echo h($recipe['Recipe']['title']); ?> </td>
        </tr>
        <?php endforeach; ?>
    </table>

Les liens en retour de la méthode ``sort()`` du ``PaginatorHelper``
permettent au utilisateurs de cliquer sur les entêtes de table pour
faire basculer l'ordre de tri des données d'un champ donné.

Il est aussi possible de trier une colonne basée sur des associations:

.. code-block:: php

    <table>
        <tr>
            <th><?php echo $this->Paginator->sort('titre', 'Titre'); ?></th>
            <th><?php echo $this->Paginator->sort('Auteur.nom', 'Auteur'); ?></th>
        </tr>
           <?php foreach ($data as $recette): ?>
        <tr>
            <td><?php echo h($recette['Recette']['titre']); ?> </td>
            <td><?php echo h($recette['Auteur']['nom']); ?> </td>
        </tr>
        <?php endforeach; ?>
    </table>

L'ingrédient final pour l'affichage de la pagination dans les vues
est l'addition de pages de navigation, aussi fournies par le
Helper de Pagination::

    // Montre les numéros de page
    echo $this->Paginator->numbers();

    // Montre les liens précédent et suivant
    echo $this->Paginator->prev('« Previous', null, null, array('class' => 'disabled'));
    echo $this->Paginator->next('Next »', null, null, array('class' => 'disabled'));

    // affiche X et Y, ou X est la page courante et Y est le nombre de pages
    echo $this->Paginator->counter();

Le texte de sortie de la méthode counter() peut également être personnalisé
en utilisant des marqueurs spéciaux::

    echo $this->Paginator->counter(array(
        'format' => 'Page {:page} of {:pages}, showing {:current} records out of
                 {:count} total, starting on record {:start}, ending on {:end}'
    ));

D'autres Méthodes
=================

.. php:method:: link($title, $url = array(), $options = array())

    :param string $title: Titre du lien.
    :param mixed $url: Url de l'action. Voir Router::url().
    :param array $options: Options pour le lien. Voir options() pour la liste
        des clés.

    Les clés acceptées pour ``$options``:

        * **update** - L' Id de l'élément DOM que vous souhaitez actualiser.
            Créé des liens près pour AJAX.
        * **escape** Si vous voulez que le contenu soit encodé comme une
            entité HTML, par défaut à true.
        * **model** Le model à utiliser, par défaut à
            PaginatorHelper::defaultModel().

    Créé un lien ordinaire ou AJAX avec des paramètres de pagination::

        echo $this->Paginator->link('Sort by title on page 5',
                array('sort' => 'title', 'page' => 5, 'direction' => 'desc'));

    Si créé dans la vue de ``/posts/index``, cela créerait un lien pointant
    vers '/posts/index/page:5/sort:title/direction:desc'.


.. php:method:: url($options = array(), $asArray = false, $model = null)

    :param array $options: Tableau d'options Pagination/URL. Comme
        utilisé dans les méthodes ``options()`` ou ``link()``.
    :param boolean $asArray: Retourne l'URL comme dans un tableau, ou une
        chaîne URL. Par défaut à false.
    :param string $model: Le model sur lequel paginer.

    Par défaut retourne une chaîne URL complètement paginée à utiliser
    dans des contextes non-standard (ex. JavaScript). ::

        echo $this->Paginator->url(array('sort' => 'titre'), true);

.. php:method:: defaultModel()

    Retourne le model par défaut du jeu de pagination ou null
    si la pagination n'est pas initialisée.

.. php:method:: params(string $model = null)

    Retourne les paramètres courants de la pagination du jeu
    de résultat d'un model donné::

        debug($this->Paginator->params());
        /*
        Array
        (
            [page] => 2
            [current] => 2
            [count] => 43
            [prevPage] => 1
            [nextPage] => 3
            [pageCount] => 3
            [order] =>
            [limit] => 20
            [options] => Array
                (
                    [page] => 2
                    [conditions] => Array
                        (
                        )
                )
            [paramType] => named
        )
        */

.. php:method:: param(string $key, string $model = null)

    Récupère le paramètre de pagination spécifique à partir de l'ensemble de
    résultats pour le model donné::

        debug($this->Paginator->param('count'));
        /*
        (int)43
        */

.. versionadded:: 2.4
    La méthode ``param()`` a été ajoutée dans 2.4.

.. php:method:: meta(array $options = array())

    Génère le meta-links pour un résultat paginé::

        echo $this->Paginator->meta(); // Example output for page 5
        /*
        <link href="/?page=4" rel="prev" /><link href="/?page=6" rel="next" />
        */

    Vous pouvez également ajouter la génération de la fcontion meta à un block
    nommé::

        $this->Paginator->meta(array('block' => true));

    Si true est envoyé, le block "meta" est utilisé.

.. versionadded:: 2.6
    La méthode ``meta()`` a été ajoutée dans 2.6.

.. meta::
    :title lang=fr: PaginatorHelper
    :description lang=fr: PaginationHelper est utilisé pour le contrôle des sorties paginées comme le nombre de page et les liens précédents/suivants.
    :keywords lang=fr: paginator helper,pagination,sort,page number links,pagination in views,prev link,next link,last link,first link,page counter
