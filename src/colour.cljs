(ns script.colour
  (:require [tiles.colour :as colour]
            [js.generate-file :as jsfile]
            [js.build-task :as build]))

(build/task #(jsfile/create-single "colour.js" "Colour" {
  :Transparent  colour/transparent
  :Black        colour/black
}))
