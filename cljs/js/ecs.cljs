(ns js.ecs
  (:require [clojure.string :as str]
            [utils.string :as util-str]
            [js.generate :as jsgen]
            [js.generate-file :as jsfile]))

(def header-comment "Generated file. Do not edit.")

(def header-includes
  (str "import {Component} from 'engine/component';"
       "import {makeEnumInts} from 'utils/enum';"))

(defn component-js-constructor [component-name args]
  (str "constructor(" (jsgen/arg-list args) "){"
       "super();"
       (apply str (map #(str "this." % "=" % ";") args))
       "}"))

(defn component-js-wrapper [component-name arg]
  (str "get " arg "(){return this.fields["
       component-name ".Field."  (util-str/capitalise-first-letter arg) "];}"
       "set " arg "(value){this.fields["
       component-name ".Field."  (util-str/capitalise-first-letter arg) "]=value;}"))

(defn component-js-wrappers [component-name args]
  (apply str (map (partial component-js-wrapper component-name) args)))

(defn component-js-clone [component-name args]
  (str "clone(){return new " component-name
       "(" (str/join "," (map #(str "this." %) args)) ");}"))

(defn component-js-copy-to [component-name args]
  (str "copyTo(dest){super.copyTo(dest);"
       (apply str (map #(str "dest." % "=" "this." % ";") args))
       "}"))

(defn component-js [component-name args]
  (str "export class " component-name " extends Component {"
       (component-js-constructor component-name args)
       (component-js-wrappers component-name args)
       (component-js-clone component-name args)
       (component-js-copy-to component-name args)
       "}"
       component-name ".Field=makeEnumInts("
       (jsgen/arg-list (map #(str "'" % "'") (map util-str/capitalise-first-letter args)))
       ");"
       ))

(defn components-map [component-list]
  (loop [remaining component-list
         acc '()]
    (if (empty? remaining) (into {} acc)
        (let [[cname args & extra] remaining]
          (if (keyword? args) (recur (cons args extra) (cons [cname []] acc))
              (recur extra (cons [cname args] acc)))))))

(defn components-string [component-list]
  (let [component-defs (components-map component-list)]
    (str (jsgen/block-comment header-comment)
         header-includes
         (apply str (map #(component-js (name (% 0)) (map name (% 1)))
                         component-defs)))))

(defn components [path component-defs]
  (let [string (components-string component-defs)]
    (jsfile/create path string)))
