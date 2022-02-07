Composant Security
##################

Le composant Security offre une manière simple d'inclure une sécurité
renforcée à votre application. Une interface pour gérer les requêtes
HTTP-authentifiées peut être créée avec le composant Security. Il est
défini dans le beforeFilter() de vos contrôleurs. Il possède de nombreux
paramètres configurables. Toutes ces propriétés peuvent être définies
directement ou par l'intermédiaire de méthodes *setters* du même nom.

Si une action est restreinte par le composant Security, elle devient un
trou noir, comme une requête invalide qui aboutira à une erreur 404 par
défaut. Vous pouvez configurer ce comportement, en définissant la
propriété $this->Security->blackHoleCallback par une fonction de rappel
(*callback*) dans le contrôleur. Gardez à l'esprit que ces trous noirs,
issus de toutes les méthodes du composant Security, seraient exécutés à
travers cette méthode de rappel.

Quand vous utilisez le composant Security, vous **devez** utiliser
l'assistant Form pour créer vos formulaires. Le composant Security
recherche certains indicateurs qui sont créés et gérés par l'assistant
Form (spécialement ceux créés dans create() et end()).

Configuration
=============

$blackHoleCallback
    Un contrôleur de callback qui gèrera les requêtes envoyées dans le
    "trou noir"
$requirePost
    Liste d'actions de contrôleurs qui exigent que se produise une
    requête POST. Un tableau d'actions de contrôleurs ou '\*' pour
    forcer toutes les actions à exiger un POST.
$requireSecure
    Liste d'actions qui exigent que se produise une connexion SSL. Un
    tableau d'actions de contrôleurs ou '\*' pour forcer toutes les
    actions à exiger une connexion SSL.
$requireAuth
    Liste d'actions qui exigent une clé d'authentification valide. Cette
    clé de validation est définie par le Composant Security.
$requireLogin
    Liste d'actions qui exigent des connexions HTTP Authentifiées (basic
    ou digest). Acceptent aussi '\*' pour indiquer que toutes les
    actions de ce contrôleur exigent une authentification HTTP.
$loginOptions
    Les options pour les requêtes de connexion HTTP authentifiée. Vous
    permet de définir le type d'authentification et le contrôleur de
    callback pour le processus d'authentification.
$loginUsers
    Un tableau associatif de noms\_utilisateurs => mots\_de\_passe qui
    est utilisé pour les connexions HTTP authentifiées. Si vous utilisez
    l'authentification digest, votre mot de passe devra être de hashage
    MD5
$allowedControllers
    Une liste de contrôleurs à partir desquelles les actions du
    contrôleur courant sont autorisées à recevoir des requêtes. Ceci
    peut être utilisé pour contrôler les demandes croisées de
    contrôleur.
$allowedActions
    Les actions parmi celles du contrôleur courant qui sont autorisées à
    recevoir des requêtes. Ceci peut être utilisé pour contrôler les
    demandes croisées de contrôleur.
$disabledFields
    Liste des champs de formulaire qui devraient être ignorés lors de la
    validation du POST. La valeur, présence ou absence de ces champs de
    formulaire, ne sera pas prise en compte lors de la vérification de
    la validité de soumission du formulaire. Spécifiez les champs comme
    vous le faites pour l'assistant Form (Model.nomduchamp).

Méthodes
========

requirePost()
-------------

Définit les actions qui nécessitent une requête POST. Prend un nombre
indéfini de paramètres. Peut être appelé sans arguments, pour forcer
toutes les actions à requérir un POST.

requireSecure()
---------------

Définit les actions qui nécessitent une requête sécurisée avec SSL.
Prend un nombre indéfini de paramètres. Peut être appelé sans arguments
pour forcer toutes les actions à requérir une connexion sécurisée par
SSL.

requireAuth()
-------------

Définit les actions qui nécessitent un jeton valide généré par le
Composant Security. Prend un nombre indéfini de paramètres. Peut être
appelé sans arguments pour forcer toutes les actions à requérir une
authentification valide.

requireLogin()
--------------

Définit les actions qui nécessitent une requête HTTP-Authentifiées
valide. Prend un nombre indéfini de paramètres. Peut être appelé sans
arguments pour forcer toutes les actions à requérir une authentification
HTTP.

loginCredentials(string $type)
------------------------------

Tente de valider les caractéristiques du login pour une requête
HTTP-authentifiée. $type est le type d'authentification HTTP que vous
voulez vérifier. Soit 'basic', soit 'digest'. Si laissé null/vide, les
deux seront essayés. Retourne un tableau avec le nom et le mot de passe
en cas de succès.

loginRequest(array $options)
----------------------------

Génère le texte pour l'en-tête d'une requête HTTP-Authentifiée, d'après
un tableau $options.

$options contient généralement un 'type', un 'realm' (domaine). Le type
indique quelle méthode HTTP-Authentifiée utiliser. Le domaine par défaut
est lié à l'environnement actuel du serveur HTTP.

parseDigestAuthData(string $digest)
-----------------------------------

Analyse une requête d'authentification HTTP digest. Retourne un tableau
associatif de données digest en cas de succès et null en cas d'échec.

generateDigestResponseHash(array $data)
---------------------------------------

Crée un hash à comparer avec une réponse HTTP-authentifiée digest. $data
devrait être un tableau créé par
SecurityComponent::parseDigestAuthData().

blackHole(object $controller, string $error)
--------------------------------------------

Met en "trou noir" (*black-hole*) une requête invalide, avec une erreur
404 ou un callback personnalisé. Sans callback, la requête sera
abandonnée. Si un callback de contrôleur est défini pour
SecurityComponent::blackHoleCallback, il sera appelé et passera toute
information sur l'erreur.

Utilisation
===========

Utilisé le componsant Security est généralement fait dans la méthode
beforeFilter() de votre contrôleur. Vous pouvez spécifier les
restrictions de sécurité que vous voulez et le composant Security les
forcera au démarrage

::

    <?php
    class WidgetController extends AppController {

        var $components = array('Security');

        function beforeFilter() {
            $this->Security->requirePost('delete');
        }
    }
    ?>

Dans cette exemple, l'action delete peut être effectuée avec succès si
celui ci reçoit une requête POST

::

    <?php
    class WidgetController extends AppController {

        var $components = array('Security');

        function beforeFilter() {
            if(isset($this->params[Configure::read('Routing.admin')])){
                $this->Security->requireSecure();
            }
        }
    }
    ?>

Cette exemple forcera toutes les actions qui proviennent de la "route"
Admin à être effectuées via des requêtes sécurisées SSL.

Authentification HTTP Basic
===========================

Le composant Security a quelques fonctions d'authentifications très
puissantes. Parfois, vous pouvez avoir besoin de protéger quelques
fonctionnalités de votre application, en utilisant une `authentification
HTTP Basic <https://fr.wikipedia.org/wiki/HTTP_Authentification>`_. L'un
des usages courant de l'authentification HTTP est la protection d'une
API REST ou SOAP.

Ce type d'authentification est appelée basic pour une raison simple. A
moins que vous ne transfériez les informations par SSL, les identifiants
seront transférés en texte brut.

Utiliser le composant Security pour les authentifications HTTP est
facile. L'exemple suivant inclue le composant Security et quelques
lignes de code dans la méthode beforeFilter() du contrôleur.

::

    class ApiController extends AppController {
        var $name = 'Api';
        var $uses = array();
        var $components = array('Security');

        function beforeFilter() {
            $this->Security->loginOptions = array(
                'type'=>'basic',
                'realm'=>'MonDomaine'
            );
            $this->Security->loginUsers = array(
                'john'=>'mot_passe_john',
                'jane'=>'mot_passe_jane'
            );
            $this->Security->requireLogin();
        }
        
        function index() {
            // Logique protégée de l'application ici...
        }
    }

La propriété loginOptions du composant Security est un tableau
associatif qui spécifie comment le login devrait être manipulé. Vous
avez uniquement besoin de spécifier le **type** comme **basic**, pour
que cela fonctionne. Spécifier le **realm** (domaine) si vous voulez
afficher un joli message à quiconque essaiera de s'identifier ou si vous
avez plusieurs sections avec authentification dans votre application (=
*realms*) que vous voulez garder séparées.

La propriété loginUsers du composant Security est un tableau associatif
contenant les utilisateurs qui peuvent accéder à ce domaine et leurs
mots de passe. Les exemples montrés ici utilisent des informations
client codées en dur, mais vous voudrez certainement utiliser un modèle
pour rendre vos identifiants d'authentification plus manageables.

Enfin, requireLogin() indique au composant Security que ce contrôleur
nécessite une identification. Comme avec requirePost(), ci-dessus,
fournir des noms aux méthodes protègera celles-ci tout en laissant les
autres accessibles.
