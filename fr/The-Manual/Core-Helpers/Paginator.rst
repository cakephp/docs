Pagination
##########

L'assistant de pagination (*PaginatorHelper*) est utilisé pour contrôler
les outils de pagination comme le nombre de page ainsi que les liens
précédent/suivant.

Voir aussi `Tâches courantes avec cakePHP -
Pagination </fr/view/164/pagination>`_ pour plus d'informations.

Méthodes
========

options($options = array())

-  mixed options() Options par défaut pour les liens de pagination. Si
   une chaîne est passée, elle est utilisée comme l'id DOM de l'élément
   à mettre à jour. Voir #options pour la liste des clés.

options() définit toutes les options pour l'assistant Paginator. Les
options supportées sont :

**format**

Format du compteur. Les formats supportés sont 'range' et 'pages' et
custom qui est celui par défaut. Dans le mode par défaut, la chaîne
fournie est parsée et les masques sont remplacés par les valeurs
courantes. Les masques disponibles sont :

-  %page% - la page courante affichée.
-  %pages% - le nombre total de pages.
-  %current% - le nombre courant d'enregistrements à être présentés .
-  %count% - le nombre total d'enregistrements dans le jeu de résultat.
-  %start% - le numéro du premier enregistrement à être affiché.
-  %end% - le numéro du dernier enregistrement à être affiché.

Maintenant que vous connaissez les masques disponibles, vous pouvez
utiliser la méthode counter() pour afficher toutes sortes d'informations
à propos des résultats retournés, par exemple :

::


    echo $paginator->counter(array(
            'format' => 'Page %page% sur %pages%, 
                         montrant %current% enregistrements sur un total de %count%, 
                         débutant à l'enregistrement %start%, finissant au %end%'
    )); 

**separator**

Le séparateur entre la page actuelle et le nombre de pages. Par défaut,
c'est ' of '. Ceci est utilisé conjointement avec format = 'pages'

**url**

L'url de l'action qui effectue la pagination. url a aussi quelques sous
options

-  sort - la clé par laquelle les enregistrements sont triés
-  direction - le sens du tri. Par défaut 'ASC'
-  page - le numéro de la page à afficher

**model**

Le nom du modèle à être paginé.

**escape**

Détermine si le champ titre pour les liens doit être HTML échappé. Vaut
true par défaut.

**update**

L'id DOM de l'élément à mettre à jour avec les résultats des appels de
pagination AJAX. Si non spécifié, des liens ordinaires seront créés.

**indicator**

Id DOM de l'élément qui sera présenté comme indicateur de chargement ou
de travail durant l'exécution des requêtes AJAX.

link($title, $url = array(), $options = array())

-  string $title - Titre du lien.
-  mixed $url Url de l'action. Voir Router::url()
-  array $options Options du lien. Voir options() pour la liste des
   clés.

Crée un lien ordinaire ou AJAX avec des paramètres de pagination

::

    echo $paginator->link('Trier par titre à la page 5', 
            array('sort' => 'titre', 'page' => 5, 'direction' => 'desc'));

Si créé dans la vue correspondant à ``/posts/index``, devrait créer un
lien pointant à '/posts/index/page:5/sort:titre/direction:desc'
