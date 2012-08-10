Structure de CakePHP
####################

CakePHP dispose de classes de Contrôleurs, de Modèles, et de Vues, mais il 
dispose de classes et objets supplémentaires qui rendent le développement 
en MVC plus rapide et amusant. 
Les Composants (Components), Comportements (Behaviors) et Assistants (Helpers) 
sont des classes qui offrent une extensibilité et une réutilisation, 
permettant d'ajouter rapidement des fonctionnalités aux classes MVC 
de base de vos applications. A ce stade de lecture, nous survolerons ces 
concepts, mais vous pourrez découvrir comment utiliser ces outils en 
détails plus tard.

Extensions de l'Application
===========================

Contrôleurs, Helpers et Modèles ont chacun une classe parente, que vous 
pouvez utiliser pour définir des modifications impactant toute l'application. 
AppController (disponible dans ``/app/Controller/AppController.php``), 
AppHelper (disponible dans ``/app/View/Helper/AppHelper.php``) et 
AppModel (disponible dans ``/app/Model/AppModel.php``) sont de bons choix 
pour écrire les méthodes que vous souhaitez partager entre tous vos 
contrôleurs, helpers ou modèles.

Bien qu'elles ne soient pas une classe ou un fichier, les Routes jouent un 
rôle important dans les requêtes faites à CakePHP. La définition des routes 
indique à CakePHP comment lier les URLs aux actions des contrôleurs. Le 
comportement par défaut suppose que l'URL ``/controller/action/var1/var2`` est 
liée au Controller::action($var1, $var2) et à son action "action" qui prend deux 
paramètres ($var1, $var2). Mais vous pouvez utiliser les routes pour 
personnaliser les URLs et la manière dont elles sont interprétées par votre 
application.

Il peut être judicieux de regrouper certaines fonctionnalités. Un Greffon 
ou Plugin est un ensemble de modèles, de contrôleurs et de vues qui 
accomplissent une tâche spécifique pouvant s'étendre à plusieurs applications. 
Un système de gestion des utilisateurs ou un blog simplifié pourraient être de 
bons exemples de "plugins" CakePHP.

Extensions du Controller ("Components")
=======================================

Un Composant (Component) est une classe qui s'intègre dans la logique du 
contrôleur. Si vos contrôleurs ou vos applications doivent partager une 
logique, alors créer un Composant est une bonne solution. A titre d'exemple, 
la classe intégrée EmailComponent rend triviale la création et l'envoi de 
courriels. Plutôt que d'écrire une méthode dans un seul contrôleur qui effectue 
ce traitement, vous pouvez empaqueter ce code et ainsi le partager.

Les contrôleurs sont également équipés de fonctions de rappel (callbacks). 
Ces fonctions sont à votre disposition au cas où vous avez besoin d'ajouter 
du code entre les différentes opérations internes de CakePHP. Les callbacks 
disponibles sont :

-  ``beforeFilter()``, exécutée avant toute action d'un contrôleur
-  ``beforeRender()``, exécuté après le traitement du contrôleur, mais avant 
    l'affichage de la vue
-  ``afterFilter()``, exécuté après la logique du contrôleur, y compris 
    l'affichage de la vue. Il peut n'y avoir aucune différence entre 
    ``beforeRender()`` et ``afterFilter()``, à moins que vous n'ayez effectué 
    un appel manuel à ``render()`` dans les actions de votre contrôleur et 
    que vous ayez inclus du code après cet appel.

Extensions du Modèle ("Behaviors")
==================================

De même, les Comportements ou Behaviors fonctionnent comme des passerelles pour 
ajouter une fonctionnalité commune aux modèles. Par exemple, si vous stockez 
les données d'un utilisateur dans une structure en arbre, vous pouvez spécifier 
que votre modèle Utilisateur se comporte comme un arbre, et il acquèrera 
automatiquement la capacité de suppression, d'ajout, et de déplacement des 
noeuds dans votre structure en arbre sous-jacente.

Les modèles sont aussi soutenus par une autre classe nommée une DataSource 
(source de données). Il s'agit d'une couche d'abstraction qui permet aux 
modèles de manipuler différents types de données de manière consistante. La 
plupart du temps la source principale de données dans CakePHP est une base 
de données, vous pouvez cependant écrire des DataSources additionnelles pour 
représenter des flux RSS, des fichiers CSV, des entrées LDAP ou des évènements 
iCal. Les DataSources vous permettent d'associer des enregistrements issus de 
sources différentes : plutôt que d'être limité à des jointures SQL, les 
DataSources vous permettent de dire à votre modèle LDAP qu'il est associé à 
plusieurs événements iCal.

Tout comme les contrôleurs, les modèles sont également caractérisés par des 
fonctions de rappel (callbacks) :

-  beforeFind()
-  afterFind()
-  beforeValidate()
-  beforeSave()
-  afterSave()
-  beforeDelete()
-  afterDelete()

Les noms de ces méthodes devraient être suffisamment explicites pour que 
vous compreniez leurs rôles. Vous obtiendrez plus de détails dans le chapître 
sur les modèles.

Extension de la Vue ("Helpers")
===============================

Un Helper ou assistant est une classe d'assistance pour les vues. De même 
que les composants sont utilisés par plusieurs contrôleurs, les assistants 
permettent à différentes vues d'accéder et de partager une même logique de 
présentation. L'un des assistants intégrés à Cake, AjaxHelper, facilite les 
requêtes Ajax dans les vues.

La plupart des applications ont des portions de code pour les vues qui sont 
répétitives. CakePHP facilite la réutilisabilité de ce code grâce aux Layouts 
(mises en pages) et aux Elements. Par défaut, toutes les vues affichées par 
un contrôleur ont le même layout. Les elements sont utilisés lorsque de petites 
portions de contenu doivent apparaître dans plusieurs vues.


.. meta::
    :title lang=fr: Structure de CakePHP
    :keywords lang=fr: gestion d'utilisateurs system,actions du contrôleur,application extensions,défaut behavior,maps,logique,snap,définitions,aids,modèles,route map,blog,plugins,fit