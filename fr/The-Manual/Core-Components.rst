Composants intégrés
###################

CakePHP contient un certain nombre de composants intégrés. Ils
fournissent des fonctionnalités toutes prêtes pour de nombreuses tâches
couramment utilisées.

Acl

Le composant Acl fournit une interface facile à utiliser pour les listes
de contrôles d'accès basées sur une base de données ou un fichier ini.

Auth

Le composant Auth fournit un système d'authentification facile à
utiliser, à travers une grande variété de processus d'authentification,
comme les *callbacks* de contrôleur, l'Acl ou les *callbacks* du modèle
Object.

Cookie

Le composant Cookie se comporte d'une façon similaire au composant
Session, dans le sens où il fournit une encapsulation pour le support
natif des cookies en PHP.

Email

Une interface qui peut être utilisée pour envoyer des emails grâce à
l'un des nombreux agents de transfert de mail existant, y compris la
fonction mail() de php et le smtp.

RequestHandler

Le RequestHandler vous permet d'analyser plus finement les requêtes de
vos visiteurs et de renseigner votre application sur les types de
contenus et les informations demandés.

Security

Le composant Security vous permer de définir une sécurité renforcé,
d'utiliser et de managee l'authentification HTTP.

Session

Le composant Session fournit un gestionnaire de stockage indépendant
pour les sessions PHP.

Pour en savoir plus à propos de chaque composant, voyez le menu sur la
gauche ou apprenez comment `créer vos propres
composants </fr/view/62/composants>`_.

Tous les composants du cœur peuvent maintenant être configuré dans le
tableau ``$components`` d'un contrôleur.

::

    <?php
    class AppController extends Controller {

        var $components = array(
            'Auth' => array(
                'loginAction' => array('controller' => 'users', 'action' => 'inscription'),
                'fields' => array('username' => 'email', 'password' => 'mot_de_passe'),
            ),
            'Security',
            'Email' => array(
                'from' => 'webmaster@domaine.com',
                'sendAs' => 'html',
            ),
        );
    }
    ?>

Vous pouvez surcharger les paramètres dans le ``beforeFilter()`` du
contrôleur.

::

    <?php
    class MembresController extends AppController {

        function beforeFilter() {
            $this->Email->from = 'support@domaine.com';
        }
    }
    ?>



.. toctree::
    :maxdepth: 1

    Core-Components/Access-Control-Lists
    Core-Components/Authentication
    Core-Components/Cookies
    Core-Components/Email
    Core-Components/Request-Handling
    Core-Components/Security-Component
    Core-Components/Sessions