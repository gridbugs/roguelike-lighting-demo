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

;;; Fonts
(def ibm-font (font/font "IBM-BIOS" 16 1 -2))
(def gothic-font (font/font "GothicPixel" 24 1 -1))
(def gothic-font-bold (font/font "GothicPixel" 24 1 -1 :bold))
(def monospace-bold (font/font "Monospace" 16 3 -4 :bold))

;;; Colours
(def wood-foreground (rgb 0x33 0x23 0x01))
(def wood-background (rgb 0x66 0x46 0x02))

(build/task #(jsfile/create "tile_description.js" "TileDescription" {
  :tiles {

    :PlayerCharacter  (character "@" ibm-font colour/white)

    :Ground           (character "." ibm-font (rgb 0x2d 0x80 0x10) (rgb 0x06 0x31 0x0d))
    :StoneFloor       (character "." ibm-font (rgb 0x22 0x22 0x22) (rgb 0x44 0x44 0x44))
    :WoodWall         (character "#" ibm-font wood-foreground wood-background)
    :Window           (character "%" ibm-font (rgb 0xff 0xff 0xff) (rgb 0x50 0xe7 0xd3))
    :ClosedWoodenDoor (character "+" ibm-font wood-foreground wood-background)
    :OpenWoodenDoor   (character "-" ibm-font wood-foreground)
    :Tree             (character "&" ibm-font (rgb 0x2d 0x80 0x10))
    :Water            (character "~" ibm-font (rgb 0x22 0x88 0xcc) (rgb 0x00 0x44 0x88))
    :Rock             (character "*" ibm-font (rgb 0x22 0x22 0x22) (rgb 0x44 0x44 0x44))

    :Lamp             (character "£" ibm-font (rgb 0xcc 0xcc 0x00))

    :Unknown          (solid (rgb 0 0 0) :opaque #{})
    :OutOfBounds      (solid (rgb 0 0 0) :opaque #{})
    :NoTile           (solid (rgb 255 0 0) :opaque #{})

    :Yellow           (solid (rgba 0xff 0xff 0x00 0.25) :transparent #{:TRANSPARENCY_LEVELS})
  }
}))
