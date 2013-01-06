Sécurisation des données
########################

La classe Sanitize de CakePHP peut être utilisée pour éliminer les
données malicieuses soumises par l'utilisateur, ainsi que d'autres
informations non souhaitées. Sanitize est une librairie du cœur de
CakePHP, elle peut donc être utilisée partout dans votre code, mais la
meilleure solution est sans doute de l'utiliser dans les contrôleurs ou
les modèles.

Tout ce que vous avez à faire est d'inclure la librairie Sanitize :

::

    App::import('Sanitize');

Une fois que cela est fait, vous pouvez appelez Sanitize de façon
statique.

paranoid
========

paranoid(string $string, array $allowedChars);

Cette fonction vide la chaîne $string de tout caractère non
alpha-numérique. La fonction peut ignorer certains caractères en les
passant dans le tableau des caractères autorisés $allowedChars.

::

    $mauvaiseChaine = ";:<script><html><   // >@@#";
    echo Sanitize::paranoid($mauvaiseChaine);
    // sortie : scripthtml
    echo Sanitize::paranoid($mauvaiseChaine, array(' ', '@'));
    // sortie : scripthtml    @@

html
====

html(string $string, boolean $remove = false)

Cette méthode prépare les données entrées par l'utilisateur avant leur
rendu HTML. C'est particulièrement utile si vous ne voulez pas que les
utilisateurs détruisent vos mises en page, insèrent des images ou des
scripts dans le contenu de vos pages HTML. Si l'option $remove est
définie à vrai (true), le contenu HTML sera détruit plutôt que
transformé en entités HTML.

::

    $entreeNonSouhaitee = '<font size="99" color="#FF0000">SALUT</font><script>...</script>';
    echo Sanitize::html($entreeNonSouhaitee);
    // sortie : &lt;font size=&quot;99&quot; color=&quot;#FF0000&quot;&gt;SALUT&lt;/font&gt;&lt;script&gt;...&lt;/script&gt;
    echo Sanitize::html($entreeNonSouhaitee, true);
    // sortie : SALUT...

escape
======

escape(string $string, string $connection)

Utilisé pour échapper les déclarations SQL par l'ajout de *slashes*, en
tenant compte de la configuration actuelle du système concernant les
magic\_quotes\_gpc. $connection est le nom de la base concernée par
l'échappement, telle que nommée dans votre fichier
app/config/database.php .

clean
=====

``Sanitize::clean(mixed $data, mixed $options)``

Cette fonction est un nettoyeur multi-usage de force industrielle,
destinée à être utilisée sur des tableaux entiers (comme $this->data,
par exemple). La fonction prend un tableau (ou une chaîne) et retourne
la version nettoyée. Les opérations de nettoyage suivantes sont
exécutées sur chaque élément du tableau (de façon récursive) :

-  Les espaces bizarres (incluant 0xCA) sont remplacés par des espaces
   ordinaires.
-  Double vérification des caractères spéciaux et suppression des
   retours chariot pour une sécurité SQL accrue.
-  Ajout de *slashes* pour SQL (appelle simplement la fonction sql
   exposée précédemment).
-  Permutation des anti-slashes saisis par l'utilisateur avec des
   anti-slashes vérifiés.

L'argument $options peut être une chaîne ou un tableau. Lorsqu'une
chaîne est fournie, il s'agit du nom de la connexion à la base de
données. Si un tableau est fourni, il sera fusionné avec les options
suivantes :

-  connection
-  odd\_spaces
-  encode
-  dollar
-  carriage
-  unicode
-  escape
-  backslash

L'utilisation de clean() avec des options ressemble à quelque chose
comme :

::

    $this->data = Sanitize::clean($this->data, array('encode' => false));

