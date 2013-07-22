Vues JSON et XML
################

Deux nouvelles classes de vue dans CakePHP 2.1. Les vues ``XmlView`` et
``JsonView`` vous laissent créer facilement des réponses XML et JSON,
et sont intégrées avec :php:class:`RequestHandlerComponent`.

En activant ``RequestHandlerComponent`` dans votre application, et en activant
le support pour les extensions ``xml`` et/ou ``json``, vous pouvez
automatiquement vous appuyer sur les nouvelles classes de vue. ``XmlView`` et
``JsonView`` feront référence aux vues de données pour le reste de cette page.

Il y a deux façons de générer des vues de données. La première est en utilisant
la clé ``_serialize``, et la seconde en créant des fichiers de vue normaux.

Activation des vues de données dans votre application
=====================================================

Avant que vous puissiez utiliser les classes de vue de données, vous aurez
besoin de faire un peu de configuration:

#. Activez les extensions json et/ou xml avec
   :php:meth:`Router::parseExtensions()`.  Cela activera Router pour gérer les
   multiples extensions.
#. Ajoutez le :php:class:`RequestHandlerComponent` à la liste de components de
   votre controller. Cela activera automatiquement le changement de la classe
   de vue pour les types de contenu.

.. versionadded:: 2.3
    La méthode :php:meth:`RequestHandlerComponent::viewClassMap()` a été
    ajoutée pour lier les types aux viewClasses.
    La configuration de viewClassMap ne va pas fonctionner avec les versions
    précédentes.

Après avoir ajouté ``Router::parseExtensions('json');`` à votre fichier de
routes, CakePHP changera automatiquement les classes de vue quand une requête
sera faite avec l'extension ``.json``, ou quand l'en-tête Accept sera
``application/json``.

Utilisation des vues de données avec la clé _serialize
======================================================

La clé ``_serialize`` est une variable de vue spéciale qui indique quel
autre(s) variable(s) de vue devraient être sérialisée(s) quan on utilise la vue
de données. Cela vous permet de sauter la définition des fichiers de vue pour
vos actions de controller si vous n'avez pas besoin de faire un formatage avant
que vos données soient converties en json/xml.

Si vous avez besoin de faire n'importe quel formatage ou manipulation de vos
variables de vue avant la génération de la réponse, vous devriez utiliser les
fichiers de vue. La valeur de ``_serialize`` peut être soit une chaîne de
caractère, soit un tableau de variables de vue pour sérialiser::

    class PostsController extends AppController {
        public function index() {
            $this->set('posts', $this->paginate());
            $this->set('_serialize', array('posts'));
        }
    }

Vous pouvez aussi définir ``_serialize`` en tableau de variables de vue pour
combiner::

    class PostsController extends AppController {
        public function index() {
            // some code that created $posts and $comments
            $this->set(compact('posts', 'comments'));
            $this->set('_serialize', array('posts', 'comments'));
        }
    }

Définir ``_serialize`` en tableau a le bénéfice ajouté d'ajouter
automatiquement un elément de top-niveau ``<response>`` en utilisant
:php:class:`XmlView`. Si vous utilisez une valeur de chaîne de caractère pour
``_serialize`` et XmlView, assurez vous que vos variables de vue aient un
elément unique de top-niveau. Sans un elément de top-niveau, le Xml ne pourra
être généré.

Utilisation d'une vue de données avec les fichiers de vue
=========================================================

Vous devriez utiliser les fichiers de vue si vous avez besoin de faire des
manipulations du contenu de votre vue avant de créer la sortie finale. Par
exemple, si vous avez des posts, qui ont un champ contenant du HTML généré,
nous voudrons probablement omettre ceci à partir d'une réponse JSON. C'est
une situation où un fichier de vue serait utile::

    // Code du controller
    class PostsController extends AppController {
        public function index() {
            $this->set(compact('posts', 'comments'));
        }
    }

    // Code de la vue - app/View/Posts/json/index.ctp
    foreach ($posts as &$post) {
        unset($post['Post']['generated_html']);
    }
    echo json_encode(compact('posts', 'comments'));

Vous pouvez faire des manipulations encore beaucoup plus complexes, ou
utiliser les helpers pour formater aussi.

.. note::

    Les classes de vue de données ne supportent pas les layouts. Elles
    supposent que le fichier de vue va afficher le contenu sérialisé.

.. php:class:: XmlView

    Une classe de vue pour la génération de vue de données Xml. Voir au-dessus
    pour savoir comment vous pouvez utiliser XmlView dans votre application

    Par défaut quand on utilise ``_serialize``, XmlView va enrouler vos
    variables de vue sérialisées avec un noeud ``<response>``. Vous pouvez
    définir un nom personnalisé pour ce noeud en utilisant la variable de vue
    ``_rootNode``.

    .. versionadded:: 2.3
        La fonctionnalité ``_rootNode`` a été ajoutée.

.. php:class:: JsonView

    Une classe de vue pour la génération de vue de données Json. Voir au-dessus
    pour savoir comment vous pouvez utiliser XmlView dans votre application.

JSONP response
==============

.. versionadded:: 2.4

Quand vous utilisez JsonView, vous pouvez utiliser la variable de vue spéciale
``_jsonp`` pour permettre de retourner une réponse JSONP. La définir à ``true``
fait que la classe de vue vérifie si le paramètre de chaine de la requête nommé
"callback" est défini et si c'est la cas, d'enrouler la réponse json dans le
nom de la fonction fournie. Si vous voulez utiliser un nom personnalisé de
paramètre de requête à la place de "callback", définissez ``_jsonp`` avec le
nom requis à la place de ``true``.
