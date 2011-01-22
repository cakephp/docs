6.3.4 Conclusion
----------------

From now on each record update/creation will cause
TranslateBehavior to copy the value of "name" to the translation
table (default: i18n) along with the current locale. A locale is
the identifier of the language, so to speak.

The *current locale* is the current value of
``Configure::read('Config.language')``. The value of
*Config.language* is assigned in the L10n Class - unless it is
already set. However, the TranslateBehavior allows you to override
this on-the-fly, which allows the user of your page to create
multiple versions without the need to change his preferences. More
about this in the next section.
