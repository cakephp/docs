Javascript
##########

L'assistant Javascript est utilisé dans l'aide à la création de tags et
blocs de code Javascript bien formatés. Il y a plusieurs méthodes dont
certaines sont conçues pour fonctionner avec la librairie Javascript
`Prototype <https://www.prototypejs.org>`_.

Méthodes
========

``codeBlock($script, $options = array('allowCache'=>true,'safe'=>true,'inline'=>true), $safe)``

-  string $script - Le JavaScript à encadrer par les balises SCRIPT
-  array $options - Ensemble d'options :

   -  allowCache : booléen, détermine si ce bloc peut-être mis en cache
      en utilisant les paramètres courants de cache.
   -  safe : booléen, indique si ce bloc doit être encadré par des
      balises CDATA. Par défaut, équivaut à la configuration de l'objet
      du helper.
   -  inline : détermine si le bloc doit être écrit en ligne ou écrit
      dans le cache pour un affichage ultérieur (c'est-à-dire dans
      $scripts\_for\_layout).

-  boolean $safe - DEPRECIE. Utilisez $options['safe'] à la place

codeBlock retourne un élément script formaté contenant $script. Mais
peut aussi retourner null si l'assistant Javascript est paramétré pour
mettre en cache les événements. Voir JavascriptHelper::cacheEvents(). Et
peut écrire dans ``$scripts_for_layout`` si vous définissez
$options['inline'] à false.

``blockEnd()``

Termine un bloc Javascript mis en cache. Peut retourner soit une balise
script fermante, soit vider le buffer, en ajoutant le contenu au tableau
cachedEvents. Sa valeur de retour dépend des paramètres du cache. Voir
JavascriptHelper::cacheEvents()

``link($url, $inline = true)``

-  mixed $url - Chaîne URL vers un fichier JavaScript ou un tableau
   d'URLs.
-  boolean $inline Si true, la balise <script> sera écrite en ligne,
   sinon elle sera écrite dans ``$scripts_for_layout``

Crée un lien javascript vers un ou plusieurs fichiers javascript. Peut
s'afficher en ligne ou dans ``$scripts_for_layout``.

Si le nom du fichier est préfixé par "/", le chemin sera relatif au
chemin de base de votre application. Sinon, le chemin sera relatif à
votre chemin JavaScript, habituellement webroot/js.

``escapeString($string)``

-  string $script - Chaîne qui nécessite d'être échappée.

Echappe une chaîne pour qu'elle soit JavaScript friendly. Lui permettant
d'être utilisée sans problème dans les blocs javascript.

Les caractères échapés sont :

-  "\\r\\n" => '\\n'
-  "\\r" => '\\n'
-  "\\n" => '\\n'
-  '"' => '\\"'
-  "'" => "\\\\'"

``event($object, $event, $observer, $useCapture)``

-  string $object - Objet du DOM à observer.
-  string $event - type d'événement à observer, par ex 'click', 'over'.
-  string $observer - fonction Javascript à appeler quand l'événement se
   produit.
-  array $options - Définit des options : useCapture, allowCache, safe

   -  boolean $options['useCapture'] - Indique si on doit lancer
      l'événement à la capture ou durant la phase de manipulation de
      l'évenement. Vaut false par défaut
   -  boolean $options['allowCache'] - Voir
      JavascriptHelper::cacheEvents()
   -  boolean $options['safe'] - Indique si les blocs <script /> doivent
      être écrits 'safely', c'est-à-dire encadrés par des blocs CDATA

Attache un gestionnaire d'événement javascript, spécifié par $event, à
un élément DOM spécifié par $object. L'objet ne doit pas être une
référence à un ID, il peut se référer à tout objet javascript valide ou
à des sélecteurs CSS. Si un sélecteur CSS est utilisé, le gestionnaire
d'événement est mis en cache et doit être récupérer avec
JavascriptHelper::getCache(). Cette méthode requiert la librairie
Prototype.

``cacheEvents($file, $all)``

-  boolean $file - Si true, le code sera écrit dans un fichier
-  boolean $all - Si true, tout le code écrit avec le JavascriptHelper
   sera envoyé dans un fichier

Cela vous permet de contrôler comment l'assistant JavaScript met en
cache le code d'événement généré par event(). Si $all est défini à true,
tout le code généré par l'assistant est mis en cache et peut être
récupéré avec getCache() ou écrit dans un fichier ou dans l'affichage
d'une page avec writeCache().

``getCache($clear)``

-  boolean $clear - Si défini à true, le javascript mis en cache est
   vidé. Vaut true par défaut.

Récupère (et vide) le cache d'événement JavaScript courant

``writeEvents($inline)``

-  boolean $inline - Si true, retourne un code d'évenement JavaScript.
   Sinon, il est ajouté à l'affichage de $scripts\_for\_layout dans le
   gabarit.

Retourne le code javascript mis en cache. Si $file était défini à true
avec cacheEvents(), le code est mis en cache dans un fichier et un lien
script vers le fichier d'évenements mis en cache est retourné. Si inline
est à true, le code d'évenement est retourné en ligne. Sinon il est
ajouté au $scripts\_for\_layout de la page en cours.

``includeScript($script)``

-  string $script - Nom de fichier du script à inclure.

Inclut le $script nommé. Si $script est laissé blanc, l'assistant
incluera chaque script dans votre répertoire app/webroot/js. Inclut les
contenus de chaque fichier en ligne. Pour créer une balise script avec
un attribut src, utilisez link().

``object($data, $options)``

-  array $data - Données à convertir
-  array $options - Ensemble d'options : block, prefix, postfix,
   stringKeys, quoteKeys, q

   -  boolean $options['block'] - Si true, entoure la valeur de retour
      par un bloc <script />. Vaut false par défaut.
   -  string $options['prefix'] - Préfixe la chaîne aux données
      retournées.
   -  [correspondance] string $options['prefix'] - Ajoute la chaîne aux
      données retournées.
   -  array $options['stringKeys'] - Une liste de clés de tableau à
      traiter comme une chaîne.
   -  boolean $options['quoteKeys'] - Si false, traite $stringKey comme
      une liste de clés qui ne doivent pas être mis entre guillemets.
      Vaut true par défaut.
   -  string $options['q'] - Le type de guillemets à utilliser.

Génère un objet JavaScript en JavaScript Object Notation (JSON) d'après
le tableau $data.
