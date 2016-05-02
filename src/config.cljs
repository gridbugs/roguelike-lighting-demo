(ns script.config
  (:require [js.generate-file :as jsfile]
            [js.build-task :as build]))

(build/task #(jsfile/create "config.js" "Config" {
  :TILE_WIDTH   16
  :TILE_HEIGHT  16
  :GRID_WIDTH   64
  :GRID_HEIGHT  40
  :DEPTH        3
  :DEBUG        false
  :RNG_SEED     nil
  :OMNISCIENT   false
  :DEMO         true
  :AI           true

  ; Optimization where cells track their last updated time, and this
  ; is used by the observation system to determine if it needs to
  ; update a character's knowledge of a cell.
  :LAZY_KNOWLEDGE true
}))
