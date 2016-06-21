Shell ACL
#########

Le Shell Acl est utile pour gérer et inspecter les enregistrements de vos bases
de données Acl. Il est souvent plus pratique que l'ajout de modifications
ponctuelles dans les controllers.

La plupart des sous-commandes shell acl implique le référencement des noeuds
aco/aro. Comme il y a deux 'formes' de ces noeuds, il existe deux notations
dans le shell::

    # Un Model + référence de la clé étrangère
    ./Console/cake acl view aro Model.1

    # Un chemin alias de référence
    ./Console/cake acl view aco root/controllers

Utiliser ``.`` indique que vous allez utiliser une référence d'enregistrement
liée au style, tandis qu'utiliser un ``/`` indique un chemin alias.

Installer les tables de la base de données
==========================================

Avant d'utiliser la base de données ACL, vous aurez besoin de configurer les
tables. Vous pouvez le faire en utilisant::

    ./Console/cake acl initdb

Créer et supprimer les noeuds
=============================

You pouvez utiliser les sous-commandes de création et de suppression pour
créer et supprimer des noeuds::

    ./Console/cake acl create aco controllers Posts
    ./Console/cake acl create aco Posts index

Cette commande crée un enregistrement aco en utilisant un chemin alias.
Vous pouvez aussi faire comme ce qui suit::

    ./Console/cake acl create aro Group.1

Pour créer un noeud aro pour le Groupe dont l'id est = 1.

Accorder et refuser l'accès
===========================

Utilisez la commande d'accès pour accorder les permssions ACL.
Une fois exécutée, l'ARO spécifié (et ses enfants, si il en a) aura un accès
AUTORISÉ à l'action ACO spécifié (et les enfants de l'ACO, si il y en a)::

    ./Console/cake acl grant Group.1 controllers/Posts

La commande ci-dessus accorde tous les privilèges.
Vous pouvez n'accorder que les privilèges de lecture en utilisant la commande
suivante::

    ./Console/cake acl grant Group.1 controllers/Posts read

Refuser une permission fonctionne exactement de la même façon.
La seule différence est le remplacement de 'grant' en 'deny'.

Vérification des permissions
============================

Utilisez cette commande pour accorder les permissions ACL. ::

    ./Console/cake acl check Group.1 controllers/Posts read

La sortie sera soit ``allowed``(succès), soit ``not allowed`` (non autorisé).

Voir l'arbre de noeuds
======================

La commande view permet de voir les arbres des ARO et des ACO.
Le paramètre optionnel 'node' permet de retourner seulement une portion de
l'arbre demandé::

    ./Console/cake acl view


.. meta::
    :title lang=fr: ACL Shell
    :keywords lang=fr: style d'enregistrement,style reférence,acl,tables de la base de données,group id,notations,alias,privilège,noeuds node,privilèges,shell,base de données
