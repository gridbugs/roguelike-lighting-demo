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
    rule { ( $param:PARAM (,) ... ) } => {
        (function(fieldNames) {
            return (function(cl) {
                for (var i = 0; i < fieldNames.length; ++i) {
                    console.debug(fieldNames[i], i);
                    cl[fieldNames[i]] = i;
                }
                return cl;
            })(
                class ArrayTuple {
                    constructor($param$param (,) ...) {
                        this.fields = new Array(fieldNames.length);
                        $(this.$param$name = $param$name;) ...
                    }

                    $(get $param$name() {return this.fields[ArrayTuple.CAPITALISE_ID($param$name)];}) ...
                    $(set $param$name(value) {this.fields[ArrayTuple.CAPITALISE_ID($param$name)] = value;}) ...
                }
            )
        })([$(CAPITALISE_STR($param$name)) (,) ...])
    }
}

export ARRAY_TUPLE;
