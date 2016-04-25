(ns script.effect
  (:require [tiles.effect :as effect]
            [js.generate-file :as jsfile]
            [js.build-task :as build]))

(build/task #(jsfile/create "effect.js" "Effect" {
  :All      effect/all-effects
  :Default  effect/default-effects
  :None     #{}
  :Type     (apply merge (map (fn [x] {x x}) effect/all-effects))
}))
