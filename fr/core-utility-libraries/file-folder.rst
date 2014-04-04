Folder & File
#############

Les utilitaires Folder et File sont des classes pratiques pour aider à la
lecture, l'écriture/l'ajout de fichiers; Lister les fichiers d'un dossier
et autres tâches habituelles liées aux répertoires.

Utilisation basique
===================

Assurez vous que les classes sont chargées en utilisant
:php:meth:`App::uses()`::

    <?php
    App::uses('Folder', 'Utility');
    App::uses('File', 'Utility');

Ensuite nous pouvons configurer une nouvelle instance de dossier::

    <?php
    $dir = new Folder('/path/to/folder');

et chercher tous les fichiers *.ctp* à l'intérieur de ce dossier en utilisant
les regex::

    <?php
    $files = $dir->find('.*\.ctp');

Maintenant nous pouvons faire une boucle sur les fichiers et les lire,
écrire/ajouter aux contenus, ou simplement supprimer le fichier::

    <?php
    foreach ($files as $file) {
        $file = new File($dir->pwd() . DS . $file);
        $contents = $file->read();
        // $file->write('J'écris dans ce fichier');
        // $file->append('J'ajoute à la fin de ce fichier.');
        // $file->delete(); // Je supprime ce fichier
        $file->close(); // Assurez vous de fermer le fichier quand c'est fini
    }

API de Folder
=============

.. php:class:: Folder(string $path = false, boolean $create = false, mixed $mode = false)

::

    <?php
    // Crée un nouveau dossier avec les permissions à 0755
    $dir = new Folder('/path/to/folder', true, 0755);

.. php:attr:: path

    Le chemin pour le dossier courant. :php:meth:`Folder::pwd()` retournera la
    même information.

.. php:attr:: sort

    Dit si la liste des résultats doit être oui ou non rangée par name.
    
.. php:attr:: mode

    Mode à utiliser pour la création de dossiers. par défaut à ``0755``. Ne
    fait rien sur les machines windows.
    
.. php:staticmethod:: addPathElement(string $path, string $element)

    :rtype: string

    Retourne $path avec $element ajouté, avec le bon slash entre-deux::

        $path = Folder::addPathElement('/a/path/for', 'testing');
        // $path égal /a/path/for/testing

    $element peut aussi être un tableau::

        $path = Folder::addPathElement('/a/path/for', array('testing', 'another'));
        // $path égal à /a/path/for/testing/another

    .. versionadded:: 2.5
        Le paramètre $element accepte un tableau depuis 2.5

.. php:method:: cd(string $path)

    :rtype: string

    Change le répertoire en $path. Retourne false si échec::

        <?php
        $folder = new Folder('/foo');
        echo $folder->path; // Affiche /foo
        $folder->cd('/bar');
        echo $folder->path; // Affiche /bar
        $false = $folder->cd('/non-existent-folder');


.. php:method:: chmod(string $path, integer $mode = false, boolean $recursive = true, array $exceptions = array())

    :rtype: boolean

    Change le mode sur la structure de répertoire de façon récursive. Ceci
    inclut aussi le changement du mode des fichiers::

        <?php
        $dir = new Folder();
        $dir->chmod('/path/to/folder', 0755, true, array('skip_me.php'));


.. php:method:: copy(array|string $options = array())

    :rtype: boolean

    Copie de façon récursive un répertoire. Le seul paramètre $options peut
    être soit un chemin à copier soit un tableau d'options::
    
        <?php
        $folder1 = new Folder('/path/to/folder1');
        $folder1->copy('/path/to/folder2');
        // Va mettre folder1 et tous son contenu dans folder2

        $folder = new Folder('/path/to/folder');
        $folder->copy(array(
            'to' => '/path/to/new/folder',
            'from' => '/path/to/copy/from', // va entraîner l'execution de cd()
            'mode' => 0755,
            'skip' => array('skip-me.php', '.git'),
            'scheme' => Folder::SKIP // Passe les répertoires/fichiers qui existent déjà.
        ));

    y a 3 schémas supportés:

    * ``Folder::SKIP`` échapper la copie/déplacement des fichiers & répertoires
      qui existent dans le répertoire de destination.
    * ``Folder::MERGE`` fusionne les répertoires source/destination. Les
      fichiers dans le répertoire source vont remplacer les fichiers dans le
      répertoire de cible. Les contenus du répertoire seront fusionnés.
    * ``Folder::OVERWRITE`` écrase les fichiers & répertoires existant dans la
      répertoire cible avec ceux dans le répertoire source. Si les deux source
      et destination contiennent le même sous-répertoire, les contenus du
      répertoire de cible vont être retirés et remplacés avec celui de la
      source.

    .. versionchanged:: 2.3
        La fusion, l'évitement et la surcharge des schémas ont été ajoutés à
        ``copy()``.

.. php:staticmethod:: correctSlashFor( $path )

    :rtype: string

    Retourne un ensemble correct de slashes pour un $path donné. ('\\' pour
    les chemins Windows et '/' pour les autres chemins).


.. php:method:: create(string $pathname, integer $mode = false)

    :rtype: boolean

    Crée une structure de répertoire de façon récursive. Peut être utilisé
    pour créer des structures de chemin profond comme `/foo/bar/baz/shoe/horn`::

        <?php
        $folder = new Folder();
        if ($folder->create('foo' . DS . 'bar' . DS . 'baz' . DS . 'shoe' . DS . 'horn')) {
            // Successfully created the nested folders
        }

.. php:method:: delete(string $path = null)

    :rtype: boolean

    Efface de façon récursive les répertoires si le système le permet::

        <?php
        $folder = new Folder('foo');
        if ($folder->delete()) {
            // Successfully deleted foo and its nested folders
        }

.. php:method:: dirsize()

    :rtype: integer

    Retourne la taille en bytes de ce Dossier et ses contenus.

.. php:method:: errors()

    :rtype: array

    Récupère l'erreur de la dernière méthode.


.. php:method:: find(string $regexpPattern = '.*', boolean $sort = false)

    :rtype: array

    Retourne un tableau de tous les fichiers correspondants dans le répertoire
    courant::

        <?php
        // Trouve tous les .png dans votre dossier app/webroot/img/ et range les résultats
        $dir = new Folder(WWW_ROOT . 'img');
        $files = $dir->find('.*\.png', true);
        /*
        Array
        (
            [0] => cake.icon.png
            [1] => test-error-icon.png
            [2] => test-fail-icon.png
            [3] => test-pass-icon.png
            [4] => test-skip-icon.png
        )
        */

.. note::

    Les méthodes find et findRecursive de folder ne trouvent seulement que
    des fichiers. Si vous voulez obtenir des dossiers et fichiers, regardez
    :php:meth:`Folder::read()` ou :php:meth:`Folder::tree()`.


.. php:method:: findRecursive(string $pattern = '.*', boolean $sort = false)

    :rtype: array

    Retourne un tableau de tous les fichiers correspondants dans et
    en-dessous du répertoire courant::
    
        <?php
        // Trouve de façon récursive les fichiers commençant par test ou index
        $dir = new Folder(WWW_ROOT);
        $files = $dir->findRecursive('(test|index).*');
        /*
        Array
        (
            [0] => /var/www/cake/app/webroot/index.php
            [1] => /var/www/cake/app/webroot/test.php
            [2] => /var/www/cake/app/webroot/img/test-skip-icon.png
            [3] => /var/www/cake/app/webroot/img/test-fail-icon.png
            [4] => /var/www/cake/app/webroot/img/test-error-icon.png
            [5] => /var/www/cake/app/webroot/img/test-pass-icon.png
        )
        */


.. php:method:: inCakePath(string $path = '')

    :rtype: boolean

    Retourne true si le Fichier est dans un CakePath donné.


.. php:method:: inPath(string $path = '', boolean $reverse = false)

    :rtype: boolean

    Retourne true si le Fichier est dans le chemin donné::

        <?php
        $Folder = new Folder(WWW_ROOT);
        $result = $Folder->inPath(APP);
        // $result = true, /var/www/example/app/ is in /var/www/example/app/webroot/

        $result = $Folder->inPath(WWW_ROOT . 'img' . DS, true);
        // $result = true, /var/www/example/app/webroot/ est dans /var/www/example/app/webroot/img/


.. php:staticmethod:: isAbsolute(string $path)

    :rtype: boolean

    Retourne true si le $path donné est un chemin absolu.


.. php:staticmethod:: isSlashTerm(string $path)

    :rtype: boolean

    Retourne true si le $path donné finit par un slash (par exemple. se
    termine-par-un-slash)::

        <?php
        $result = Folder::isSlashTerm('/my/test/path');
        // $result = false
        $result = Folder::isSlashTerm('/my/test/path/');
        // $result = true


.. php:staticmethod:: isWindowsPath(string $path)

    :rtype: boolean

    Retourne true si le $path donné est un chemin Windows.


.. php:method:: messages()

    :rtype: array

    Récupère les messages de la dernière méthode.


.. php:method:: move(array $options)

    :rtype: boolean

    Déplace le répertoire de façon récursive.


.. php:staticmethod:: normalizePath(string $path)

    :rtype: string

    Retourne un ensemble correct de slashes pour un $path donné. ('\\' pour
    les chemins Windows et '/' pour les autres chemins.)


.. php:method:: pwd()

    :rtype: string

    Retourne le chemin courant.


.. php:method:: read(boolean $sort = true, array|boolean $exceptions = false, boolean $fullPath = false)

    :rtype: mixed

    :param boolean $sort: Si à true, triera les résultats.
    :param mixed $exceptions: Un tableau de noms de fichiers et de dossiers
        à ignorer. Si à true ou '.' cette méthode va ignorer les fichiers
        cachés ou les fichiers commençant par '.'.
    :param boolean $fullPath: Si à true, va retourner les résultats en 
        utilisant des chemins absolus.

    Retourne un tableau du contenu du répertoire courant. Le tableau retourné
    contient deux sous-tableaux: Un des repertoires et un des fichiers::

        <?php
        $dir = new Folder(WWW_ROOT);
        $files = $dir->read(true, array('files', 'index.php'));
        /*
        Array
        (
            [0] => Array // dossiers
                (
                    [0] => css
                    [1] => img
                    [2] => js
                )
            [1] => Array // fichiers
                (
                    [0] => .htaccess
                    [1] => favicon.ico
                    [2] => test.php
                )
        )
        */


.. php:method:: realpath(string $path)

    :rtype: string

    Récupère le vrai chemin (taking ".." and such into account).


.. php:staticmethod:: slashTerm(string $path)

    :rtype: string

    Retourne $path avec le slash ajouté à la fin (corrigé pour 
    Windows ou d'autres OS).


.. php:method:: tree(null|string $path = null, array|boolean $exceptions = true, null|string $type = null)

    :rtype: mixed

    Retourne un tableau de répertoires imbriqués et de fichiers dans chaque
    répertoire.


L'API de File
=============

.. php:class:: File(string $path, boolean $create = false, integer $mode = 755)

::

    <?php
    // Crée un nouveau fichier avec les permissions à 0644
    $file = new File('/path/to/file.php', true, 0644);

.. php:attr:: Folder

    L'objet Folder du fichier.

.. php:attr:: name

    Le nom du fichier avec l'extension. Différe de :php:meth:`File::name()`
    qui retourne le nom sans l'extension.

.. php:attr:: info

    Un tableau du fichier info. Utilisez :php:meth:`File::info()` à la place.

.. php:attr:: handle

    Maintient le fichier de gestion des ressources si le fichier est ouvert.

.. php:attr:: lock

    Active le blocage du fichier en lecture et écriture.

.. php:attr:: path

    Le chemin absolu du fichier courant.

.. php:method:: append(string $data, boolean $force = false )

    :rtype: boolean

    Ajoute la chaîne de caractères donnée au fichier courant.

.. php:method:: close()

    :rtype: boolean

    Ferme le fichier courant si il est ouvert.

.. php:method:: copy(string $dest, boolean $overwrite = true)

    :rtype: boolean

    Copie le Fichier vers $dest.

.. php:method:: create()

    :rtype: boolean

    Crée le Fichier.

.. php:method:: delete()

    :rtype: boolean

    Supprime le Fichier.

.. php:method:: executable()

    :rtype: boolean

    Retourne true si le Fichier est executable.

.. php:method:: exists()

    :rtype: boolean

    Retourne true si le Fichier existe.

.. php:method:: ext()

    :rtype: string

    Retourne l'extension du Fichier.

.. php:method:: Folder()

    :rtype: Folder

    Retourne le dossier courant.

.. php:method:: group()

    :rtype: integer|false

    Retourne le groupe du Fichier.

.. php:method:: info()

    :rtype: array

    Retourne l'info du Fichier.

    .. versionchanged:: 2.1
        ``File::info()`` inclut maintenant les informations filesize & mimetype.

.. php:method:: lastAccess()

    :rtype: integer|false

    Retourne le dernier temps d'accès.

.. php:method:: lastChange()

    :rtype: integer|false

    Retourne le dernier temps modifié.

.. php:method:: md5(integer|boolean $maxsize = 5)

    :rtype: string

    Récupère la MD5 Checksum du fichier avec la vérification précédente du
    Filesize.

.. php:method:: name()

    :rtype: string

    Retourne le nom du Fichier sans l'extension.

.. php:method:: offset(integer|boolean $offset = false, integer $seek = 0)

    :rtype: mixed

    Définit ou récupère l'offset pour le fichier ouvert.

.. php:method:: open(string $mode = 'r', boolean $force = false)

    :rtype: boolean

    Ouvre le fichier courant avec un $mode donné.

.. php:method:: owner()

    :rtype: integer

    Retourne le propriétaire du Fichier.

.. php:method:: perms()

    :rtype: string

    Retourne le "chmod" (permissions) du Fichier.

.. php:staticmethod:: prepare(string $data, boolean $forceWindows = false)

    :rtype: string

    Prépare une chaîne de caractères ascii pour l'écriture. Convertit les
    lignes de fin en un terminator correct pour la plateforme courante. Si
    c'est windows "\r\n" sera utilisé, toutes les autres plateformes
    utiliseront "\n"

.. php:method:: pwd()

    :rtype: string

    Retourne un chemin complet du Fichier.

.. php:method:: read(string $bytes = false, string $mode = 'rb', boolean $force = false)

    :rtype: string|boolean

    Retourne les contenus du Fichier en chaîne de caractère ou retourne false
    en cas d'échec.

.. php:method:: readable()

    :rtype: boolean

    Retourne true si le Fichier est lisible.

.. php:method:: safe(string $name = null, string $ext = null)

    :rtype: string

    Rend le nom de fichier bon pour la sauvegarde.

.. php:method:: size()

    :rtype: integer

    Retourne le Filesize.

.. php:method:: writable()

    :rtype: boolean

    Retourne si le Fichier est ouvert en écriture.

.. php:method:: write(string $data, string $mode = 'w', boolean$force = false)

    :rtype: boolean

    Ecrit le $data donné dans le Fichier.

.. versionadded:: 2.1 ``File::mime()``.

.. php:method:: mime()

    :rtype: mixed

    Récupère le mimetype du Fichier, retourne false en cas d'échec.

.. php:method:: replaceText( $search, $replace )

    :rtype: boolean

    Remplace le texte dans un fichier. Retourne false en cas d'échec et true en cas de succès.

    .. versionadded::
        2.5 ``File::replaceText()``

.. meta::
    :title lang=fr: Folder & File
    :description lang=fr: Les utilitaires Folder et File sont des classes pratiques pour aider à la lecture, l'écriture; et l'ajout de fichiers; Lister les fichiers d'un dossier et autres tâches habituelles liées aux répertoires.
    :keywords lang=fr: file,folder,cakephp utility,read file,write file,append file,recursively copy,copy options,folder path,class folder,file php,php files,change directory,file utilities,new folder,directory structure,delete file
