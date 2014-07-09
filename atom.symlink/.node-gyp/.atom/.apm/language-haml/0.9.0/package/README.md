
language-haml
=============
HAML language grammar for GitHub's Atom IDE.

![screenshot](http://ridingtheclutch.com.s3.amazonaws.com/images/language-haml.png)

## Supported Filetypes

* .haml
* .hamlc (CoffeeScript HAML)

## Supported filters

You can switch to another language right in the middle of your HAML file by
using a "filter":

![screenshot](http://ridingtheclutch.com.s3.amazonaws.com/images/haml_filters.png)

This HAML bundle currently supports the following filters:

* :javascript
* :css
* :sass (CoffeeScript HAML not supported)

The HAML documentation lists the following additional filters:

* :cdata
* :coffee
* :erb
* :escaped
* :less
* :markdown
* :plain
* :preserve
* :ruby
* :scss
* :textile

To add more you can simply copy and paste one of the captures in the `ruby haml.cson` file
and make the changes necessary to support your filter of choice:

```cson
{
  'begin': '^(\\s*)(:css)'
  'beginCaptures':
    '2':
      'name': 'entity.name.tag.haml'
  'end': '^(?! *$|\\1 )'
  'name': 'source.css.embedded.html'
  'patterns': [
    {
      'include': 'source.css'
    }
  ]
}
```

Send a pull request and I'll get it into the repo ASAP!

LONG LIVE HAML!
