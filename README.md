esanalyze is a work in progress static analyzer for Javascript/ECMAScript.

So far, it detects some instances of uninitialized variable assignations,
assignations to a different type, and multiple declarations of the same name.

The long-term idea is to use flow analysis and type inference, together with
comment-based hints and precondition checks to keep track of function arguments,
return values, and even object interfaces.

Dependencies
------------

**[esprima](http://esprima.org/)**: esanalyze uses esprima as the default
parser, but any parser compatible with Mozilla's
[Parser API](https://developer.mozilla.org/en/SpiderMonkey/Parser_API) should
work instead.

**[eswalker](https://github.com/gigaherz/eswalker)**: esanalyze uses eswalker
to visit the AST nodes.
