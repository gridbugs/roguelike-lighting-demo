(ns js.generate
  (:require [clojure.string :as str]))

(declare convert)

(defn convert-list [l]
  (str "[" (str/join ", " (map convert l)) "]"))

(defn convert-string [s]
  (str "'" s "'"))

(defn convert-keyword [k]
  (str "'" (name k) "'"))

(defn convert-map [m]
  (let [convert-key #(if (keyword? %) (name %) %)
        convert-kvp (fn [[k v]] (str (convert-key k) ": " (convert v)))]
       (str "{" (str/join ", " (map convert-kvp m)) "}")))

(defn convert [x]
  (cond (list? x) (convert-list x)
                  (vector? x)   (convert-list x)
                  (string? x)   (convert-string x)
                  (map? x)      (convert-map x)
                  (keyword? x)  (convert-keyword x)
                  (nil? x)      "null"
                  :else x))
