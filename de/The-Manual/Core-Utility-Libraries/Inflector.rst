Inflector
#########

Die ``Inflector``-Klasse wendet Flexionsregeln auf gegebene
Zeichenketten an um Wordvariantionen wie Plural- und Camelcase-Formen zu
erzeugen. Normalerweise wird sie statisch aufgerufen:
``Inflector::pluralize('example')`` gibt "examples" zurück.

Methoden
========

 

Eingabe

Ausgabe

pluralize

Apple, Orange, Person, Man

Apples, Oranges, People. Men

singularize

Apples, Oranges, People, Men

Apple, Orange, Person, Man

camelize

Apple\_pie, some\_thing, people\_person

ApplePie, SomeThing, PeoplePerson

underscore

Zu beachten ist, dass ``underscore`` nur CamelCase formatierte Wörter
konvertiert. Bei Wörtern, die Leerzeichen enthalten, werden nur die
Buchstaben in Kleinbuchstaben umgewandelt und enthalten am Ende keine
Unterstriche.

applePie, someThing

apple\_pie, some\_thing

humanize

apple\_pie, some\_thing, people\_person

Apple Pie, Some Thing, People Person

tableize

Apple, UserProfileSetting, Person

apples, user\_profile\_settings, people

classify

apples, user\_profile\_settings, people

Apple, UserProfileSetting, Person

variable

apples, user\_result, people\_people

apples, userResult, peoplePeople

slug

``slug`` konvertiert, ausgebend von einer UTF-8 Kodierung, alle
Buchstaben in ihre Latin-Version, unbekannte Zeichen, sowie Leerzeichen
werden in Unterstriche konvertiert.

apple purée

apple\_puree
