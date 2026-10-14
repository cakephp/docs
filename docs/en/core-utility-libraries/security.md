# Security

`class` **Security**

The [security library](https://api.cakephp.org/2.x/class-Security.html)
handles basic security measures such as providing methods for
hashing and encrypting data.

> [!IMPORTANT]
> By default `Security::encrypt()` and `Security::decrypt()` use the `mcrypt`
> extension, which has not been bundled with PHP since PHP 7.2. Enable OpenSSL
> in `config/core.php` instead:
>
> ``` php
> Configure::write('Security.useOpenSsl', true);
> ```
>
> Applications created from the [pieceofcake2/app](https://pieceofcake2.github.io/app/)
> skeleton (v2.3.1 and later) already have this line. Add it to existing
> applications.
>
> The OpenSSL implementation produces the same format as the `mcrypt` one, so
> values encrypted earlier can still be decrypted. `Security::rijndael()` has no
> OpenSSL implementation and always requires `mcrypt`.

## Security API

`static` Security::**cipher**( $text, $key )

Return type: `string`

Encrypts/Decrypts text using the given key:

``` php
// Encrypt your text with my_key
$secret = Security::cipher('hello world', 'my_key');

// Later decrypt your text
$nosecret = Security::cipher($secret, 'my_key');
```

> [!WARNING]
> `cipher()` uses a **weak** XOR cipher and should **not** be used.
> It is only included for backwards compatibility. It is also used by the
> default `'cipher'` encryption type of `CookieComponent`; use the `'aes'`
> type instead (see [Security Fixes](/appendices/security-fixes)).

`static` Security::**rijndael**($text, $key, $mode)

- `string $text`: The text to encrypt
- `string $key`: The key to use for encryption. This must be longer than
  32 bytes.
- `string $mode`: The mode to use, either 'encrypt' or 'decrypt'

Encrypts/Decrypts text using the rijndael-256 cipher. This requires the
[mcrypt extension](https://pecl.php.net/package/mcrypt) to be installed from
PECL. For new code, prefer `Security::encrypt()` and `Security::decrypt()` with
`Security.useOpenSsl` enabled. Usage looks like this:

``` php
// Encrypt some data.
$encrypted = Security::rijndael('a secret', Configure::read('Security.key'), 'encrypt');

// Later decrypt it.
$decrypted = Security::rijndael($encrypted, Configure::read('Security.key'), 'decrypt');
```

`rijndael()` can be used to store data you need to decrypt later, like the
contents of cookies. It should **never** be used to store passwords.
Instead you should use the one way hashing methods provided by
`Security::hash()`

::: info Added in version 2.2
`Security::rijndael()` was added in 2.2.
:::

`static` Security::**encrypt**($text, $key, $hmacSalt = null)

- `string $plain`: The value to encrypt.
- `string $key`: The 256 bit/32 byte key to use as a cipher key.
- `string $hmacSalt`: The salt to use for the HMAC process. Leave null to use Security.salt.

Encrypt `$text` using AES-256. The `$key` should be a value with a
lots of variance in the data, much like a good password. The returned result
will be the encrypted value with an HMAC checksum.

This method should **never** be used to store passwords. Instead you should
use the one way hashing methods provided by `Security::hash()`.
An example use would be:

``` php
// Assuming key is stored somewhere it can be re-used for
// decryption later.
$key = 'wt1U5MACWJFTXGenFoZoiLwQGrLgdbHA';
$result = Security::encrypt($value, $key);
```

Encrypted values can be decrypted using `Security::decrypt()`.

::: info Added in version 2.5
:::

::: info Changed in version 2.10.8
Set `Security.useOpenSsl` to use OpenSSL instead of the `mcrypt` extension.
:::

`static` Security::**decrypt**($cipher, $key, $hmacSalt = null)

- `string $cipher`: The ciphertext to decrypt.
- `string $key`: The 256 bit/32 byte key to use as a cipher key.
- `string $hmacSalt`: The salt to use for the HMAC process. Leave null to use Security.salt.

Decrypt a previously encrypted value. The `$key` and `$hmacSalt`
parameters must match the values used to encrypt or decryption will fail. An
example use would be:

``` php
// Assuming key is stored somewhere it can be re-used for
// decryption later.
$key = 'wt1U5MACWJFTXGenFoZoiLwQGrLgdbHA';

$cipher = $user['User']['secrets'];
$result = Security::decrypt($cipher, $key);
```

If the value cannot be decrypted due to changes in the key or HMAC salt
`false` will be returned.

::: info Added in version 2.5
:::

::: info Changed in version 2.10.8
Set `Security.useOpenSsl` to use OpenSSL instead of the `mcrypt` extension.
:::

`static` Security::**hash**( $string, $type = NULL, $salt = false )

Return type: `string`

Create a hash from a string using given method or fallback to next
available method. If `$salt` is set to true, the applications salt
value will be used:

``` php
// Using the application's salt value
$sha1 = Security::hash('CakePHP Framework', 'sha1', true);

// Using a custom salt value
$md5 = Security::hash('CakePHP Framework', 'md5', 'my-salt');

// Using the default hash algorithm
$hash = Security::hash('CakePHP Framework');
```

`hash()` also supports other secure hashing algorithms like bcrypt. When
using bcrypt, you should be mindful of the slightly different usage.
Creating an initial hash works the same as other algorithms:

``` php
// Create a hash using bcrypt
Security::setHash('blowfish');
$hash = Security::hash('CakePHP Framework');
```

Unlike other hash types comparing plain text values to hashed values should
be done as follows:

``` php
// $storedPassword, is a previously generated bcrypt hash.
$newHash = Security::hash($newPassword, 'blowfish', $storedPassword);
```

When comparing values hashed with bcrypt, the original hash should be
provided as the `$salt` parameter. This allows bcrypt to reuse the same
cost and salt values, allowing the generated hash to return the same
resulting hash, given the same input value.

::: info Changed in version 2.3
Support for bcrypt was added in 2.3
:::

`static` Security::**setHash**( $hash )

Return type: `void`

Sets the default hash method for the Security object. This
affects all objects using Security::hash().
