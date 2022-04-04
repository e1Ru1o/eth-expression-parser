@{%
const attrs = require("./attributes");
%}


@builtin "whitespace.ne" # `_` means arbitrary amount of whitespace


expression  ->  boolean                           


boolean     ->  boolean _ "&&" _ comparison                 {% attrs.and %}
            |   boolean _ "||" _ comparison                 {% attrs.or %}
            |   comparison


comparison  ->  arith _ "<=" _ arith                        {% attrs.lte %} 
            |   arith _ ">=" _ arith                        {% attrs.gte %} 
            |   arith _ "==" _ arith                        {% attrs.eq %} 
            |   arith _ "!=" _ arith                        {% attrs.neq %} 
            |   arith _ "<" _ arith                         {% attrs.lt %} 
            |   arith _ ">" _ arith                         {% attrs.gt %} 
            |   arith                                       


arith       ->  arith _ "+" _ term                          {% attrs.add %} 
            |   arith _ "-" _ term                          {% attrs.sub %} 
            |   term 


term        ->  term _ "*"  _ unary                         {% attrs.mul %} 
            |   term _ "/"  _ unary                         {% attrs.div %} 
            |   unary 


unary       ->  "!" _ unary                                 {% attrs.neg %} 
            |   atom


atom        ->  unit
            |   string
            |   variable
            |   number
            |   "true"i                                     {% attrs._true %}
            |   "false"i                                    {% attrs._false %}
            |   "(" _ expression _ ")"                      {% ([,,expr,,]) => expr %}
            |   atom _ index                                {% attrs.indexer %}
            |   atom _ "." _ name                           {% attrs.get %}
            |   atom _ "." _ name _ "(" _ ")"               {% attrs.call %}
            |   atom _ "." _ name _ "(" _ params _ ")"      {% attrs.callWithParams %}


unit        ->  (number | variable) _ "wei"i                {% attrs.wei %}
            |   (number | variable) _ "gwei"i               {% attrs.gwei %}
            |   (number | variable) _ "ether"i              {% attrs.ether %}


index       ->  "[" _ expression _ "]"                      {% ([,,index,,]) => [index] %}


params      ->  expression
            |   params _ "," _ expression                   {% ([otherParams,,,,lastParam]) => [...otherParams, lastParam] %}


string      -> "'" [^']:* "'"                               {% attrs.str %}


variable    ->  [_a-zA-Z] [_a-zA-Z0-9]:*                    {% attrs.variable %}


# same as variable but with a different attr
name        ->  [_a-zA-Z] [_a-zA-Z0-9]:*                    {% attrs.name %}


number      ->  [0-9]:+                                     {% attrs.num %}
            |   "0x" [0-9]:+                                {% attrs.num %}
            |   [0-9]:+ "e" [0-9]:+                         {% attrs.scientific %}
            |   "-" number                                  {% attrs.negnum %}

