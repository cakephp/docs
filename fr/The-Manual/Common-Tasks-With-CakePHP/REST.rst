REST
####

De nombreux programmeurs commencent à se rendre compte de la nécessité
de donner accès au coeur de leur application à un public plus large.
Fournir un accès direct et aisé au coeur de votre API peut aider votre
plateforme à être acceptée, permet la création d'applications composites
(*mashups*) et une intégration simple avec d'autres systèmes.

Bien que d'autres solutions existent, REST est une bonne manière de
fournir un accès facile à la logique que vous avez créée dans votre
application. C'est simple, généralement basé sur du XML (nous parlons de
XML simple, rien de comparable à une enveloppe SOAP), et repose sur les
entêtes HTTP pour la définition des actions à effectuer. Exposer une API
via REST avec CakePHP est simple.

Mise en place simple
====================

Le moyen le plus rapide pour démarrer avec REST est d'ajouter quelques
lignes à votre fichier routes.php, situé dans app/config. L'objet
Routeur (*Router*) comporte une méthode appelée mapResources() utilisée
pour mettre en place un certain nombre de routes par défaut accédant par
REST à vos contrôleurs. Si nous souhaitions permettre l'accès par REST à
une base de données de recettes, nous ferions comme cela :

::

    //Dans app/config/routes.php...

    Router::mapResources('recettes');
    Router::parseExtensions();

La première ligne met en place un certain nombre de routes par défaut
pour un accès facile par REST. Ces routes correspondent aux méthodes de
requêtes HTTP.

+----------------+-----------------+-----------------------------------+
| Méthode HTTP   | URL             | Action de contrôleur appelée      |
+================+=================+===================================+
| GET            | /recettes       | RecettesController::index()       |
+----------------+-----------------+-----------------------------------+
| GET            | /recettes/123   | RecettesController::view(123)     |
+----------------+-----------------+-----------------------------------+
| POST           | /recettes       | RecettesController::add()         |
+----------------+-----------------+-----------------------------------+
| PUT            | /recettes/123   | RecettesController::edit(123)     |
+----------------+-----------------+-----------------------------------+
| DELETE         | /recettes/123   | RecettesController::delete(123)   |
+----------------+-----------------+-----------------------------------+
| POST           | /recettes/123   | RecettesController::edit(123)     |
+----------------+-----------------+-----------------------------------+

La classe Routeur (*Router*) de CakePHP utilise un certain nombre
d'indicateurs différents pour détecter la méthode HTTP utilisée. Les
voici par ordre de préférence :

#. La variable POST *\_method*
#. Le X\_HTTP\_METHOD\_OVERRIDE
#. L'entête REQUEST\_METHOD

La méthode POST *\_method* est utile lors de l'utilisation d'un
navigateur en tant que client REST (ou n'importe quoi d'autre capable de
faire facilement du POST). Il suffit d'initialiser la valeur de
*\_method* au nom de la méthode de requête HTTP que vous souhaitez
émuler.

Une fois que le routeur est paramétré pour faire correspondre les
requêtes REST à certaines actions de contrôleur, nous pouvons nous
mettre à créer la logique dans nos actions de contrôleur. Un contrôleur
basique pourrait ressembler à ceci :

::

    // controllers/recettes_controller.php

    class RecettesController extends AppController {

        var $components = array('RequestHandler');

        function index() {
            $recettes = $this->Recette->find('all');
            $this->set(compact('recettes'));
        }

        function view($id) {
            $recette = $this->Recette->findById($id);
            $this->set(compact('recette'));
        }

        function edit($id) {
            $this->Recette->id = $id;
            if ($this->Recette->save($this->data)) {
                $message = 'Sauvegardé';
            } else {
                $message = 'Erreur';
            }
            $this->set(compact("message"));
        }

        function delete($id) {
            if($this->Recette->del($id)) {
                $message = 'Supprimé';
            } else {
                $message = 'Erreur';
            }
            $this->set(compact("message"));
        }
    }

Comme nous avons ajouté un appel à Router::parseExtensions(), le routeur
de CakePHP est déjà prêt à servir différentes vues selon différents
types de requêtes. Comme nous avons affaire à des requêtes REST, le type
de la vue est du XML. Nous plaçons les vues REST pour notre
RecettesController dans app/views/xml. Nous pouvons également utiliser
le XMLHelper pour faciliter l'affichage du XML dans ces vues. Voici ce à
quoi pourrait ressembler notre vue d'index :

::

    // app/views/recettes/xml/index.ctp

    <recettes>
        <?php echo $xml->serialize($recettes); ?>
    </recettes>

Les utilisateurs expérimentés de CakePHP auront peut-être remarqué que
nous n'avons pas inclus le XMLHelper dans le tableau $helpers de notre
RecettesController. C'est fait exprès — lorsque nous servons un type de
contenu spécifique grâce à parseExtensions(), CakePHP recherche
automatiquement un Assistant (*Helper*) correspondant au type. Comme
nous utilisons XML comme type de contenu, le XMLHelper est
automatiquement chargé pour être utilisé dans ces vues.

Le XML généré ressemblera à quelque chose comme ceci :

::

    <articles>
        <article id="234" created="2008-06-13" modified="2008-06-14">
            <auteur id="23423" first_name="Billy" last_name="Bob"></author>
            <commentaire id="245" body="Un commentaire pour cet article."></comment>
        </article>
        <article id="3247" created="2008-06-15" modified="2008-06-15">
            <auteur id="625" first_name="Nate" last_name="Johnson"></author>
            <commentaire id="654" body="Un commentaire pour cet article."></comment>
        </article>
    </articles>

Créer la logique pour l'action *edit* est un plus complexe, mais de peu.
Comme vous fournissez une API renvoyant du XML, c'est un choix naturel
que de choisir du XML comme format d'entrée. Pas d'inquiétude cependant
: les classes RequestHandler et Router facilitent grandement les choses.
Si une requête POST ou PUT a un type de contenu XML, alors les données
d'entrée sont passées à une instance de l'objet XML de Cake qui est
assigné à la propriété $data du contrôleur. Grâce à cette
fonctionnalité, manipuler des données XML et POST en parallèle est
transparent : aucun changement n'est nécessaire dans le code du
contrôleur ou du modèle. Tout ce dont vous avez besoin devrait être
retrouvé dans $this->data.

Routage REST personnalisé
=========================

Si les routes par défaut créées par mapResources() ne vous conviennent
pas, utilisez la méthode Router::connect() pour définir un ensemble
personnalisé de routes REST. La méthode connect() vous permet de définir
un certain nombre d'options pour une URL donnée. Le premier paramètre
est l'URL elle-même, le deuxième vous permet de fournir ces options. Le
troisième paramètre vous permet de spécifier des motifs (*patterns*)
d'expressions régulières pour aider CakePHP à identifier certains
marqueurs dans l'URL spécifiée.

Nous allons fournir ici un exemple simple et vous permettre d'adpter
cette route pour vos autres actions *RESTful*. Voici ce à quoi
ressemblerait notre route REST *edit*, sans utiliser mapResources() :

::

    Router::connect(
        "/:controller/:id",
        array("action" => "edit", "[method]" => "PUT"),
        array("id" => "[0-9+]")
    )

Les techniques avancées de routage sont décrites ailleurs, nous allons
donc nous concentrer sur le point le plus important pour notre but ici :
la clé *method* du tableau options dans le deuxième paramètre. Une fois
cette clé affectée, la route spécifiée fonctionne uniquement pour cette
méthode de requête HTTP (qui pourrait également être GET, DELETE, etc).
