Folder & File
#############

.. php:namespace:: Cake\Filesystem

Les utilitaires Folder et File sont des classes pratiques pour la lecture,
l'écriture/l'ajout de fichiers, lister les fichiers d'un dossier et toute autre
tâche habituelle liée aux répertoires.

Utilisation Basique
===================

Assurez-vous que les classes sont chargées::

    use Cake\Filesystem\Folder;
    use Cake\Filesystem\File;

Ensuite nous pouvons configurer une nouvelle instance de dossier::

    $dir = new Folder('/path/to/folder');

et chercher tous les fichiers *.ctp* à l'intérieur de ce dossier en utilisant
les regex::

    $files = $dir->find('.*\.ctp');

Maintenant nous pouvons faire une boucle sur les fichiers et les lire,
écrire/ajouter aux contenus, ou simplement supprimer le fichier::

    foreach ($files as $file) {
        $file = new File($dir->pwd() . DS . $file);
        $contents = $file->read();
        // $file->write('J'écris dans ce fichier');
        // $file->append('J'ajoute à la fin de ce fichier.');
        // $file->delete(); // Je supprime ce fichier
        $file->close(); // Assurez-vous de fermer le fichier quand c'est fini
    }

API de Folder
=============

.. php:class:: Folder(string $path = false, boolean $create = false, string|boolean $mode = false)

::

    // Crée un nouveau dossier avec les permissions à 0755
    $dir = new Folder('/path/to/folder', true, 0755);

.. php:attr:: path

    Le chemin pour le dossier courant. :php:meth:`Folder::pwd()` retournera la
    même information.

.. php:attr:: sort

    Dit si la liste des résultats doit être oui ou non rangée selon name.

.. php:attr:: mode

    Mode à utiliser pour la création de dossiers. par défaut à ``0755``. Ne fait
    rien sur les machines Windows.

.. php:staticmethod:: addPathElement(string $path, string $element)

    Retourne $path avec $element ajouté, avec le bon slash entre-deux::

        $path = Folder::addPathElement('/a/path/for', 'testing');
        // $path égal /a/path/for/testing

    $element peut aussi être un tableau::

        $path = Folder::addPathElement('/a/path/for', ['testing', 'another']);
        // $path égal à /a/path/for/testing/another

.. php:method:: cd( $path )

    Change le répertoire en $path. Retourne ``false`` en cas d'échec::

        $folder = new Folder('/foo');
        echo $folder->path; // Affiche /foo
        $folder->cd('/bar');
        echo $folder->path; // Affiche /bar
        $false = $folder->cd('/non-existent-folder');

.. php:method:: chmod(string $path, integer $mode = false, boolean $recursive = true, array $exceptions = [])

    Change le mode sur la structure de répertoire de façon récursive. Ceci
    inclut aussi le changement du mode des fichiers::

        $dir = new Folder();
        $dir->chmod('/path/to/folder', 0755, true, ['skip_me.php']);

.. php:method:: copy(array|string $options = [])

    Copie de façon récursive un répertoire. Le seul paramètre $options peut être
    soit un chemin à copier soit un tableau d'options::

        $folder1 = new Folder('/path/to/folder1');
        $folder1->copy('/path/to/folder2');
        // mettra le folder1 et tout son contenu dans folder2

        $folder = new Folder('/path/to/folder');
        $folder->copy([
            'to' => '/path/to/new/folder',
            'from' => '/path/to/copy/from', // Will cause a cd() to occur
            'mode' => 0755,
            'skip' => ['skip-me.php', '.git'],
            'scheme' => Folder::SKIP  // Ne fait pas les répertoires/fichiers qui existent déjà.
        ]);

    y a 3 schémas supportés:

    * ``Folder::SKIP`` échapper la copie/déplacement des fichiers & répertoires
      qui existent dans le répertoire de destination.
    * ``Folder::MERGE`` fusionne les répertoires source/destination. Les
      fichiers dans le répertoire source vont remplacer les fichiers dans le
      répertoire de cible. Les contenus du répertoire seront fusionnés.
    * ``Folder::OVERWRITE`` écrase les fichiers & répertoires existant dans le
      répertoire cible avec ceux dans le répertoire source. Si la source et la
      destination contiennent le même sous-répertoire, les contenus du
      répertoire de cible vont être retirés et remplacés avec celui de la
      source.

.. php:staticmethod:: correctSlashFor(string $path)

    Retourne un ensemble correct de slashes pour un $path donné. ('\\' pour les
    chemins Windows et '/' pour les autres chemins).

.. php:method:: create(string $pathname, integer $mode = false)

    Crée une structure de répertoire de façon récursive. Peut être utilisée pour
    créer des structures de chemin profond comme `/foo/bar/baz/shoe/horn`::

        $folder = new Folder();
        if ($folder->create('foo' . DS . 'bar' . DS . 'baz' . DS . 'shoe' . DS . 'horn')) {
            // Successfully created the nested folders
        }

.. php:method:: delete(string $path = null)

    Efface de façon récursive les répertoires si le système le permet::

        $folder = new Folder('foo');
        if ($folder->delete()) {
            // Supprime foo et ses dossiers imbriqués avec succès
        }

.. php:method:: dirsize()

    Retourne la taille en bytes de ce Dossier et ses contenus.

.. php:method:: errors()

    Récupère l'erreur de la dernière méthode.

.. php:method:: find(string $regexpPattern = '.*', boolean $sort = false)

    Retourne un tableau de tous les fichiers correspondants dans le répertoire
    courant::

        // Trouve tous les .png dans votre dossier webroot/img/ et range les résultats
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

    Les méthodes find et findRecursive de folder ne trouvent seulement que des
    fichiers. Si vous voulez obtenir des dossiers et fichiers, regardez
    :php:meth:`Folder::read()` ou :php:meth:`Folder::tree()`.

.. php:method:: findRecursive(string $pattern = '.*', boolean $sort = false)

    Retourne un tableau de tous les fichiers correspondants dans et en-dessous
    du répertoire courant::

        // Trouve de façon récursive les fichiers commençant par test ou index
        $dir = new Folder(WWW_ROOT);
        $files = $dir->findRecursive('(test|index).*');
        /*
        Array
        (
            [0] => /var/www/cake/webroot/index.php
            [1] => /var/www/cake/webroot/test.php
            [2] => /var/www/cake/webroot/img/test-skip-icon.png
            [3] => /var/www/cake/webroot/img/test-fail-icon.png
            [4] => /var/www/cake/webroot/img/test-error-icon.png
            [5] => /var/www/cake/webroot/img/test-pass-icon.png
        )
        */

.. php:method:: inCakePath(string $path = '')

    Retourne ``true`` si le Fichier est dans un CakePath donné.

.. php:method:: inPath(string $path = '', boolean $reverse = false)

    Retourne ``true`` si le Fichier est dans le chemin donné::

        $Folder = new Folder(WWW_ROOT);
        $result = $Folder->inPath(APP);
        // $result = true, /var/www/example/ est dans /var/www/example/webroot/

        $result = $Folder->inPath(WWW_ROOT . 'img' . DS, true);
        // $result = true, /var/www/example/webroot/ est dans /var/www/example/webroot/img/

.. php:staticmethod:: isAbsolute(string $path)

    Retourne ``true`` si le $path donné est un chemin absolu.

.. php:staticmethod:: isSlashTerm(string $path)

    Retourne ``true`` si le $path donné finit par un slash (par exemple. se
    termine-par-un-slash)::

        $result = Folder::isSlashTerm('/my/test/path');
        // $result = false
        $result = Folder::isSlashTerm('/my/test/path/');
        // $result = true

.. php:staticmethod:: isWindowsPath(string $path)

    Retourne ``true`` si le $path donné est un chemin Windows.

.. php:method:: messages()

    Récupère les messages de la dernière méthode.

.. php:method:: move(array $options)

    Déplace le répertoire de façon récursive.

.. php:staticmethod:: normalizePath(string $path)

    Retourne un ensemble correct de slashes pour un $path donné. ('\\' pour
    les chemins Windows et '/' pour les autres chemins.)

.. php:method:: pwd()

    Retourne le chemin courant.

.. php:method:: read(boolean $sort = true, array|boolean $exceptions = false, boolean $fullPath = false)

    Retourne un tableau du contenu du répertoire courant. Le tableau retourné
    contient deux sous-tableaux: Un des repertoires et un des fichiers::

        $dir = new Folder(WWW_ROOT);
        $files = $dir->read(true, ['files', 'index.php']);
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

    Récupère le vrai chemin (en prenant en compte ".." etc...).

.. php:staticmethod:: slashTerm(string $path)

    Retourne $path avec le slash ajouté à la fin (corrigé pour Windows ou
    d'autres OS).

.. php:method:: tree(null|string $path = null, array|boolean $exceptions = true, null|string $type = null)

    Retourne un tableau de répertoires imbriqués et de fichiers dans chaque
    répertoire.


L'API de File
=============

.. php:class:: File(string $path, boolean $create = false, integer $mode = 755)

::

    // Crée un nouveau fichier avec les permissions à 0644
    $file = new File('/path/to/file.php', true, 0644);

.. php:attr:: Folder

    L'objet Folder du fichier.

.. php:attr:: name

    Le nom du fichier avec l'extension. Diffère de :php:meth:`File::name()`
    qui retourne le nom sans l'extension.

.. php:attr:: info

    Un tableau du fichier info. Utilisez :php:meth:`File::info()` à la place.

.. php:attr:: handle

    Contient le fichier de gestion des ressources si le fichier est ouvert.

.. php:attr:: lock

    Active le blocage du fichier en lecture et en écriture.

.. php:attr:: path

    Le chemin absolu du fichier courant.

.. php:method:: append(string $data, boolean $force = false )

    Ajoute la chaîne de caractères donnée au fichier courant.

.. php:method:: close()

    Ferme le fichier courant s'il est ouvert.

.. php:method:: copy(string $dest, boolean $overwrite = true)

    Copie le Fichier vers $dest.

.. php:method:: create()

    Crée le Fichier.

.. php:method:: delete()

    Supprime le Fichier.

.. php:method:: executable()

    Retourne ``true`` si le Fichier est exécutable.

.. php:method:: exists()

    Retourne ``true`` si le Fichier existe.

.. php:method:: ext()

    Retourne l'extension du Fichier.

.. php:method:: Folder()

    Retourne le dossier courant.

.. php:method:: group()

    Retourne le groupe du Fichier ou ``false`` en cas d'erreur.

.. php:method:: info()

    Retourne l'info du Fichier.

.. php:method:: lastAccess()

    Retourne le dernier temps d'accès.

.. php:method:: lastChange()

    Retourne le dernier temps modifié ou ``false`` en cas d'erreur.

.. php:method:: md5(integer|boolean $maxsize = 5)

    Récupère la MD5 Checksum du fichier avec la vérification précédente du
    Filesize ou ``false`` en cas d'erreur.

.. php:method:: name()

    Retourne le nom du Fichier sans l'extension.

.. php:method:: offset(integer|boolean $offset = false, integer $seek = 0)

    Définit ou récupère l'offset pour le fichier ouvert.

.. php:method:: open(string $mode = 'r', boolean $force = false)

    Ouvre le fichier courant avec un $mode donné.

.. php:method:: owner()

    Retourne le propriétaire du Fichier.

.. php:method:: perms()

    Retourne le "chmod" (permissions) du Fichier.

.. php:staticmethod:: prepare(string $data, boolean $forceWindows = false)

    Prépare une chaîne de caractères ascii pour l'écriture. Convertit les lignes
    de fin en un terminator correct pour la plateforme courante. Si c'est
    Windows "\\r\\n" sera utilisé, toutes les autres plateformes utiliseront "\\n".

.. php:method:: pwd()

    Retourne un chemin complet du Fichier.

.. php:method:: read(string $bytes = false, string $mode = 'rb', boolean $force = false)

    Retourne les contenus du Fichier en chaîne de caractère ou retourne
    ``false`` en cas d'échec.

.. php:method:: readable()

    Retourne ``true`` si le Fichier est lisible.

.. php:method:: safe(string $name = null, string $ext = null)

    Rend le nom de fichier bon pour la sauvegarde.

.. php:method:: size()

    Retourne le Filesize en bytes.

.. php:method:: writable()

    :rtype: boolean

    Retourne ``true`` si le Fichier est ouvert en écriture.

.. php:method:: write(string $data, string $mode = 'w', boolean$force = false)

    Ecrit le $data donné dans le Fichier.

.. php:method:: mime()

    Récupère le mimetype du Fichier, retourne ``false`` en cas d'échec.

.. php:method:: replaceText( $search, $replace )

    Remplace le texte dans un fichier. Retourne ``false`` en cas d'échec et
    ``true`` en cas de succès.

.. meta::
    :title lang=fr: Folder & File
    :description lang=fr: Les utilitaires Folder et File sont des classes pratiques pour aider à la lecture, l'écriture; et l'ajout de fichiers; Lister les fichiers d'un dossier et autres tâches habituelles liées aux répertoires.
    :keywords lang=fr: file,folder,cakephp utility,read file,write file,append file,recursively copy,copy options,folder path,class folder,file php,php files,change directory,file utilities,new folder,directory structure,delete file
