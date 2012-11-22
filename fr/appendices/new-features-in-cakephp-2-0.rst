Nouvelles caractéristiques dans CakePHP 2.0
###########################################

Model
=====

Le processus de construction du modèle a été allegé. Les associations des 
Modèles sont maintenant en lazy loaded, les applications avec beaucoup de 
modèles et d'associations vont voir une grande réduction de temps dans le 
processus de bootstrap.

Les modèles ne requièrent maintenant plus de connection à la base de données 
dans le processus de construction. La base de données ne sera accédée pour la 
première fois seulement quand une opération de recherche est délivrée ou 
une information pour une des colonnes est requise.

View
====

View::$output
-------------

View n'aura pas toujours le dernier rendu de contenu (view ou layout) 
accessible avec ``$this->output``. Dans les helpers, vous pouvez utiliser 
``$this->_View->output``. Modifier cette propriété changera le contenu 
qui sort de la vue rendue.

Helpers
=======

HtmlHelper
----------

* ``getCrumbList()`` Créé un fil d'ariane de liens entourés d'éléments ``<li>``.
  Regardez `#856 <http://cakephp.lighthouseapp.com/projects/42648/tickets/856>`_.
* ``loadConfig()`` a été déplacé de :php:class:`Helper` vers la classe 
  :php:class:`HtmlHelper`. Cette méthode utilise maintenant les nouvelles 
  classes de lecture (voir 2.0 :php:class:`Configure`)
  pour  charger votre fichier de config. En option vous pouvez passer le chemin 
  en deuxième paramètre (``app/Config`` par défaut). Pour simplifier, vous 
  pouvez définir le fichier de configuration (et le lecteur) dans 
  ``Controller::$helpers`` (exemple ci-dessous) pour charger le constructeur 
  du helper. Dans le fichier de configuration, vous pouvez définir les clés 
  ci-dessous:

 * ``tags`` Doit être un tableau avec une valeur clé;
 * ``minimizedAttributes`` Doit être une liste;
 * ``docTypes`` Doit être un tableau avec une valeur clé;
 * ``attributeFormat`` Doit être une chaîne de caractère;
 * ``minimizedAttributeFormat`` Doit être une chaîne de caractère.

Exemple sur la façon de définir le fichier de configuration sur les contrôleurs::

    public $helpers = array(
        'Html' => array(
            'configFile' => array('config_file', 'php') // Option une: un tableau avec le nom du fichier et le nom de lecture
            'configFile' => 'config_file' // Option deux: une chaîne de caractère avec le nom du fichier. Le PhpReader sera utilisé
        )
    );

FormHelper
----------

* :php:class:`FormHelper` supporte maintenant tout type d'entrée HTML5 et 
  tout type d'entrée personnalisé. Utilisez simplement le type d'entrée 
  que vous souhaitez en méthode sur le helper. Par exemple ``range()`` 
  créera une entrée avec type = range.
* ``postLink()`` et ``postButton()`` Crée un lien/bouton permettant d'accéder 
  à certaine pasge utilisant la méthode HTTP POST. Avec ceci dans votre 
  controller vous pouvez empêcher certaines actions, comme delete, d'être 
  accédées par la méthode GET.
* ``select()`` avec multiple = checkbox, traite maintenant l'attribut ``'id'`` 
  en préfixe pour toutes les options générées.

Libs
====

CakeRequest
-----------

:php:class:`CakeRequest` est une nouvelle classe introduite dans 2.0. Elle 
encapsule les méthodes d'introspection de requêtes utilisées couramment et 
remplace le tableau params avec un objet plus utile. Lisez en plus sur
:php:class:`CakeRequest`.

CakeResponse
------------

:php:class:`CakeResponse` est une nouvelle classe introduite dans 2.0. Elle 
encapsule les méthodes et propriétés utilisées couramment dans la réponse HTTP 
que votre application génére. Elle consolide plusieurs caractéristiques dans 
CakePHP. Lisez en plus sur :php:class:`CakeResponse`.

CakeSession, SessionComponent
-----------------------------

:php:class:`CakeSession` et le :php:class:`SessionComponent` ont connu un 
nombre de changements, regardez la section session pour plus d'informations.

Router
------

Routes peuvent retourner des urls complètes
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Les Objets Route peuvent maintenant retourner des urls complètes, et 
:php:class:`Router` ne les modifiera plus au-delà de l'ajout de la 
chaîne de requête et des éléments de fragments. Par exemple, ceci 
pouvait être utilisé pour créer des routes pour la gestion de 
sous-domaines, ou pour l'activation de flags https/http. Un exemple 
de classe de route qui supporte les sous-domaines serait::

    class SubdomainRoute extends CakeRoute {
        
        public function match ($params) {
            $subdomain = isset($params['subdomain']) ? $params['subdomain'] : null;
            unset($params['subdomain']);
            $path = parent::match($params);
            if ($subdomain) {
                $path = 'http://' . $subdomain . '.localhost' . $path;
            }
            return $path;
        }
    }

Quand vous créez des liens, vous pouvez faire ce qui suit pour faire pointer 
les liens vers d'autres sous-domaines.

::

    echo $this->Html->link(
        'Autre domaine',
         array('subdomain' => 'test', 'controller' => 'posts', 'action' => 'add')
    );

Ce qui est ci-dessus créera un lien avec l'url http://test.localhost/posts/add.

Xml
---

:php:class:`Xml` a connu un certain nombre de changements. Lisez en plus sur la 
classe :doc:`/core-utility-libraries/xml`.

Nouvelles caractéristiques de Lib
=================================

Configure readers
-----------------

:php:class:`Configure` peut maintenant être configuré pour le chargement de 
fichiers à partir d'une variété de sources et de formats. La section 
:doc:`/development/configuration` contient plus d'informations sur les 
changements faits à configure.

:php:meth:`Configure::read()` sans autre argument vous permet de lire 
toutes les valeurs de configure, plutôt que uniquement  la valeur du debug.

Error et gestion des exceptions
-------------------------------

CakePHP 2.0 a reconstruit la gestion des :doc:`/development/exceptions` 
et des :doc:`/development/errors`, pour être plus flexible et donner 
plus de puissance aux développeurs.

String::wrap()
--------------

:php:meth:`String::wrap()` a été ajouté pour faciliter les formatages de 
largeur fixe des textes. Il est utilisé dans les Shells quand vous utilisez 
:php:meth:`Shell::wrapText()`.

debug()
-------

:php:func:`debug()` ne sort plus de html dans la console. A la place, elle 
donne des sorties comme ce qui suit::

    ########## DEBUG ##########
    Array
    (
        [0] => test
    )
    ###########################

Ceci devrait améliorer la lecture de ``debug()`` dans les lignes de commande.

Components
==========

Components reçoit un traitement identique aux helpers et aux behaviors,
:php:class:`Component` est maintenant la classe de base pour les components. 
Lisez en plus sur les changements sur les components.

RequestHandler
--------------

:php:class:`RequestHandler` a été fortement remaniée du fait de l'introduction 
de :php:class:`CakeRequest`. Ces changements permettent à certaines nouvelles 
fonctionnalités d'être aussi introduites.

Parsing automatique d'Acceptation des headers
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Si un client envoie un unique mime type Accept qui correspond à l'une  des 
extensions activées dans :php:class`Router`, :php:class:`RequestHandler` 
le traitera de la même façon qu'une extension. Cela étendra le support de 
CakePHP pour les terminaux de type REST. Pour utiliser cette fonctionnalité, 
commencez par activer les extensions dans ``app/Config/routes.php``

::

    Router::parseExtensions('json', 'xml');

Une fois que vous avez créé les layouts et les vues pour vos extensions, vous 
pourrez visiter une url comme posts/view/1 et envoyer Accept: 
``application/json`` dans les headers pour recevoir la version json de cette 
url.

CookieComponent
---------------

:php:class:`CookieComponent` supporte maintenant seulement les cookies http. 
Vous pouvez les activer en utilisant ``$this->Cookie->httpOnly = true;``. 
Avoir seulement les cookies http les rendra inaccessible à partir du navigateur.

Security Component CSRF separation
----------------------------------

CakePHP a une protection CSRF depuis 1.2. Pour 2.0, le CSRF existant a un 
nouveau mode plus paranoïaque, et est sa caractéristique propre autonome. 
Dans le passé, les fonctionnalités CSRF étaient couplées avec des gardes-fous 
de tampering de formulaires. Les développeurs désactivent souvent 
validatePost pour faire des formulaires dynamiques, en désactivant la 
protection CSRF en même temps. Pour 2.0, la vérification CSRF a été séparée 
du tampering des formulaires vous donnant plus de contrôle.

Pour plus d'informations, regardez :ref:`security-csrf`

Controller
==========

Les Controllers ont maintenant accès aux objets request et response. Vous 
pouvez en lire plus sur ces objets sur leurs pages spécifiques.

Console
=======

La console pour CakePHP 2.0 a été preque entièrement reconstruite. De 
nombreuses nouvelles caractéristiques ainsi que quelques changements 
incompatibles avec antérieurement. Lisez en plus sur les changements sur 
la console.

Pagination
==========

Pagination fournit maintenant un maxLimit par défaut à 100 pour la pagination.

Cette limite peut maintenant être dépassée avec la variable paginate dans 
le Controller.

::

    $this->paginate = array('maxLimit' => 1000);

Cette valeur par défaut est fournie pour empêcher l'utilisateur de manipuler 
les URL provoquant une pression excessive sur la base de données pour les 
requêtes suivantes, où un utilisateur modifierait le paramètre 'limit' pour 
une nombre très important.

Mettre un Alias
===============

Vous pouvez maintenant mettre un alias les helpers, les components et les 
behaviors pour utiliser votre classe plutôt qu'une autre. Cela signifie que 
vous pouvez très facilement faire un helper ``MyHtml`` et n'avez pas besoin 
de remplacer chaque instance de ``$this->Html`` dans vos vues. Pour le faire, 
passez la clé 'className' tout au long de votre classe, comme vous feriez avec 
les modèles.

::

    public $helpers = array( 
        'Html' => array( 
            'className' => 'MyHtml' 
        )
    );

De même, vous pouvez mettre en alias les components pour l'utilisation dans vos controllers.

::

    public $components = array( 
        'Email' => array( 
            'className' => 'QueueEmailer' 
        )
    );

Appeller le component Email appelle le component QueueEmailer à la place.
Finalement, vous pouvez aussi mettre en alias les behaviors.

::

    public $actsAs = array( 
        'Containable' => array( 
            'className' => 'SuperContainable' 
        ) 
    );

Du fait de la façon dont 2.0 utilise les collections et les partage dans 
toute l'application, toute classe que vous mettez en alias sera utilisée 
dans toute votre application. Quelque soit le moment où votre application 
essaie d'accéder à l'alias, elle aura accès à votre classe. Par exemple, 
quand vous mettez en alias le helper Html dans l'exemple ci-dessus, tous 
les helpers qui utilisent le helper Html ou les éléments qui chargent le 
helper Html, utiliseront MyHtml à la place.

ConnectionManager
=================

Une nouvelle méthode :php:meth:`ConnectionManager::drop()` a été ajoutée pour permettre 
de retirer les connections lors de l'éxecution.


.. meta::
    :title lang=fr: Nouvelles caractéristiques dans CakePHP 2.0
    :keywords lang=fr: réductions de temps,doctypes,construction de modèles,valeur clé,option une,connection base de données,vue du contenu,fichier de configuration,constructeur,temps bon,tableau,nouvelles caractéristiques,processus bootstrap,éléments,nouveaux modèles
