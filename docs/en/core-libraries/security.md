# Security Utility

`class` Cake\\Utility\\**Security**

The [security library](https://api.cakephp.org/3.x/class-Cake.Utility.Security.html)
handles basic security measures such as providing methods for
hashing and encrypting data.

## Encrypting and Decrypting Data

`static` Cake\\Utility\\Security::**encrypt**($text, $key, $hmacSalt = null)

`static` Cake\\Utility\\Security::**decrypt**($cipher, $key, $hmacSalt = null)

Encrypt `$text` using AES-256. The `$key` should be a value with a
lots of variance in the data much like a good password. The returned result
will be the encrypted value with an HMAC checksum.

This method will use either [openssl](https://php.net/openssl) or [mcrypt](https://php.net/mcrypt) based on what is available on your system. Data
encrypted in one implementation is portable to the other.

> [!WARNING]
> The [mcrypt](https://php.net/mcrypt) extension has been deprecated in
> PHP7.1

This method should **never** be used to store passwords. Instead you should use
the one way hashing methods provided by
`Cake\Utility\Security::hash()`. An example use would be:

``` php
// Assuming key is stored somewhere it can be re-used for
// decryption later.
$key = 'wt1U5MACWJFTXGenFoZoiLwQGrLgdbHA';
$result = Security::encrypt($value, $key);
```

If you do not supply an HMAC salt, the `Security.salt` value will be used.
Encrypted values can be decrypted using
`Cake\Utility\Security::decrypt()`.

Decrypt a previously encrypted value. The `$key` and `$hmacSalt`
parameters must match the values used to encrypt or decryption will fail. An
example use would be:

``` php
// Assuming the key is stored somewhere it can be re-used for
// Decryption later.
$key = 'wt1U5MACWJFTXGenFoZoiLwQGrLgdbHA';

$cipher = $user->secrets;
$result = Security::decrypt($cipher, $key);
```

If the value cannot be decrypted due to changes in the key or HMAC salt
`false` will be returned.

<a id="force-mcrypt"></a>

### Choosing a Specific Crypto Implementation

If you are upgrading an application from CakePHP 2.x, data encrypted in 2.x is
not compatible with openssl. This is because the encrypted data is not fully AES
compliant. If you don't want to go through the trouble of re-encrypting your
data, you can force CakePHP to use `mcrypt` using the `engine()` method:

``` php
// In config/bootstrap.php
use Cake\Utility\Crypto\Mcrypt;

Security::engine(new Mcrypt());
```

The above will allow you to seamlessly read data from older versions of CakePHP,
and encrypt new data to be compatible with OpenSSL.

## Hashing Data

`static` Cake\\Utility\\Security::**hash**( $string, $type = NULL, $salt = false )

Create a hash from string using given method. Fallback on next
available method. If `$salt` is set to `true`, the application's salt
value will be used:

``` php
// Using the application's salt value
$sha1 = Security::hash('CakePHP Framework', 'sha1', true);

// Using a custom salt value
$sha1 = Security::hash('CakePHP Framework', 'sha1', 'my-salt');

// Using the default hash algorithm
$hash = Security::hash('CakePHP Framework');
```

The `hash()` method supports the following hashing strategies:

- md5
- sha1
- sha256

And any other hash algorithmn that PHP's `hash()` function supports.

> [!WARNING]
> You should not be using `hash()` for passwords in new applications.
> Instead you should use the `DefaultPasswordHasher` class which uses bcrypt
> by default.

## Getting Secure Random Data

`static` Cake\\Utility\\Security::**randomBytes**($length)

Get `$length` number of bytes from a secure random source. This function draws
data from one of the following sources:

- PHP's `random_bytes` function.
- `openssl_random_pseudo_bytes` from the SSL extension.

If neither source is available a warning will be emitted and an unsafe value
will be used for backwards compatibility reasons.

::: info Added in version 3.2.3
The randomBytes method was added.
:::

`static` Cake\\Utility\\Security::**randomString**($length)

Get a random string `$length` long from a secure random source. This method
draws from the same random source as `randomBytes()` and will encode the data
as a hexadecimal string.

::: info Added in version 3.6.0
The randomString method was added.
:::
