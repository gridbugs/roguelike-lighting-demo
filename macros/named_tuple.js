macroclass PARAM {
    pattern {
        rule { $name:ident = $init:expr } with $param = #{ $name = $init }
    }
    pattern {
        rule { $name:ident } with $param = #{ $name }
    }
}

macro NAMED_TUPLE {
    rule { ( $param:PARAM (,) ... ) } => {
        class {
            constructor($param$param (,) ...) {
                $(this.$param$name = $param$name;) ...
            }
        }
    }
}

export NAMED_TUPLE;
