(ns tiles.font)

(defn font
  ([font-name font-size] (font font-name font-size 0 0))
  ([font-name font-size x-offset y-offset] (font font-name font-size x-offset y-offset false false))
  ([font-name font-size x-offset y-offset & options]
   {:name font-name
    :size font-size
    :xOffset x-offset
    :yOffset y-offset
    :bold (contains? (into #{} options) :bold)
    :italic (contains? (into #{} options) :italic)}))
