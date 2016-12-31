Documentation
#############

Contribuer à la documentation est simple. Les fichiers sont hébergés sur
https://github.com/cakephp/docs. N'hésitez pas à forker le dépôt, ajoutez vos
changements/améliorations/traductions et retournez les avec un pull request.
Vous pouvez même modifier les documents en ligne avec GitHub, sans télécharger
les fichiers -- le bouton "Improve this Doc" (Améliorer cette Doc) sur toutes
les pages vous redirigera vers l'éditeur en ligne de Github pour la page
correspondante.

La documentation de CakePHP est `intégrée de façon continue
<http://en.wikipedia.org/wiki/Continuous_integration>`_,
donc vous pouvez vérifier le statut des
`différents builds <https://ci.cakephp.org>`_
sur le serveur Jenkins à tout moment.

Traductions
===========

Envoyez un Email à l'équipe docs (docs at cakephp dot org) ou venez
discuter sur IRC (#cakephp on freenode) de tout effort de traduction auquel
vous souhaitez participer.

Nouvelle Traduction d'une Langue
--------------------------------

Nous souhaitons créer des traductions aussi complètes que possible. Cependant,
il peut arriver des fois où un fichier de traduction n'est pas à jour. Vous
devriez toujours considérer la version anglais comme la version qui fait
autorité.

Si votre langue n'est pas dans les langues actuellement proposées, merci de
nous contacter sur Github et nous envisagerons de créer un squelette de dossier
pour cette langue. Les sections suivantes sont les premières par lesquelles vous
devriez commencer puisque ce sont des fichiers qui ne changent pas souvent:

- index.rst
- intro.rst
- quickstart.rst
- installation.rst
- dossier /intro
- dossier /tutorials-and-examples

Note pour les Administrateurs de la Doc
---------------------------------------

La structure de tous les dossiers de langue doivent refléter la structure du
dossier anglais. Si la structure change pour la version anglaise, nous devrions
appliquer ces changements dans les autres langues.

Par exemple, si un nouveau fichier anglais est créé dans **en/file.rst**, nous
devrions:

- Ajouter le fichier dans les autres langues : **fr/file.rst**, **zh/file.rst**, ...
- Supprimer le contenu, mais en gardant les ``title``, informations ``meta``
  et d'éventuels éléments ``toc-tree``. La note suivante sera ajoutée en anglais
  tant que personne n'a transmis le fichier::

    File Title
    ##########

    .. note::
        The documentation is not currently supported in XX language for this
        page.

        Please feel free to send us a pull request on
        `Github <https://github.com/cakephp/docs>`_ or use the **Improve This Doc**
        button to directly propose your changes.

        You can refer to the English version in the select top menu to have
        information about this page's topic.

    // If toc-tree elements are in the English version
    .. toctree::
        :maxdepth: 1

        one-toc-file
        other-toc-file

    .. meta::
        :title lang=xx: File Title
        :keywords lang=xx: title, description,...

Astuces de traducteurs
----------------------

- Parcourez et modifiez le contenu à traduire dans le langage voulu - sinon
  vous ne verrez pas ce qui a déjà été traduit.
- N'hésitez pas à plonger droit dans votre langue qui existe déjà dans le
  livre.
- Utilisez une
  `Forme Informelle <http://en.wikipedia.org/wiki/Register_(linguistics)>`_.
- Traduisez à la fois le contenu et le titre en même temps.
- Comparez au contenu anglais avant de soumettre une correction
  (si vous corrigez quelque chose, mais n'intégrez pas un changement 'en amont',
  votre soumission ne sera pas acceptée).
- Si vous avez besoin d'écrire un terme anglais, entourez le avec les balises
  ``<em>``. Ex: "asdf asdf *Controller* asdf" ou "asdf asdf Kontroller
  (*Controller*) asfd" comme il se doit.
- Ne soumettez pas de traductions partielles.
- Ne modifiez pas une section avec un changement en attente.
- N'utilisez pas d'
  `entités HTML <http://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references>`_
  pour les caractères accentués, le livre utilise UTF-8.
- Ne changez pas les balises (HTML) de façon significative ou n'ajoutez pas
  de nouveau contenu.
- Si le contenu original manque d'informations, soumettez une modification
  pour cette version originale.

Guide de mise en forme de la documentation
==========================================

La documentation du nouveau CakePHP est écrit avec le
`formatage du texte ReST <http://en.wikipedia.org/wiki/ReStructuredText>`_.
ReST (Re Structured Text) est une syntaxe de texte de balisage similaire à
markdown, ou textile. Pour maintenir la cohérence, il est recommandé quand
vous ajoutez quelque chose à la documentation CakePHP que vous suiviez les
directives suivantes sur la façon de formater et de structurer votre texte.

Longueur des lignes
-------------------

Les lignes de texte doivent être de 80 colonnes au maximum. Seules exceptions,
pour les URLs longues et les extraits de code.

En-têtes et Sections
--------------------

Les sections d'en-tête sont créées par le soulignage du titre avec les
caractères de ponctuation, avec une longueur de texte au moins aussi longue.

- ``#`` Est utilisé pour indiquer les titres de page.
- ``=`` Est utilisé pour les sections dans une page.
- ``-`` Est utilisé pour les sous-sections.
- ``~`` Est utilisé pour les sous-sous-sections.
- ``^`` Est utilisé pour les sous-sous-sous-sections.

Les en-têtes ne doivent pas être imbriqués sur plus de 5 niveaux de profondeur.
Les en-têtes doivent être précédés et suivis par une ligne vide.

Les Paragraphes
---------------

Les paragraphes sont simplement des blocks de texte, avec toutes les lignes au
même niveau d'indentation. Les paragraphes ne doivent être séparés par plus
d'une ligne vide.

Le balisage interne
-------------------

* Un astérisque: *text* pour une accentuation (italiques)
  Nous les utiliserons pour mettre en exergue des infos générales.

  * ``*text*``.

* Deux astérisques: **text** pour une forte accentuation (caractères gras)
  Nous les utiliserons pour les répertoires de travail, les sujets de liste à
  puce, les noms de table et en excluant le mot "table" suivant.

  * ``**/config/Migrations**``, ``**articles**``, etc.

* Deux backquotes: ``text`` pour les exemples de code
  Nous les utiliserons pour les noms d'options de méthode, les noms de colonne
  des tables, les noms d'objet en excluant le mot "object" suivant et pour les
  noms de méthode/fonction -- en incluant "()".

  * ````cascadeCallbacks````, ````true````, ````id````,
    ````PagesController````, ````config()````, etc.

Si les astérisques ou les backquotes apparaissent dans le texte et peuvent être
confondus avec les délimiteurs du balisage interne, ils doivent être échappés
avec un backslash.

Le balisage interne a quelques restrictions:

* Il ne **doit pas** être imbriqué.
* Le contenu ne doit pas commencer ou finir avec un espace: ``* text*``
  est mauvais.
* Le contenu doit être séparé du texte environnant par des caractères
  qui ne sont pas des mots. Utilisez un backslash pour échapper pour
  régler le problème: ``unmot\ *engras*\ long``.

Listes
------

La liste du balisage est très similaire à celle de markdown. Les listes non
ordonnées commencent par une ligne avec un unique astérisque et un espace.
Les listes numérotées peuvent être créées avec, soit les numéros, soit ``#``
pour une numérotation automatique::

    * C'est une balle
    * Ici aussi. Mais cette ligne
      a deux lignes.

    1. Première ligne
    2. Deuxième ligne

    #. Numérotation automatique
    #. Va vous faire économiser du temps.

Les listes indentées peuvent aussi être créées, en indentant les sections et en
les séparant avec une ligne vide::

    * Première ligne
    * Deuxième ligne

        * Allez plus profondément
        * Whoah

    * Retour au premier niveau.

Les listes avec définitions peuvent être créées en faisant ce qui suit::

    term
        définition
    CakePHP
        Un framework MVC pour PHP

Les termes ne peuvent pas être sur plus d'une ligne, mais les définitions
peuvent être multi-lignes et toutes les lignes doivent toujours être indentées.

Liens
-----

Il y a plusieurs types de liens, chacun avec ses propres utilisations.

Liens externes
~~~~~~~~~~~~~~

Les liens vers les documents externes peuvent être faits avec ce qui suit::

    `Lien externe vers php.net <http://php.net>`_

Le lien résultant ressemblerait à ceci: `Lien externe vers php.net <http://php.net>`_

Lien vers les autres pages
~~~~~~~~~~~~~~~~~~~~~~~~~~

.. rst:role:: doc

    Les autres pages de la documentation peuvent être liées en utilisant le
    modèle ``:doc:``. Vous pouvez faire un lien à un document spécifique en
    utilisant, soit un chemin de référence absolu ou relatif. Vous pouvez
    omettre l'extension ``.rst``. Par exemple, si la référence
    ``:doc:`form``` apparait dans le document ``core-helpers/html``, alors le
    lien de référence ``core-helpers/form``. Si la référence était
    ``:doc:`/core-helpers``` il serait en référence avec ``/core-helpers`` sans
    soucis de où il a été utilisé.

Les liens croisés de référencement
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. rst:role:: ref

    Vous pouvez recouper un titre quelconque dans n'importe quel document en
    utilisant le modèle ``:ref:``. Le label de la cible liée doit être unique
    à travers l'entière documentation. Quand on crée les labels pour les
    méthodes de classe, il vaut mieux utiliser ``class-method`` comme format
    pour votre label de lien.

    L'utilisation la plus commune des labels est au-dessus d'un titre. Exemple::

        .. _nom-label:

        Section en-tête
        ---------------

        Plus de contenu ici.

    Ailleurs, vous pouvez référencer la section suivante en utilisant
    ``:ref:`label-name```. Le texte du lien serait le titre qui précède le
    lien. Vous pouvez aussi fournir un texte de lien sur mesure en utilisant
    ``:ref:`Texte de lien <nom-label>```.

Eviter l'Affichage d'Avertissements de Sphinx
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sphinx va afficher des avertissements si un fichier n'est pas référencé dans
un toc-tree. C'est un bon moyen de s'assurer que tous les fichiers ont un
lien pointé vers eux, mais parfois vous n'avez pas besoin d'insérer un lien
pour un fichier, par exemple pour nos fichiers `epub-contents` et
`pdf-contents`. Dans ces cas, vous pouvez ajouter ``:orphan:`` en haut du
fichier pour supprimer les avertissements disant que le fichier n'est pas dans
le toc-tree.

Description des classes et de leur contenu
------------------------------------------

La documentation de CakePHP utilise `phpdomain
<http://pypi.python.org/pypi/sphinxcontrib-phpdomain>`_ pour fournir des
directives sur mesure pour décrire les objets PHP et les constructs. Utiliser
les directives et les modèles est requis pour donner une bonne indexation et
des fonctionnalités de référencement croisé.

Description des classes et constructs
-------------------------------------

Chaque directive remplit l'index, et l'index des espaces de nom.

.. rst:directive:: .. php:global:: name

   Cette directive déclare une nouvelle variable globale PHP.

.. rst:directive:: .. php:function:: name(signature)

   Définit une nouvelle fonction globale en-dehors de la classe.

.. rst:directive:: .. php:const:: name

   Cette directive déclare une nouvelle constante PHP, vous pouvez aussi
   l'utiliser imbriquée à l'intérieur d'une directive de classe pour créer
   les constantes de classe.

.. rst:directive:: .. php:exception:: name

   Cette directive déclare un nouvelle Exception dans l'espace de noms
   courant. La signature peut inclure des arguments du constructeur.

.. rst:directive:: .. php:class:: name

   Décrit une classe. Méthodes, attributs, et constantes appartenant à la
   classe doivent être à l'intérieur du corps de la directive::

        .. php:class:: MyClass

            Description de la Classe

           .. php:method:: method($argument)

           Description de la méthode


   Attributs, méthodes et constantes ne doivent pas être imbriqués. Ils peuvent
   aussi suivre la déclaration de classe::

        .. php:class:: MyClass

            Texte sur la classe

        .. php:method:: methodName()

            Texte sur la méthode


   .. seealso:: :rst:dir:`php:method`, :rst:dir:`php:attr`, :rst:dir:`php:const`

.. rst:directive:: .. php:method:: name(signature)

   Décrit une méthode de classe, ses arguments, les valeurs retournées et
   les exceptions::

        .. php:method:: instanceMethod($one, $two)

            :param string $un: Le premier param\ètre.
            :param string $deux: Le deuxième param\ètre.
            :returns: Un tableau de trucs.
            :throws: InvalidArgumentException

           C\'est un m\éthode d\'instanciation.

.. rst:directive:: .. php:staticmethod:: ClassName::methodName(signature)

    Décrire une méthode statique, ses arguments, les valeurs retournées et
    les exceptions.

    see :rst:dir:`php:method` pour les options.

.. rst:directive:: .. php:attr:: name

   Décrit une propriété/attribut sur une classe.

Eviter l'Affichage d'Avertissements de Sphinx
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Sphinx va afficher des avertissements si une fonction est référencée dans
plusieurs fichiers. C'est un bon moyen de s'assurer que vous n'avez pas ajouté
une fonction deux fois, mais parfois vous voulez en fait écrire une fonction
dans deux ou plusieurs fichiers, par exemple `debug object` est référencé dans
`/development/debugging` et dans
`/core-libraries/global-constants-and-functions`. Dans ce cas, vous pouvez
ajouter ``:noindex:`` sous la fonction debug pour supprimer les avertissements.
Gardez uniquement une référence **sans** ``:no-index:`` pour que la fonction
soit référencée::

    .. php:function:: debug(mixed $var, boolean $showHtml = null, $showFrom = true)
        :noindex:

Référencement croisé
~~~~~~~~~~~~~~~~~~~~

Les modèles suivants se réfèrent aux objets PHP et les liens sont générés
si une directive assortie est trouvée:

.. rst:role:: php:func

   Référence une fonction PHP.

.. rst:role:: php:global

   Référence une variable globale dont le nom a un préfixe ``$``.

.. rst:role:: php:const

   Référence soit une constante globale, soit une constante de classe. Les
   constantes de classe doivent être précédées par la classe propriétaire::

        DateTime a une constante :php:const:`DateTime::ATOM`.

.. rst:role:: php:class

   Référence une classe par nom::

     :php:class:`ClassName`

.. rst:role:: php:meth

   Référence une méthode d'une classe. Ce modèle supporte les deux types de
   méthodes::

     :php:meth:`DateTime::setDate`
     :php:meth:`Classname::staticMethod`

.. rst:role:: php:attr

   Référence une propriété d'un objet::

      :php:attr:`ClassName::$propertyName`

.. rst:role:: php:exc

   Référence une exception.

Code source
-----------

Les blocks de code littéral sont créés en finissant un paragraphe avec ``::``.
Le block littéral doit être indenté, et comme pour tous les paragraphes, être
séparé par des lignes uniques::

    C'est un paragraphe::

        while ($i--) {
            faireDesTrucs()
        }

    C'est un texte régulier de nouveau.

Le texte littéral n'est pas modifié ou formaté, la sauvegarde du niveau
d'indentation est supprimée.

Notes et avertissements
-----------------------

Il y a souvent des fois où vous voulez informer le lecteur d'une astuce
importante, une note spéciale ou un danger potentiel. Les avertissements
dans sphinx sont justement utilisés pour cela. Il y a cinq types
d'avertissements.

* ``.. tip::`` Les astuces sont utilisées pour documenter ou ré-itérer des
  informations intéressantes ou importantes. Le contenu de cette directive doit
  être écrit dans des phrases complètes et inclure toutes les ponctuations
  appropriées.
* ``.. note::`` Les notes sont utilisées pour documenter une information
  particulièrement importante. Le contenu de cette directive doit
  être écrit dans des phrases complètes et inclure toutes les ponctuations
  appropriées.
* ``.. warning::`` Les avertissements sont utilisés pour documenter des blocks
  potentiellement dangereux, ou des informations relatives à la sécurité. Le
  contenu de la directive doit être écrite en phrases complètes et inclure
  toute la ponctuation appropriée.
* ``.. versionadded:: X.Y.Z`` Les avertissements "ajouté en version X.Y.Z" sont
  utilisés pour spécifier l'ajout de fonctionnalités dans une version
  spécifique, ``X.Y.Z`` étant la version à laquelle l'ajout de la fonctionnalité
  en question a eu lieu
* ``.. deprecated:: X.Y.Z`` À la différence des avertissements "ajouté en
  version", les avertissements "déprécié en version" servent à indiquer la
  dépréciation d'une fonctionnalité à une version précise, ``X.Y.Z`` étant la
  version à laquelle le retrait de la fonctionnalité en question a eu lieu.

Tous les avertissements sont faits de la même façon::

    .. note::

        Indenté, précédé et suivi par une ligne vide. Exactement comme
        un paragraphe.

    Ce texte n'est pas une partie de la note.

Exemples
~~~~~~~~

.. tip::

    C'est une astuce utile que vous allez probablement oubliée.

.. note::

    Vous devriez y faire attention.

.. warning::

    Cela pourrait être dangereux.

.. versionadded:: 2.6.3

    Cette super fonctionnalité a été ajoutée à partir de la version 2.6.3.

.. deprecated:: 2.6.3

    Cette vieille fonctionnalité a été dépréciée à partir de la version 2.6.3.

.. meta::
    :title lang=fr: Documentation
    :keywords lang=fr: traductions partielles,efforts de traduction,entités html,balise de texte,asfd,asdf,texte structuré,contenu anglais,markdown,texte formaté,dot org,dépôt,cohérence,traducteur,freenode,textile,amélioration,syntaxes,cakephp,soumission
