Inflector
#########

The Inflector class takes a string and can manipulate it to handle
word variations such as pluralizations or camelizing and is
normally accessed statically. Example:
``Inflector::pluralize('example')`` returns "examples".

Class methods
=============

Input
	Output
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
	It should be noted that underscore will only convert camelCase
	formatted words. Words that contains spaces will be lower-cased,
	but will not contain an underscore.
	
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
	Slug converts special characters into latin versions and converting
	unmatched characters and spaces to underscores. The slug method
	expects UTF-8 encoding.
	
	apple purée
	apple\_puree


.. todo::

	Add how to customize inflections, add slug mappings.