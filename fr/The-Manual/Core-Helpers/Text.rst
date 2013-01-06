Texte
#####

L'assistant Text contient des méthodes pour rendre le texte plus
utilisable et sympathique dans vos vues. Il aide à activer des liens, à
formater des urls, à créer des extraits de texte à partir de mots ou
phrases choisis, à mettre en surbrillance des mots clés dans des blocs
de texte et à tronquer avec élégance de longues portions de texte.

**autoLinkEmails (string $text, array $htmlOptions=array())**

Ajoute des liens aux adresses emails correctement formatées dans $text,
selon les options définies dans $htmlOptions (voir HtmlHelper::link()).

::

    $mon_texte = 'Pour plus d\'informations à propos de nos pâtisseries et desserts de renommée mondiale, contactez info@example.com'; 
    $texte_lie = $text->autoLinkEmails($mon_texte);
    // $texte_lie :
    Pour plus d'informations à propos de nos pâtisseries et desserts de renommée mondiale, contactez <a href="mailto:info@example.com"><u>info@example.com</u></a>

**autoLinkUrls (string $text, array $htmlOptions=array())**

Pareil que autoLinkEmails(), mais cette méthode recherche des chaînes
commençant par https, http, ftp ou nntp et crée les liens de façon
appropriée.

**autoLink (string $text, array $htmlOptions=array())**

Exécute les deux fonctionnalités autoLinkUrls() et autoLinkEmails() sur
le $text soumis. Tous les URLs et emails seront créés selon les options
$htmlOptions données.

**excerpt (string $haystack, string $needle, int $radius=100, string
$ending="...")**

Extrait une portion de $haystack entourant $needle avec un nombre de
caractères de chaque côté déterminé par $radius et suffixé par $ending.
Cette méthode est particulièrement adaptée pour la recherche de
résultats. La chaîne recherchée ou les mots-clés peuvent-être affichés
sans le document résultant.

::

    <?php echo $text->excerpt($dernier_paragraphe, 'méthode', 50); ?> 
    // Affiche
    ...ôté déterminé par $radius et suffixé par $ending. Cette méthode est particulièrement adaptée pour la recherche d... 

**highlight (string $haystack, string $needle, $highlighter= '\\1')**

Mettre en évidence $needle dans $haystack en utilisant la chaîne
$highlighter spécifiée.

::

    <?php echo $text->highlight($derniere_phrase, 'utilisant'); ?> 
    //Output
    Mettre en évidence $needle dans $haystack en <span class="highlight">utilisant</span> 
     la chaîne $highlighter spécifiée.

**stripLinks ($text)**

Enlève tous les liens HTML du $text soumis.

**toList (array $list, $and = 'and')**

Crée une liste séparée par des virgules où les deux derniers éléments
sont joints par 'and'.

::

    <?php echo $text->toList($couleurs, 'et'); ?> 

    // Affiche 
    rouge, orange, jaune, vert, bleu, indigo et violet

**truncate (string $text, int $length=100, string $ending='...', boolean
$exact=true, boolean $considerHtml = false)**

**truncate (string $text, int $length=100, array $options=array(string
$ending='...', boolean $exact=true, boolean $considerHtml = false))**

**trim(); // un alias de truncate**

Coupe une chaîne à la longueur $length et suffixe le résultat avec
$ending si le texte est plus long que $length. Si $exact est mis à
*false*, $text ne sera pas coupé au milieu d'un mot et la troncature se
produira après la fin du mot précédent. Si $considerHtml est mis à
*true*, les balises HTML seront respectées et ne seront pas coupées.

::

    <?php    
    echo $text->truncate(
        'Le meurtrier avança lentement et se prit les pieds dans le tapis.', 
        22,
        '...',
        false
    ); 
    ?> 

::

    // Affiche :
    Le meurtrier avança...

