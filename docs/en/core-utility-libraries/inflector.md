# Inflector

`class` **Inflector**

The Inflector class takes a string and can manipulate it to handle
word variations such as pluralizations or camelizing and is
normally accessed statically. Example:
`Inflector::pluralize('example')` returns "examples".

You can try out the inflections online at
[inflector.cakephp.org](https://inflector.cakephp.org/).

`static` Inflector::**pluralize**($singular)

- **Input:** Apple, Orange, Person, Man
- **Output:** Apples, Oranges, People, Men

> [!NOTE]
> `pluralize()` may not always correctly convert a noun that is already in
> it's plural form.

`static` Inflector::**singularize**($plural)

- **Input:** Apples, Oranges, People, Men
- **Output:** Apple, Orange, Person, Man

> [!NOTE]
> `singularize()` may not always correctly convert a noun that is already in
> it's singular form.

`static` Inflector::**camelize**($underscored)

- **Input:** Apple_pie, some_thing, people_person
- **Output:** ApplePie, SomeThing, PeoplePerson

`static` Inflector::**underscore**($camelCase)

It should be noted that underscore will only convert camelCase
formatted words. Words that contains spaces will be lower-cased,
but will not contain an underscore.

- **Input:** applePie, someThing
- **Output:** apple_pie, some_thing

`static` Inflector::**humanize**($underscored)

- **Input:** apple_pie, some_thing, people_person
- **Output:** Apple Pie, Some Thing, People Person

`static` Inflector::**tableize**($camelCase)

- **Input:** Apple, UserProfileSetting, Person
- **Output:** apples, user_profile_settings, people

`static` Inflector::**classify**($underscored)

- **Input:** apples, user_profile_settings, people
- **Output:** Apple, UserProfileSetting, Person

`static` Inflector::**variable**($underscored)

- **Input:** apples, user_result, people_people
- **Output:** apples, userResult, peoplePeople

`static` Inflector::**slug**($word, $replacement = '_')

Slug converts special characters into latin versions and converting
unmatched characters and spaces to underscores. The slug method
expects UTF-8 encoding.

- **Input:** apple purée
- **Output:** apple_puree

`static` Inflector::**reset**()

Resets Inflector back to its initial state, useful in testing.

`static` Inflector::**rules**($type, $rules, $reset = false)

Define new inflection and transliteration rules for Inflector to use.
See [Inflection Configuration](../development/configuration#inflection-configuration) for more information.
