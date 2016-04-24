(ns tiles.types
  (:require [config.build :as buildconfig]
            [tiles.colour :as colour]
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
   {:type "character"
    :character ch
    :font font
    :colour colour
    :transparent (resolve-transparent transparent)
    :backgroundColour background-colour}))

(defn image
  ([path] (image path :opaque))
  ([path transparent]
   (let [fullpath (.join node-path (buildconfig/config :IMAGE_DIR) path)]
        {:type "image"
         :image fullpath
         :transparent (resolve-transparent transparent)})))

(defn dot
  ([size] (dot size colour/black))
  ([size colour] (dot size colour colour/transparent))
  ([size colour background-colour] (dot size colour background-colour :opaque))
  ([size colour background-colour transparent]
   {:type "dot"
    :size size
    :colour colour
    :transparent (resolve-transparent transparent)
    :backgroundColour background-colour}))

(defn solid
  ([colour] (solid colour :opaque))
  ([colour transparent]
   {:type "solid"
    :colour colour
    :transparent (resolve-transparent transparent)}))

(defn image-sequence
  ([pattern indices] (image-sequence pattern indices :opaque))
  ([pattern indices transparent]
   (map #(image (str/replace pattern "$$" %) transparent) indices)))
