# spmrc [![Build Status](https://travis-ci.org/spmjs/spmrc.png)](https://travis-ci.org/spmjs/spmrc)

The rc manager for spm.

----


```js
var spmrc = require('spmrc');
```

spmrc is located at `~/.spm/spmrc` in ini format. An example:

```
[user]
username = spm

[template:arale]
url = http://aralejs.org/hello
```


## spmrc.get

Get information in spmrc:

```js
spmrc.get('user')
// {username: 'spm'}

spmrc.get('user.username')
// spm
```

## spmrc.set

Set value in a section:

```js
spmrc.set('user.username', 'spmjs')
```

## spmrc.config

A mix of get and set:

```js
spmrc.config('user.username')  // equal spmrc.get
spmrc.config('user.username', 'spm')  // equal spmrc.set
```

## spmrc.parse

Parse an ini file to object. Default file is `~/.spm/spmrc`.

```js
spmrc.parse(file)
// an object
```

## spmrc.write

Write object to `~/.spm/spmrc`.

```js
spmrc.write(obj)
```

## Changelog

**2013-03-26** `0.1.3`

bugfix for windows. windows use `process.env.HOMEPATH`.

**2013-03-17** `0.1.2`

spmrc has `user.temp` default value.

**2013-03-17** `0.1.1`

spmrc has default values.

**2013-03-14** `0.1.0`

First version.
