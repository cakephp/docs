Inflector
#########

A classe Inflector recebe uma string e pode devolver variações da
palavra, como suas versões em plural ou camelizada, sendo normalmente
acessada de maneira estática. Por exemplo,
``Inflector::pluralize('exemplo')`` retorna "exemplos".

Métodos de Classe
=================

 

Entrada

Saída

pluralize

Apple, Laranja, Person, Pessoa, ...

Apples, Laranjas, People, Pessoas, ...

singularize

Apples, Laranjas, People, Pessoas, ...

Apple, Laranja, Person, Pessoa, ...

camelize

Apple\_pie, alguma\_coisa, people\_person

ApplePie, AlgumaCoisa, PeoplePerson

underscore

Note-se que este método só irá converter palavras em formato camelCase.
Palavras que contenham espaços serão convertidas em minúsculas, mas sem
qualquer underscore.

applePie, algumaCoisa

apple\_pie, alguma\_coisa

humanize

apple\_pie, alguma\_coisa, people\_person

Apple Pie, Alguma Coisa, People Person

tableize

Apple, UserProfileSetting, Person, Pessoa

apples, user\_profile\_settings, people, pessoas

classify

apples, user\_profile\_settings, people, pessoas

Apple, UserProfileSetting, Person, Pessoa

variable

apples, user\_result, alguma\_coisa, people\_people

apples, userResult, algumaCoisa, peoplePeople

slug

Este método converte caracteres especiais em versões de caracteres
latinos, além de tratar caracteres sem correspondentes, bem como
converter espaços para underscores. O método slug uma entrada na
codificação UTF-8.

apple purée

apple\_puree

**N.T.:** Por padrão, os métodos da classe Inflector trabalham com
regras de pluralização do idioma inglês. Salvo casos especiais (plurais
irregulares), a conversão de uma palavra para seu plural dá-se apenas
com a adição da letra *-s* (sufixo indicador de plural) ao final da
palavra e que podem ser aplicar a algumas palavras da língua portuguesa
(como em laranja/laranjas) mas não a várias outras (como em
homem/homens).

As regras de pluralização são definidas no arquivo
app/config/inflections.php. O plugin
`cake\_ptbr <https://github.com/jrbasso/cake_ptbr/tree/master>`_ adiciona
(entre outras coisas) várias regras de pluralização para português do
Brasil.
