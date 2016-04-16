(ns tiles.types
  (:require [config.build :as buildconfig]
            [tiles.colour :as colour]
            [clojure.string :as str]))

(def node-path (js/require "path"))

(defn character
  ([ch]
   (character ch colour/black colour/transparent))
  ([ch colour]
   (character ch colour colour/transparent))
  ([ch colour background-color]
   {:type "character" :character ch :colour colour :backgroundColour background-colour}))

(defn image
  ([path transparent]
   (let [fullpath (.join node-path (buildconfig/config :IMAGE_DIR) path)
         base {:type "image" :image fullpath}]
        (merge base (if (keyword? transparent)
                        (cond (= transparent :transparent)  {:transparent true}
                              (= transparent :opaque)       {:transparent false}
                              :else {})
                        {:transparent (boolean transparent)}))))
  ([path] (image path false)))

(defn dot [size colour background-colour]
  {:type "dot" :size size :colour colour :backgroundColour background-colour})

(defn solid [colour] {:type "solid" :colour colour})

(defn image-sequence
  ([pattern indices] (image-sequence pattern indices :opaque))
  ([pattern indices transparent]
   (map #(image (str/replace pattern "$$" %) transparent) indices)))
