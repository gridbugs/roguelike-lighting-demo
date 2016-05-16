macroclass PARAM {
    pattern {
        rule { $name:ident = $init:expr } with $param = #{ $name = $init }
    }
    pattern {
        rule { $name:ident } with $param = #{ $name }
    }
}

macro CAPITALISE_STR {
    case { _ ( $id ) } => {
        letstx $capid = [
            makeValue(
                unwrapSyntax(#{ $id }).replace(/^(.)/, function(x) {return x.toUpperCase()}),
                #{here}
            )
        ];
        return #{ $capid };
    }
}

macro CAPITALISE_ID {
    case { _ ( $id ) } => {
        letstx $capid = [
            makeIdent(
                unwrapSyntax(#{ $id }).replace(/^(.)/, function(x) {return x.toUpperCase()}),
                #{here}
            )
        ];
        return #{ $capid };
    }
}

macro ARRAY_TUPLE {
    rule { ( EXTENDS ( $parent:expr ) ) } => {
        class ArrayTuple extends $parent {
            constructor() {
                super();
                this.fields = new Array(0);
            }
        }
    }
    rule { ( EXTENDS ( $parent:expr ) ,  $param:PARAM (,) ... ) } => {
        (function(fieldNames) {
            return (function(cl) {
                for (var i = 0; i < fieldNames.length; ++i) {
                    cl[fieldNames[i]] = i;
                }
                return cl;
            })(
                class ArrayTuple extends $parent {
                    constructor($param$param (,) ...) {
                        super();
                        this.fields = new Array(fieldNames.length);
                        $(this.$param$name = $param$name;) ...
                    }

                    $(get $param$name() {
                        return this.fields[ArrayTuple.CAPITALISE_ID($param$name)];
                    }) ...

                    $(set $param$name(value) {
                        this.fields[ArrayTuple.CAPITALISE_ID($param$name)] = value;
                    }) ...

                    clone() {
                        return new ArrayTuple($[...]this.fields);
                    }

                    copyTo(dest) {
                        super.copyTo(dest);
                        for (var i = 0; i < this.fields.length; ++i) {
                            dest.fields[i] = this.fields[i];
                        }
                    }
                }
            )
        })([$(CAPITALISE_STR($param$name)) (,) ...])
    }
    rule { ( $param (,) ... ) } => { ARRAY_TUPLE ( EXTENDS ( Object ) , $($param) (,) ... ) }
}

export ARRAY_TUPLE;
