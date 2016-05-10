(ns js.generate-file
  (:require [js.generate :as jsgen]
            [config.build :as buildconfig]))

(def fs (js/require "fs"))
(def path (js/require "path"))
(def beautify (js/require "js-beautify"))

(defn file-exists? [path]
  (try
    (do (.accessSync fs path (aget fs "F_OK"))
        true)
    (catch js/Error err false)))

(defn mkdir-lazy [path]
  (if (file-exists? path) nil
      (do
        (.mkdirSync fs path))))

(def header-comment "Generated file. Do not edit.")
(def js-stage-dir (.join path (buildconfig/config :STAGE_DIR) (buildconfig/config :JS_SOURCE_DIR)))

(defn create [filename contents]
  (let [pretty-contents (beautify contents)
        file-path (.join path js-stage-dir filename)]
    (do
      (mkdir-lazy (.dirname path file-path))
      (.writeFileSync fs file-path pretty-contents)
      pretty-contents)))

(defn create-single [filename varname value]
  (let [contents (str (jsgen/block-comment header-comment)
                      "export const " varname " = "
                      (jsgen/convert value))]
    (create filename contents)))
