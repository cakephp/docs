Inflector
#########

Inflector
クラスは文字列を扱い、複数形やキャメル記法といったように単語のバリエーションをハンドルする操作を行うもので、スタティックにアクセスできます。例えば、
``Inflector::pluralize('example')``
というコードは「examples」を返します。

クラスのメソッド
================

 

入力

出力

pluralize

Apple, Orange, Person, Man

Apples, Oranges, People, Men

singularize

Apples, Oranges, People, Men

Apple, Orange, Person, Man

camelize

Apple\_pie, some\_thing, people\_person

ApplePie, SomeThing, PeoplePerson

underscore

アンダースコアが含まれるように変換されるのは、キャメル記法で書かれた単語のみ(たとえば「camelCase」というようなもの)であることに注意してください。スペースを含むものは小文字に変換はされますが、アンダースコアは含みません。

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

Slug
は特殊な文字を同等なラテン文字に変換し、同等のラテン文字が無いものとスペースはアンダースコアに変換します。また、
slug メソッドはエンコーディングが UTF-8 であることを期待します。

apple purée

apple\_puree
