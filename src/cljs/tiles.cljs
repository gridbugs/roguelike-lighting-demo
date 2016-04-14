(ns script.tiles
  (:require [tiles.colour :as colour]
            [tiles.types :as types]
            [js.generate :as jsgen]))

(def beautify (js/require "js-beautify"))

;;; Shorthands
(def rgba colour/rgba)
(def rgb colour/rgb)

(def character types/character)
(def image types/image)

(println (beautify (jsgen/convert {
  :defaultFontFace "IBM-BIOS"
  :defaultFontSize 16
  :defaultFontColour colour/black
  :defaultFontBackgroundColour colour/transparent
  :tiles {

    :PlayerCharacter  (character "@" colour/black)
    :Zombie           (character "Z" "#3f3e0b")
    :Skeleton         (character "S" "#444444")
    :Bloat            (character "B" "#9a4500")

    :PileOfBones      (image "pile-of-bones.png" :transparent)

    :Unseen           (character " " colour/black colour/black)
    :Target           (image "target.png" :transparent)
    :Path             (image "path.png" :transparent)

    :WallTop          (image "wall-top.png")
  }
})))
