(ns js.generate-file
  (:require [js.generate :as jsgen]
            [config.build :as buildconfig]))

(def fs (js/require "fs"))
(def path (js/require "path"))
(def beautify (js/require "js-beautify"))

(def header-comment "Generated file. Do not edit.")
(def js-stage-dir (.join path (buildconfig/config :STAGE_DIR) (buildconfig/config :JS_DIR)))

(defn create [filename varname value]
  (let [contents (str "/* " header-comment " */"
                      "export const " varname " = "
                      (jsgen/convert value))
        pretty-contents (beautify contents)
        file-path (.join path js-stage-dir filename)]
       (.writeFile fs file-path pretty-contents)))
