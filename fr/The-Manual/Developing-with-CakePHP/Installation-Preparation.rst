Préparation à l'installation
############################

CakePHP est rapide et facile à installer. Les éléments minimum requis
sont un serveur web et une copie de Cake, c'est tout ! Bien que ce
manuel se concentre essentiellement sur une configuration avec Apache
(parce que c'est le plus répandu), vous pouvez configurer Cake pour
qu'il fonctionne avec une grande variété de serveurs web, tels
LightHTTPD ou Microsoft IIS.

La préparation de l'installation est constituée des étapes suivantes :

-  Télécharger une copie de CakePHP
-  Configurer, si besoin, votre serveur web pour utiliser PHP
-  Vérifier les permissions de fichier

Obtenir CakePHP
===============

Il y a deux méthodes principales pour récupérer une copie récente de
CakePHP. Vous pouvez soit télécharger une archive (zip/tar.gz/tar.bz2)
depuis le site web principal, soit faire une extraction depuis le dépôt
GIT.

Pour obtenir la dernière version majeure de CakePHP, visitez le site web
principal `https://cakephp.org <https://cakephp.org>`_ et suivez
le lien "Download Now".

Toutes les versions courantes de CakePHP sont hébergées sur CakeForge,
la "résidence" de CakePHP. Ce site contient aussi des liens vers de
nombreux autres projets CakePHP, y compris les plugins et applications.
Les versions de CakePHP sont disponibles sur
`https://github.com/cakephp/cakephp/downloads <https://github.com/cakephp/cakephp/downloads>`_.

Sinon des constructions nocturnes (*nightly builds*) sont produites,
lesquelles incluent les corrections de bug et les améliorations de
chaque minute (enfin... de chaque jour). Celles-ci sont accessibles
depuis le sommaire de téléchargement ici :
`https://cakephp.org/downloads/index/nightly <https://cakephp.org/downloads/index/nightly>`_.
Pour cibler les mises à jour de dernière minute, vous pouvez faire une
extraction directement depuis la branche de développement du dépôt GIT
ici :
`https://github.com/cakephp/cakephp <https://github.com/cakephp/cakephp>`_

Droits fichiers
===============

CakePHP utilise le répertoire "/app/tmp" pour un certain nombre
d'opérations différentes. Descriptions de modèle, cache de vues et
information de session en sont quelques exemples.

Aussi, assurez-vous que ce répertoire soit bien éditable par le serveur
web de votre installation Cake.
