Gestion des erreurs
###################

Dans l'éventualité d'une erreur irrécupérable dans votre application, il
est courant d'arrêter le processus et d'afficher une page d'erreur à
l'utilisateur. Pour vous éviter de coder des traitements spécifiques
pour cela dans chacun de vos contrôleurs et composants, vous pouvez
utiliser la méthode fournie :

::

    $this->cakeError(<string errorType>, [array parameters]);

Faire appel à cette méthode affichera une page d'erreur à l'utilisateur
et arrêtera tout processus ultérieur de votre application.

``parameters`` doit être un tableau de chaînes de caractères. Si le
tableau contient des objets (objets ``Exception`` inclus), ils seront
transtypés en chaînes.

CakePHP prédéfinit un lot d'erreur-types, mais pour le moment, la
plupart ne sont réellement utiles que par le framework lui-même. Celle
qui est la plus utile pour le développeur d'applications est la bonne
vielle page d'erreur 404. Elle peut être appelée sans paramètres de la
façon suivante :

::

    $this->cakeError('error404');

Alternativement, vous pouvez forcer la page à signaler que l'erreur
s'est produite à une URL spécifique en passant le paramètre ``url`` :

::

    $this->cakeError('error404', array('url' => 'une/autre.url'));

Cela devient beaucoup plus utile en étendant le gestionnaire d'erreur et
en lui soumettant vos propres types d'erreurs. Les gestionnaires
d'erreur personnalisés fonctionnent pratiquement comme les actions d'un
contrôleur. Vous allez typiquement attribuer ``set()`` chaque paramètre
passé dans la vue, et ensuite afficher un fichier de vue depuis votre
répertoire ``app/views/errors``.

Créer un fichier ``app/app_error.php`` avec la définition suivante :

::

    <?php
    class AppError extends ErrorHandler {
    }   
    ?>

Les gestionnaires pour les nouveaux types d'erreurs peuvent être
implémentés en ajoutant des méthodes à cette classe. Créez simplement
une nouvelle méthode avec le nom que vous voulez utiliser comme type
d'erreur.

Prenons l'exemple d'une application qui écrit un certain nombre de
fichiers sur le disque et qu'il est approprié d'indiquer les erreurs
d'écriture à l'utilisateur. Nous ne voulons pas ajouter de code pour
cela dans toutes les parties de notre application, c'est donc un bon
exemple pour utiliser un nouveau type d'erreur.

Ajoutez une nouvelle méthode à votre classe ``AppError``. Nous prenons
un paramètre appelé ``fichier`` qui sera le lien vers le fichier que
nous n'avons pas réussi à écrire.

::

    function impossibleEcrireFichier($params) {
      $this->controller->set('fichier', $params['fichier']);
      $this->_outputMessage('impossible_ecrire_fichier');
    }

Créez la vue dans ``app/views/errors/impossible_ecrire_fichier.ctp``

::

    <h2>Impossible d'écrire le fichier</h2>
    <p>Nous n'avons pas pu écrire le fichier <?php echo $fichier ?> sur le disque.</p>

et lancez l'erreur dans le contrôleur/composant :

::

    $this->cakeError('impossibleEcrireFichier', array('fichier'=>'unnomdefichier')); 

L'implémentation par défaut de
``$this->__outputMessage(<view-filename>)`` affichera simplement la vue
dans ``views/errors/<view-filename>.ctp``. Si vous voulez outrepasser ce
comportement, vous pouvez redéfinir ``__outputMessage($template)`` dans
votre classe ``AppError``.
