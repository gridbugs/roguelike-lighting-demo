(ns script.components
  (:require [js.build-task :as build]
            [js.ecs :as ecs]))

(build/task #(ecs/components "generated/components.js" [
  :Solid
  :Opacity    [:value]
  :Tile       [:family :depth]
]))
