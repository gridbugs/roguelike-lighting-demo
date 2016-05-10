(ns script.components
  (:require [js.build-task :as build]
            [js.ecs :as ecs]))

(build/task #(ecs/components "components/generated_components.js" [
  :Solid
  :Unfamiliar
  :Collider
  :Opacity    [:value]
  :Tile       [:family :depth]
  :Door       [:open :openTileFamily :closedTileFamily]
]))
