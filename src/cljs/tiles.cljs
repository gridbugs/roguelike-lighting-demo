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
(def dot types/dot)
(def solid types/solid)
(def image-sequence types/image-sequence)

(println (beautify (jsgen/convert {
  :defaultFontFace "IBM-BIOS"
  :defaultFontSize 16
  :defaultFontColour colour/black
  :defaultFontBackgroundColour colour/transparent
  :tiles (merge {

    :PlayerCharacter  (character "@" colour/black)
    :Zombie           (character "Z" "#3f3e0b")
    :Skeleton         (character "S" "#444444")
    :Bloat            (character "B" "#9a4500")

    :PileOfBones      (image "pile-of-bones.png" :transparent)

    :Unseen           (character " " colour/black colour/black)
    :Target           (image "target.png" :transparent)
    :Path             (image "path.png" :transparent)

    :WallTop          (image "wall-top.png")
    :WallFront        (image "wall-front.png")
    :WindowTop        (image "window-top.png")
    :WindowFront      (image "window-front.png")

    :Floor            (dot 4 "#b08c4c" "#d4b888")

    :Void             (character " " "#000000" "00003b")

    :HealthKit        (image "healthkit.png" :transparent)

    :Pistol           (image "pistol.png" :transparent)
    :Shotgun          (image "shotgun.png" :transparent)
    :MachineGun       (image "machinegun.png" :transparent)
    :Flamethrower     (image "flamethrower.png" :transparent)
    :RocketLauncher   (image "rocket-launcher.png" :transparent)

    :Bullet           (image "bullet.png" :transparent)
    :Rocket           (image "rocket.png" :transparent)
    :Fireball         (image "fireball.png" :transparent)
    :Door             (image "door.png" :transparent)
    :OpenDoor         (image "door-open.png" :transparent)
    :DownStairs       (image "down-stairs.png" :transparent)
    :UpStairs         (image "up-stairs.png" :transparent)
    :FireBackground   (image "fire-background.png" :transparent)

    :VacuumOverlay    (solid (rgba 0 0 255 0.3))
    :PressureWallOverlay  (solid (rgba 0 255 0 0.3))
    :VentingOverlay   (solid (rgba 255 0 0 0.3))
  }
  (image-sequence "HealthBar$$" "health-bar-$$.png" (range 0 9) :transparent)
  (image-sequence "Stars$$" "stars-$$.png" (range 0 4))
  (image-sequence "Teleport$$" "teleport-$$.png" (range 0 4))
)})))
