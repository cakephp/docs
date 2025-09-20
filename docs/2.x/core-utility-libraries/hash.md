# Hash

`class` **Hash**

::: info Added in version 2.2
:::

Array management, if done right, can be a very powerful and useful
tool for building smarter, more optimized code. CakePHP offers a
very useful set of static utilities in the Hash class that allow you
to do just that.

CakePHP's Hash class can be called from any model or controller in
the same way Inflector is called. Example: `Hash::combine()`.

<a id="hash-path-syntax"></a>

## Hash path syntax

The path syntax described below is used by all the methods in `Hash`. Not all
parts of the path syntax are available in all methods. A path expression is
made of any number of tokens. Tokens are composed of two groups. Expressions,
are used to traverse the array data, while matchers are used to qualify
elements. You apply matchers to expression elements.

### Expression Types

| Expression | Definition                               |
|------------|------------------------------------------|
| `{n}`      | Represents a numeric key. Will match     
              any string or numeric key.                |
| `{s}`      | Represents a string. Will match any      
              string value including numeric string     
              values.                                   |
| `{*}`      | Represents any value regardless of type. |
| `Foo`      | Matches keys with the exact same value.  |

All expression elements are supported by all methods. In addition to expression
elements, you can use attribute matching with certain methods. They are `extract()`,
`combine()`, `format()`, `check()`, `map()`, `reduce()`,
`apply()`, `sort()`, `insert()`, `remove()` and `nest()`.

### Attribute Matching Types

| Matcher        | Definition                               |
|----------------|------------------------------------------|
| `[id]`         | Match elements with a given array key.   |
| `[id=2]`       | Match elements with id equal to 2.       |
| `[id!=2]`      | Match elements with id not equal to 2.   |
| `[id>2]`       | Match elements with id greater than 2.   |
| `[id>=2]`      | Match elements with id greater than      
                  or equal to 2.                            |
| `[id<2]`       | Match elements with id less than 2       |
| `[id<=2]`      | Match elements with id less than         
                  or equal to 2.                            |
| `[text=/.../]` | Match elements that have values matching 
                  the regular expression inside `...`.      |

Use matchers by appending them to the expression element (`{n}`, `{s}`, etc.) you wish to match.

So to return `id` fields where a `name` matches you can use paths using `{n}` and `{s}` to insert data into multiple
points:

``` php
$users = Array(
     Array(
        'id' => 123,
        'name'=> 'fred',
        'surname' => 'bloggs'
     ),
     Array(
        'id' => 245,
        'name' => 'fred',
        'surname' => 'smith'
     ),
     Array(
        'id' => 356,
        'name' => 'joe',
        'surname' => 'smith'
      )
   );     
$ids = Hash::extract($users, '{n}[name=fred].id');
// $ids will be array (123, 245)
```

::: info Changed in version 2.5
Matcher support was added to `insert()` and `remove()`.`get()` is a simplified version of `extract()`, it only supports direct path expressions. Paths with `{n}`, `{s}` or matchers are not supported. Use `get()` when you want exactly one value out of an array. The optional third argument will be returned if the requested path is not found in the array.`Hash::extract()` supports all expression, and matcher components of [Hash Path Syntax](#hash-path-syntax). You can use extract to retrieve data from arrays, along arbitrary paths quickly without having to loop through the data structures. Instead you use path expressions to qualify which elements you want returned :Inserts $data into an array as defined by `$path`:You can use paths using `{n}` and `{s}` to insert data into multiple points:Removes all elements from an array that match $path. :Using `{n}` and `{s}` will allow you to remove multiple values at once.Creates an associative array using a $keyPath as the path to build its keys, and optionally $valuePath as path to get the values. If $valuePath is not specified, or doesn't match anything, values will be initialized to null. You can optionally group the values by what is obtained when following the path specified in $groupPath. :You can provide array's for both $keyPath and $valuePath. If you do this, the first value will be used as a format string, for values extracted by the other paths:Returns a series of values extracted from an array, formatted with a format string:Determines if one Hash or array contains the exact keys and values of another:Checks if a particular path is set in an array:Filters empty elements out of array, excluding '0'. You can also supply a custom $callback to filter the array elements. Your callback should return `false` to remove elements from the resulting array:Collapses a multi-dimensional array into a single dimension:Expands an array that was previously flattened with `Hash::flatten()`:This function can be thought of as a hybrid between PHP's `array_merge` and `array_merge_recursive`. The difference to the two is that if an array key contains another array then the function behaves recursive (unlike `array_merge`) but does not do if for keys containing strings (unlike `array_merge_recursive`).Checks to see if all the values in the array are numeric:Counts the dimensions of an array. This method will only consider the dimension of the first element in the array:Similar to `~Hash::dimensions()`, however this method returns, the deepest number of dimensions of any element in the array:Creates a new array, by extracting $path, and mapping $function across the results. You can use both expression and matching elements with this method:Creates a single value, by extracting $path, and reducing the extracted results with $function. You can use both expression and matching elements with this method.Apply a callback to a set of extracted values using $function. The function will get the extracted values as the first argument.Sorts an array by any value, determined by a [Hash Path Syntax](#hash-path-syntax) Only expression elements are supported by this method:`$dir` can be either `asc` or `desc`. `$type` can be one of the following values:Computes the difference between two arrays:This function merges two arrays and pushes the differences in data to the bottom of the resultant array.**Example 1** :**Example 2** :Normalizes an array. If `$assoc` is true, the resulting array will be normalized to be an associative array. Numeric keys with values, will be converted to string keys with null values. Normalizing an array, makes using the results with `Hash::merge()` easier:Takes a flat array set, and creates a nested, or threaded data structure. Used by methods like `Model::find('threaded')`.**Options:**Example:
:::
