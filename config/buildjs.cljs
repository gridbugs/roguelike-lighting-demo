;;; A  wrapper of the build config file that converts the config
;;; map into a javascript object for use in the build script

(ns config.buildjs
  (:require [config.build]))

(clj->js config.build/config)
