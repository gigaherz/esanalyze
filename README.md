esanalyze is a work in progress static analyzer for Javascript/ECMAScript.

So far, it detects some instances of uninitialized variable assignations,
assignations to a different type, and multiple declarations of the same name.

The long-term idea is to use flow analysis and type inference, together with
comment-based hints and precondition checks to keep track of function arguments,
return values, and even object interfaces.
