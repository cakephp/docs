Assistants
##########

Les Assistants (*Helpers*) sont des classes comme les composants, pour
la couche de présentation de votre application. Ils contiennent la
logique de présentation qui est partagée entre plusieurs vues, éléments
ou layouts. Ce chapitre vous montrera comment créer vos propres
assistants et soulignera les tâches basiques que les assistants du cœur
de CakePHP peuvent vous aider à accomplir. Pour plus d'information sur
les *helpers*, lisez `Assistants intégrés`.

Utiliser les Assistants
=======================

Vous utilisez les assistants (*helpers*) dans CakePHP, en faisant
"prendre conscience" à un contrôleur qu'ils existent. Chaque contrôleur
a une propriété $helpers, qui liste les assistants disponibles dans la
vue. Pour activer un assistant dans votre vue, ajoutez son nom au
tableau $helpers du contrôleur.

::

    <?php
    class BoulangeriesController extends AppController {
        var $helpers = array('Form', 'Html', 'Javascript', 'Time');
    }
    ?>

Vous pouvez aussi ajoutez les assistants depuis une action, dans ce cas,
ils seront uniquement accessibles pour cette action et aucune autre dans
le contrôleur. Ceci économise de la puissance de calcul pour les autres
actions qui n'utilisent pas l'assistant, tout en permettant de conserver
le contrôleur mieux organisé.

::

    <?php
    class BoulangeriesController extends AppController {
        function cuire {
            $this->helpers[] = 'Time';
        }
        function melange {
            // L'assistant Time n'est pas chargé ici et par conséquent non disponible
        }
    }
    ?>

Si vous avez besoin d'activer un assistant pour tous les contrôleurs,
ajoutez son nom dans le tableau ``$helpers`` du fichier
*/app/app\_controller.php* (à créer si pas présent). Souvenez-vous
d'inclure les assistants par défaut Html et Form.

::

        
    <?php     
    class AppController extends Controller {     
        var $helpers = array('Form', 'Html', 'Javascript', 'Time');
    }
    ?>

Créer des Assistants
====================

Si un assistant du cœur (ou l'un de ceux présentés sur Cakeforge ou dans
la Boulangerie) ne répond pas à vos attentes, il est facile de créer des
assistants.

Mettons que nous voulions créer un assistant, qui pourrait être utilisé
pour produire un lien CSS, façonné spécialement selon vos besoins, à
différents endroits de votre application. Afin de trouver une place à
votre logique dans la structure d'assistant existante dans CakePHP, vous
devrez créer une nouvelle classe dans /app/views/helpers. Appelons notre
assistant LienHelper. Le fichier de la classe PHP devrait ressembler à
quelque chose comme ceci :

::

    <?php
    /* /app/views/helpers/lien.php */

    class LienHelper extends AppHelper {
        function lancerEdition($titre, $url) {
            // La logique pour créer le lien spécialement formaté se place ici...
        }
    }

    ?>

Il y a quelques méthodes incluent dans la classe Helper de CakePHP, dont
vous pourriez tirer avantage :

``output(string $string)``

Utilisez cette fonction pour transmettre toutes données à votre vue.

::

    <?php
    function lancerEdition($titre, $url) {
        // Utilisez la fonction output de la classe Helper
        // pour transmettre des données formatées à votre vue :
        return $this->output(
            "<div class=\"contourEdition\">
             <a href=\"$url\" class=\"editer\">$titre</a>
             </div>"
        );
    }
    ?>

Inclure d'autres Assistants
---------------------------

Vous souhaitez peut-être utiliser quelques fonctionnalités déjà
existantes dans un autre assistant. Pour faire cela, vous pouvez
spécifier les assistants que vous souhaitez utiliser avec un tableau
$helpers, formaté comme vous le feriez dans un contrôleur.

::

    <?php
    /* /app/views/helpers/lien.php (utilisant d'autres assistants) */
    class LienHelper extends AppHelper {
        var $helpers = array('Html');

        function lancerEdition($titre, $url) {
            // Utilisez l'assistant HTML pour transmettre
            // les données formatées :

            $lien = $this->Html->link($titre, $url, array('class' => 'editer'));

            return $this->output("<div class=\"contourEdition\">$lien</div>");
        }
    }
    ?>

Méthode de Rappel (callback)
----------------------------

Les Assistants présentent un *callback* utilisé par la classe contrôleur
parente.

``beforeRender()``

La méthode beforeRender est appelée après la méthode beforeRender du
contrôleur, mais avant le rendu des vues et du gabarit.

Utiliser votre Assistant
------------------------

Une fois que vous avez créé votre assistant et que vous l'avez placé
dans /app/views/helpers/, vous serez en mesure de l'inclure dans vos
contrôleurs, en utilisant la variable spéciale $helpers.

Une fois que votre contrôleur a été informé de cette nouvelle classe,
vous pouvez l'utiliser dans vos vues, en accédant à une variable nommée
d'après le nom de l'assistant :

::

    <!-- créer un lien en utilisant le nouvel assistant -->
    <?php echo $lien->lancerEdition('Changer cette Recette', '/recettes/editer/5') ?>

Les helpers Html, Form et Session (si les sessions sont activées) sont
toujours accessibles.

Créer des Fonctionnalités pour Tous les Assistants
==================================================

Tous les assistants étendent une classe spéciale, AppHelper (tout comme
les modèles étendent AppModel et les contrôleurs étendent
AppController). Pour créer une fonctionnalité qui devrait être
disponible pour tous les assistants, créez /app/app\_helper.php.

::

    <?php
    class AppHelper extends Helper {
        function methodePerso () {
        }
    }
    ?>

Assistants intégrés
===================

CakePHP fournit bon nombre d'assistants (*helpers*) qui vous aideront
dans la création de vues. Ils vous assistent à la création de marquage
bien formaté (dont les formulaires), vous aident à formater du texte,
des heures et des nombres, et peuvent même accélérer les fonctionnalités
Ajax. Voici un résumé de assistants livrés de base. Pour plus
d'informations, rendez-vous sur `Assistants intégrés`.

+------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Assistant CakePHP                                    | Description                                                                                                                                                                                                                           |
+======================================================+=======================================================================================================================================================================================================================================+
| `Ajax <https://book.cakephp.org/fr/view/208/AJAX>`_   | Utilisé en tandem avec la librairie javascript Prototype pour créer des fonctionnalités Ajax dans les vues. Il contient des méthodes de raccourci pour le drag&drop, les formulaires et liens Ajax, les observateurs, et bien plus.   |
+------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Cache </fr/view/213/Cache>`_                        | Utilisé par le cœur pour mettre en cache le contenu des vues.                                                                                                                                                                         |
+------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Form </fr/view/182/Form>`_                          | Crée des formulaires HTML et des éléments de formulaire qui se remplissent automatiquement avec les bonnes valeurs et qui gèrent les problèmes de validation.                                                                         |
+------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Html </fr/view/205/HTML>`_                          | Des méthodes pratiques pour mettre en œuvre un marquage bien formé. Des images, liens, tableaux, balises d'en-tête et plus encore.                                                                                                    |
+------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Javascript </fr/view/207/Javascript>`_              | Utilisé pour échapper des valeurs utilisées dans des scripts Javascripts, écrire des données en objets JSON, et formater des blocs de code.                                                                                           |
+------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Number </fr/view/215/Number>`_                      | Formatage de nombres et monnaies.                                                                                                                                                                                                     |
+------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Paginator </fr/view/496/Paginator>`_                | Pagination et tri des données de modèles.                                                                                                                                                                                             |
+------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Rss </fr/view/494/RSS>`_                            | Des méthodes pratiques pour produire des données XML de flux RSS.                                                                                                                                                                     |
+------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Session </fr/view/484/Session>`_                    | Accès pour l'écriture en session de valeurs depuis les vues.                                                                                                                                                                          |
+------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Text </fr/view/216/Text>`_                          | Liens élégants, surbrillance, troncature de mot judicieuse.                                                                                                                                                                           |
+------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Time </fr/view/217/Time>`_                          | Détection de proximité (est-ce l'an prochain ?), formatage de belles chaînes de caractères (Aujourd'hui, 10h30) et conversion de fuseaux horaires.                                                                                    |
+------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| `Xml </fr/view/380/XML>`_                            | Des méthodes pratiques pour créer des entêtes et éléments XML.                                                                                                                                                                        |
+------------------------------------------------------+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+

