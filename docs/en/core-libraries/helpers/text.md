# TextHelper

`class` **TextHelper**(View $view, array $settings = array())

The TextHelper contains methods to make text more usable and
friendly in your views. It aids in enabling links, formatting URLs,
creating excerpts of text around chosen words or phrases,
highlighting key words in blocks of text, and gracefully
truncating long stretches of text.

::: info Changed in version 2.1
Several `TextHelper` methods have been moved into the `String` class to allow easier use outside of the `View` layer. Within a view, these methods are accessible via the TextHelper class. You can call one as you would call a normal helper method: `$this->Text->method($args);`.
:::

`method` TextHelper::**autoLinkEmails**(string $text, array $options=array())

`method` TextHelper::**autoLinkUrls**(string $text, array $options=array())

`method` TextHelper::**autoLink**(string $text, array $options=array())

`method` TextHelper::**autoParagraph**(string $text)

<!--@include: ../../core-utility-libraries/string.md{115,131}-->
