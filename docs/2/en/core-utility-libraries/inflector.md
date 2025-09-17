# Inflector

`class` **Inflector**

The Inflector class takes a string and can manipulate it to handle
word variations such as pluralizations or camelizing and is
normally accessed statically. Example:
`Inflector::pluralize('example')` returns "examples".

You can try out the inflections online at
[inflector.cakephp.org](https://inflector.cakephp.org/).

> - **Input:** Apple, Orange, Person, Man
> - **Output:** Apples, Oranges, People, Men

> [!NOTE]
> `pluralize()` may not always correctly convert a noun that is already in
> it's plural form.
>
> - **Input:** Apples, Oranges, People, Men
> - **Output:** Apple, Orange, Person, Man

> [!NOTE]
> `singularize()` may not always correctly convert a noun that is already in
> it's singular form.
>
> - **Input:** Apple_pie, some_thing, people_person
> - **Output:** ApplePie, SomeThing, PeoplePerson
>
> It should be noted that underscore will only convert camelCase
> formatted words. Words that contains spaces will be lower-cased,
> but will not contain an underscore.
>
> - **Input:** applePie, someThing
> - **Output:** apple_pie, some_thing
> - **Input:** apple_pie, some_thing, people_person
> - **Output:** Apple Pie, Some Thing, People Person
> - **Input:** Apple, UserProfileSetting, Person
> - **Output:** apples, user_profile_settings, people
> - **Input:** apples, user_profile_settings, people
> - **Output:** Apple, UserProfileSetting, Person
> - **Input:** apples, user_result, people_people
> - **Output:** apples, userResult, peoplePeople
>
> Slug converts special characters into latin versions and converting
> unmatched characters and spaces to underscores. The slug method
> expects UTF-8 encoding.
>
> - **Input:** apple purée
> - **Output:** apple_puree
>
> Resets Inflector back to its initial state, useful in testing.
>
> Define new inflection and transliteration rules for Inflector to use.
> See [Inflection Configuration](../development/configuration#inflection-configuration) for more information.
