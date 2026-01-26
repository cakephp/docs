# Data Sanitization

The `Sanitize` class is deprecated as of 2.4, and will be removed in CakePHP
3.0. Instead of using the Sanitize class you can accomplish the same tasks using
other parts of CakePHP, native PHP functions, or other libraries.

## Input filtering

Instead of using the destructive input filtering features of Sanitize class you
should instead apply more thorough [Data Validation](../models/data-validation) to the user
data your application accepts. By rejecting invalid input you can often remove the
need to destructively modify user data. You might also want to look at
[PHP's filter extension](https://www.php.net/filter) in situations you need to
modify user input.

## Accepting user submitted HTML

Often input filtering is used when accepting user-submitted HTML. In these
situations it is best to use a dedicated library like [HTML Purifier](https://htmlpurifier.org/).

## SQL Escaping

CakePHP handles SQL escaping on associated array values provided to
`Model::find()` and `Model::save()`. In the rare case you
need to construct SQL by hand using user input you should use
[Prepared Statements](../models/retrieving-your-data#prepared-statements).
