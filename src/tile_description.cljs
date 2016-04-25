(ns script.tiles
  (:require [tiles.colour :as colour]
            [tiles.types :as types]
            [tiles.font :as font]
            [tiles.effect :as effect]
            [js.generate-file :as jsfile]
            [js.build-task :as build]))

;;; Shorthands
(def rgba colour/rgba)
(def rgb colour/rgb)

(def character types/character)
(def image types/image)
(def dot types/dot)
(def solid types/solid)
(def image-sequence types/image-sequence)

(def ibm-font (font/font "IBM-BIOS" 16 1 -2))
(def gothic-font (font/font "GothicPixel" 24 1 -1))
(def gothic-font-bold (font/font "GothicPixel" 24 1 -1 :bold))

(build/task #(jsfile/create "tile_description.js" "TileDescription" {
  :tiles {

    :PlayerCharacter  (character "@" ibm-font colour/black)

    :Ground           (character "." ibm-font (rgb 0x2d 0x80 0x3b) (rgb 0x06 0x31 0x0d))
    :Tree             (character "&" ibm-font (rgb 0x2d 0x80 0x3b))
    :Water            (character "~" ibm-font (rgb 0x22 0x88 0xcc) (rgb 0x00 0x44 0x88))
    :Rock             (character "*" ibm-font (rgb 0x22 0x22 0x22) (rgb 0x44 0x44 0x44))

    :Unseen           (solid (rgb 0 0 0) :opaque #{})
    :Yellow           (solid (rgba 0xff 0xff 0x00 0.25) :transparent #{:TRANSPARENCY_LEVELS})
  }
}))
