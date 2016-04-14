(ns tiles.types
  (:require [config.build :as buildconfig]
            [clojure.string :as str]))

(def node-path (js/require "path"))

(defn character
  ([ch]
   {:type "character" :character ch})
  ([ch colour]
   (assoc (character ch) :colour colour))
  ([ch colour background-color]
   (assoc (character ch colour) :backgroundColour background-color))
  ([ch colour background-color font-face]
   (assoc (character ch colour background-color) :fontFace font-face))
  ([ch colour background-color font-face font-size]
   (assoc (character ch colour background-color font-face) :fontSize font-size)))

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

(defn dot [size colour background-color]
  {:type "dot" :colour colour :backgroundColour background-color})

(defn solid [colour] {:type "solid" :colour colour})

(defn image-sequence
  ([key-pattern file-pattern indices]
   (image-sequence key-pattern file-pattern indices :opaque))
  ([key-pattern file-pattern indices transparent]
   (into {} (map
              (fn [i] [(keyword (str/replace key-pattern "$$" i))
                       (image
                         (str/replace file-pattern "$$" i)
                         transparent)])
              indices))))
