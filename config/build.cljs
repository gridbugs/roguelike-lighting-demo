;;; Build config file

(ns config.build)

(def config {

  ;; All paths are relative to the project root unless otherwise specified

  ;; Directory containing javascript source to be compiled
  :SOURCE_DIR     "src"

  ;; Directory containing static files (html, static javascript, static images)
  :STATIC_DIR     "static"

  ;; Directory containing images
  :IMAGE_DIR      "images"

  ;; Directory to store all output files
  :OUTPUT_DIR     "out"

  ;; Directory to store compiled source, relative to OUTPUT_DIR
  :OUTPUT_SOURCE_DIR "js"

  ;; Directory to store images in the output
  :OUTPUT_IMAGE_DIR "images"

  ;; Directory to store staging files during build process
  :STAGE_DIR      "stage"

  ;; File containing entry point, relative to SOURCE_DIR
  :ENTRY_FILE     "main.js"

  ;; File to serve by default, relative to OUTPUT_DIR
  :INDEX_FILE     "index.html"

  ;; Options passed to traceur determining what ES6/7 features to compile to ES5
  :TRACEUR_OPTS {
    :asyncFunctions true
    :classes true
    :generators true
    :arrowFunctions true
    :blockBinding true
    :forOf true
    :templateLiterals true
    :arrayComprehension true
    :sourceMaps "inline"
    :modules "amd"
  }

  ;; Default port to use for web server
  :DEFAULT_SERVER_PORT    8000

})
