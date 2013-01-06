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

Session

Le composant Session fournit un gestionnaire de stockage indépendant
pour les sessions PHP.

RequestHandler

Le RequestHandler vous permet d'analyser plus finement les requêtes de
vos visiteurs et de renseigner votre application sur les types de
contenus et les informations demandés.

Security

Le composant Security vous permer de définir une sécurité renforcé,
d'utiliser et de managee l'authentification HTTP.

Email

Une interface qui peut être utilisée pour envoyer des emails grâce à
l'un des nombreux agents de transfert de mail existant, y compris la
fonction mail() de php et le smtp.

Cookie

Le composant Cookie se comporte d'une façon similaire au composant
Session, dans le sens où il fournit une encapsulation pour le support
natif des cookies en PHP.

Pour en savoir plus à propos de chaque composant, voyez le menu sur la
gauche ou apprenez comment `créer vos propres
composants </fr/view/62/composants>`_.


.. toctree::
    :maxdepth: 1

    Core-Components/Access-Control-Lists
    Core-Components/Authentication
    Core-Components/Cookies
    Core-Components/Email
    Core-Components/Request-Handling
    Core-Components/Security-Component
    Core-Components/Sessions