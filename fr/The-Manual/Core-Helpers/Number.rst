Nombre
######

L'assistant Nombre (*NumberHelper*) contient des méthodes pratiques qui
permettent l'affichage des nombres dans des formats courants au sein de
vos vues. Ces méthodes incluent différentes manières de formater les
monnaies, les pourcentages, les tailles de données, de formater les
nombres pour des besoins spécifiques et aussi pour vous donner plus de
flexibilité en formatant les nombres.

Toutes ces fonctions renvoie le nombre formaté. Elles n'affichent pas
automatiquement le résultat dans les vues.

currency
========

``currency(mixed $number, string $currency= 'USD')``

Cette méthode est utilisée pour afficher un nombre dans des formats
courants de devises (EUR,GBP,USD). L'utilisation dans une vue ressemble
à :

::

    <?php echo $number->currency($nombre,$currency); ?>

Le premier paramètre, $number, doit être un nombre à virgule flottante
qui représente la somme d'argent que vous exprimez. Le second paramètre
est utilisé pour choisir un schéma prédéfini de formatage de devise :

+-------------+---------------------------------------+
| $currency   | 1234.56, formaté par type de devise   |
+=============+=======================================+
| EUR         | € 1.236,33                            |
+-------------+---------------------------------------+
| GBP         | £ 1,236.33                            |
+-------------+---------------------------------------+
| USD         | $ 1,236.33                            |
+-------------+---------------------------------------+

Des entités HTML sont affichés pour les symboles de devises qui le
nécessitent.

Si une valeur non reconnue est soumise pour $currency, elle est préfixée
à un nombre au format USD (dollar US). Par exemple :

::

    <?php echo $number->currency('1234.56', 'FOO'); ?>
     
    // Affiche : 
    FOO 1,234.56

precision
=========

``precision (mixed $nombre, int $precision = 3)``

Cette méthode affiche un nombre avec le degré de précision spécifié
(nombre de décimales). Il sera arrondi pour conserver ce niveau de
précision.

::

    <?php echo $number->precision(456.91873645, 2 ); ?>
     
    // Affiche : 
    456.92

toPercentage
============

``toPercentage(mixed $nombre, int $precision = 2)``

Comme precision(), cette méthode formate un nombre en fonction de la
précision fournie (les nombres sont arrondis pour répondre à la
précision donnée). Cette méthode exprime également le nombre comme un
pourcentage et complète l'affichage avec le signe "pour cent".

::

    <?php echo $number->toPercentage(45.691873645); ?>
     
    // Affiche :
    45.69%

toReadableSize
==============

``toReadableSize(string $taille_donnee)``

Cette méthode formate des tailles de données sous une forme
compréhensible par les humains. Elle fournit un raccourci pour convertir
des octets en Ko, Mo, Go et To. La taille est affichée avec un niveau de
précision à deux chiffres, adapté à la taille des données fournies (par
exemple : les tailles les plus grandes sont exprimées avec les unités
les plus grandes) :

::

    echo $number->toReadableSize(0);  // 0 octet
    echo $number->toReadableSize(1024); // 1 Ko
    echo $number->toReadableSize(1321205.76); // 1.26 Mo
    echo $number->toReadableSize(5368709120); // 5.00 Go

format
======

``format (mixed $number, mixed $options=false)``

Cette méthode vous offre plus de contrôle sur le formatage des nombres
pour les utiliser dans vos vues (et elle est utilisée comme méthode par
la plupart des autres méthodes de l'assistant Number). L'usage de cette
méthode ressemble peut-être à çà :

::

    $number->format($number, $options);

Le paramètre $number est le nombre que vous envisagez de formater pour
affichage. Sans $options soumises, le nombre 1236.334 s'afficherait
1,236. Notez que la précision par défaut est de zéro décimales.

Le paramètre $options c'est là que réside la magie réelle de cette
méthode.

-  Si vous passez un entier, alors celui-ci devient le niveau de
   précision ou de décimales pour la fonction.
-  Si vous passez un tableau associatif, vous pouvez utilisez les clés
   suivantes :

   -  places (integer) : le niveau de précision désiré
   -  before (string) : à placer avant le nombre affiché
   -  escape (boolean) : si vous voulez que la valeur de before soit
      échapée
   -  decimals (string) : utilisée pour délimiter les décimales dans un
      nombre
   -  thousands (string) : utilisée pour délimiter les milliers,
      millions...

::

    echo $number->format('123456.7890', array(
        'places' => 2,
        'before' => '¥ ',
        'escape' => false,
        'decimals' => '.',
        'thousands' => ','
    ));
    // affiche '¥ 123,456.79'

