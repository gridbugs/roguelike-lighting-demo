(ns utils.string
  (:require [clojure.string :as str]))

(defn capitalise-first-letter [s]
  (let [[first-char & remaining-chars] (str/split s "")]
    (str (str/upper-case first-char) (apply str remaining-chars))))
