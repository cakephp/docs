REST
####

Quelques nouveaux programmeurs d'application réalisent le besoin 
d'ouvrir leurs fonctionnalités du coeur à un public plus important. 
Fournir facilement, un accès sans entrave à votre API du coeur peut 
aider à ce que votre plateforme soit acceptée, et permettre les 
mashups et une intégration facile avec les autres systèmes.

Alors que d'autres solutions existent, REST est un bon moyen de fournir 
facilement un accès à la logique que vous avez créee dans votre application. 
C'est simple, habituellement basé sur XML (nous parlons de XML simple, rien 
de semblable à une enveloppe SOAP), et dépend des headers HTTP pour la 
direction. Exposer une API via REST dans CakePHP est simple.

Mise en place Simple
====================

Le moyen le plus rapide pour démarrer avec REST est d'ajouter quelques lignes 
à votre fichier routes.php, situé dans app/Config. L'objet Routeur (Router) 
comporte une méthode appelée ``mapResources()`` utilisée pour mettre en place 
un certain nombre de routes par défaut accédant par REST à vos controllers.
Assurez-vous que ``mapResources()`` vienne avant 
``require CAKE . 'Config' . DS . 'routes.php';``. Si nous souhaitions 
permettre l'accès par REST à une base de données de recettes, nous ferions 
comme cela::

    //Dans app/Config/routes.php...
        
    Router::mapResources('recipes');
    Router::parseExtensions();

La première ligne met en place un certain nombre de routes par défaut pour 
un accès facile par REST où la méthode spécifie le format de résultat 
souhaité (ex: xml, json, rss). Ces routes correspondent aux méthodes de 
requêtes HTTP.

=========== ===================== ==============================
HTTP format URL.format            Action de contrôleur appelée
=========== ===================== ==============================
GET         /recipes.format       RecipesController::index()
----------- --------------------- ------------------------------
GET         /recipes/123.format   RecipesController::view(123)
----------- --------------------- ------------------------------
POST        /recipes.format       RecipesController::add()
----------- --------------------- ------------------------------
PUT         /recipes/123.format   RecipesController::edit(123)
----------- --------------------- ------------------------------
DELETE      /recipes/123.format   RecipesController::delete(123)
----------- --------------------- ------------------------------
POST        /recipes/123.format   RecipesController::edit(123)
=========== ===================== ==============================

La classe Routeur (Router) de CakePHP utilise un certain nombre d'indicateurs 
différents pour détecter la méthode HTTP utilisée. Les voici par ordre de 
préférence:


#. La variable POST *\_method*
#. X\_HTTP\_METHOD\_OVERRIDE
#. Le header REQUEST\_METHOD

La méthode variable POST *\_method* est utile lors de l'utilisation 
d'un navigateur en tant que client REST (ou n'importe quoi d'autre 
capable de faire facilement du POST). Il suffit d'initialiser la valeur 
de \_method au nom de la méthode de requête HTTP que vous souhaitez émuler.

Une fois que le routeur est paramétré pour faire correspondre les requêtes 
REST à certaines actions de controller, nous pouvons nous mettre à créer 
la logique dans nos actions de controller. Un controller basique pourrait 
ressembler à ceci::

    // Controller/RecipesController.php
    class RecipesController extends AppController {
    
        public $components = array('RequestHandler');
    
        public function index() {
            $recipes = $this->Recipe->find('all');
            $this->set(compact('recipes'));
        }
    
        public function view($id) {
            $recipe = $this->Recipe->findById($id);
            $this->set(compact('recipe'));
        }
    
        public function edit($id) {
            $this->Recipe->id = $id;
            if ($this->Recipe->save($this->request->data)) {
                $message = 'Saved';
            } else {
                $message = 'Error';
            }
            $this->set(compact("message"));
        }
    
        public function delete($id) {
            if ($this->Recipe->delete($id)) {
                $message = 'Deleted';
            } else {
                $message = 'Error';
            }
            $this->set(compact("message"));
        }
    }

Depuis que nous avons ajouté un appel à :php:meth:`Router::parseExtensions()`,
Le router CakePHP est déjà prêt à servir différentes vues sur la base de 
différents types de requêtes. Puisque nous avons affaire à des requêtes REST, 
le type de vue est le XML. Nous plaçons les vues REST pour notre 
RecipesController à l'intérieur de ``app/View/recipes/xml``. Nous pouvons aussi 
utiliser :php:class:`Xml` pour une sortie rapide-et-facile dans ces vues. Voilà 
ce que notre index donnerait::

    // app/View/Recipes/xml/index.ctp
    
    <recipes>
        $xml = Xml::build($recipes);
        echo $xml->saveXML();
        ?>
    </recipes>

Quand on sert un type de contenu spécifique en utilisant parseExtensions(),
CakePHP recherche automatiquement un helper de vue qui correspond au type.
Puisque nous utilisons XML en type de contenu, il n'y a pas de helper intégré,
cependant si vous alliez en créer un, il serait automatiquement charger pour 
notre utilisation dans ces vues.

Le XML rendu va au final ressembler à ceci::

    <posts>
        <post id="234" created="2008-06-13" modified="2008-06-14">
            <author id="23423" first_name="Billy" last_name="Bob"></author>
            <comment id="245" body="This is a comment for this post."></comment>
        </post>
        <post id="3247" created="2008-06-15" modified="2008-06-15">
            <author id="625" first_name="Nate" last_name="Johnson"></author>
            <comment id="654" body="This is a comment for this post."></comment>
        </post>
    </posts>

Créer la logique pour l'action edit est un peu vicieux, mais pas de beaucoup.
Puisque nous fournissons un API qui sort du XML, c'est un chois naturel pour 
recevoir le XML en entrée. Ne vous inquiétez pas, les classes 
:php:class:`RequestHandler` et :php:class:`Router` facilitent beaucoup les 
choses. Si une requête POST ou PUT a un content-type XML,
alors l'entrée est lancée à travers la classe :php:class:`Xml` de Cake, et la 
représentation en tableau des données est assignée à `$this->request->data`.
A cause de cette fonctionnalité, gérer les données en XML et POST en parallèle 
est transparente : aucun changement n'est requis dans le code du controller 
ou du model
Tout ce dont vous avez besoin devrait finir dans ``$this->request->data``.

Accepter une entrée dans d'autres formats
=========================================

Typiquement, les applications REST ne sortent pas seulement le contenu dans 
les formats de données alternatifs, elles accèptent aussi les données dans 
des formats différents. Dans CakePHP, :php:class:`RequestHandlerComponent` 
facilite cela. Par défaut, il va décoder toute entrée de données entrante 
JSON/XML pour les requêtes POST/PUT et fournir la version de tableau de 
cette donnée dans `$this->request->data`. Vous pouvez aussi connecter 
dans les deserializers supplémentaires pour des formats alternatifs si vous 
en avez besoin, utilisez :php:meth:`RequestHandler::addInputType()`

Modifier les routes REST par défaut
===================================

.. versionadded:: 2.1

Si les routes REST par défaut ne fonctionnent pas pour votre application 
application, vous pouvez les modifier en utilisant 
:php:meth:`Router::resourceMap()`. Cette méthode vous permet de définir les 
routes par défaut qui récupèrent l'ensemble avec 
:php:meth:`Router::mapResources()`. Quand vous utilisez cette méthode vous 
devez définir *toutes* les valeurs par défaut que vous voulez utiliser::

    Router::resourceMap(array(
        array('action' => 'index', 'method' => 'GET', 'id' => false),
        array('action' => 'view', 'method' => 'GET', 'id' => true),
        array('action' => 'add', 'method' => 'POST', 'id' => false),
        array('action' => 'edit', 'method' => 'PUT', 'id' => true),
        array('action' => 'delete', 'method' => 'DELETE', 'id' => true),
        array('action' => 'update', 'method' => 'POST', 'id' => true)
    ));

En écrivant par dessus la ressource map par défaut, les appels futurs à 
``mapResources()`` vont utiliser les nouvelles valeurs.

Routing REST Personnalisé
=========================

Si les routes créees par défaut par :php:meth:`Router::mapResources()` ne 
fonctionnent pas pour vous, utilisez la méthode :php:meth:`Router::connect()` 
pour définir un ensemble personnalisé de routes REST. La méthode ``connect()`` 
vous permet de définir un certain nombre d'options différentes pour une URL 
donnée. Le premier paramètre est l'URL elle-même, et le deuxième paramètre 
vous permet de fournir ces options. Le troisième paramètre vous permet de 
spécifier les pattern regex pour aider CakePHP à identifier certains marqueurs 
dans l'URL spécifié.

Nous allons fournir un exemple simple ici, et vous permettre de façonner cette 
route pour vos autres purposes RESTful. Ici c'est ce à quoi notre route REST 
modifié ressemblerait, sans utiliser :php:meth:`Router::mapResources()`::

    Router::connect(
        "/:controller/:id",
        array("action" => "edit", "[method]" => "PUT"),
        array("id" => "[0-9]+")
    );

Des techniques de routing avancées sont couvertes ailleurs, donc nous 
nous focaliserons sur le point le plus important pour nos besoins ici: 
la [méthode] clé deu tableau d'options dans le second paramètre. Une fois 
que la clé a été définie, la route spécifiée fonctionne seulement pour cet
méthode de requête HTTP (qui pourrait aussi être GET, DELETE, etc.)


.. meta::
    :title lang=fr: REST
    :keywords lang=fr: application programmers,default routes,core functionality,result format,mashups,recipe database,request method,easy access,config,soap,recipes,logic,audience,cakephp,running,api
