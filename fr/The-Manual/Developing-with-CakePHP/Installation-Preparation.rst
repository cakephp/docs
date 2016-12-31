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
sur le site web principal, soit extraire le code depuis le dépôt GIT.

Pour obtenir la dernière version majeure de CakePHP, visitez le site web
principal `https://cakephp.org <https://cakephp.org>`_ et suivez
le lien "Download Now".

Toutes les versions courantes de CakePHP sont hébergées sur
`Github <https://github.com/cakephp>`_. Github héberge à la fois CakePHP
lui-même, ainsi que plusieurs autres plugins pour CakePHP. Les versions
de CakePHP sont disponibles sur `la section téléchargements de
Github <https://github.com/cakephp/cakephp1x/downloads>`_.

Sinon vous pouvez récupérer le code encore tout chaud, avec toutes les
corrections de bug et les améliorations de chaque minute (enfin, de
chaque jour). Celles-ci sont accessibles sur Github en clonant le
repository.

Droits fichiers
===============

CakePHP utilise le répertoire "/app/tmp" pour un certain nombre
d'opérations différentes. Descriptions de modèle, cache de vues et
information de session en sont quelques exemples.

Aussi, assurez-vous que ce répertoire soit bien éditable par le serveur
web de votre installation Cake.
