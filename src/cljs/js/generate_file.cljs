(ns js.generate-file
  (:require [js.generate :as jsgen]
            [config.build :as buildconfig]))

(def fs (js/require "fs"))
(def path (js/require "path"))
(def beautify (js/require "js-beautify"))

(defn create [filename varname value]
  (let [contents (str "export const "
                      varname
                      " = "
                      (jsgen/convert value))
        pretty-contents (beautify contents)
        file-path (.join path
                         (buildconfig/config :STAGE_DIR)
                         filename)]
       (.writeFile fs file-path pretty-contents)))
