(ns tiles.types
  (:require [config.build :as buildconfig]
            [tiles.colour :as colour]
            [tiles.effect :as effect]
            [clojure.string :as str]))

(def node-path (js/require "path"))

(defn resolve-transparent [transparent]
  (if (keyword? transparent)
      (cond (= transparent :transparent) true
            (= transparent :opaque) false
            :else false)
      (boolean transparent)))

(defn character
  ([ch font]
   (character ch font colour/black :transparent))
  ([ch font colour]
   (character ch font colour colour/transparent :transparent))
  ([ch font colour background-colour]
   (character ch font colour background-colour :opaque))
  ([ch font colour background-colour transparent]
   (character ch font colour background-colour transparent effect/default-effects))
  ([ch font colour background-colour transparent effects]
   {:type "character"
    :character ch
    :font font
    :colour colour
    :transparent (resolve-transparent transparent)
    :backgroundColour background-colour
    :effects effects}))

(defn image
  ([path] (image path :opaque))
  ([path transparent] (image path transparent effect/default-effects))
  ([path transparent effects]
   (let [fullpath (.join node-path (buildconfig/config :IMAGE_DIR) path)]
        {:type "image"
         :image fullpath
         :transparent (resolve-transparent transparent)
         :effects effects})))

(defn dot
  ([size] (dot size colour/black))
  ([size colour] (dot size colour colour/transparent))
  ([size colour background-colour] (dot size colour background-colour :opaque))
  ([size colour background-colour transparent] (dot colour background-colour transparent effect/default-effects))
  ([size colour background-colour transparent effects]
   {:type "dot"
    :size size
    :colour colour
    :transparent (resolve-transparent transparent)
    :backgroundColour background-colour
    :effects effects}))

(defn solid
  ([colour] (solid colour :opaque))
  ([colour transparent] (solid colour transparent effect/default-effects))
  ([colour transparent effects]
   {:type "solid"
    :colour colour
    :transparent (resolve-transparent transparent)
    :effects effects}))

(defn image-sequence
  ([pattern indices] (image-sequence pattern indices :opaque))
  ([pattern indices transparent] (image-sequence pattern indices transparent effect/default-effects))
  ([pattern indices transparent effects]
   (map #(image (str/replace pattern "$$" %) transparent effects) indices)))
