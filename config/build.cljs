;;; Build config file

(ns config.build)

(def config {

  :DEFAULT_SERVER_PORT    8000

  :OUTPUT_DIR     "build"
  :SOURCE_DIR     "src"
  :ENTRY_FILE     "main.js"
  :INDEX_FILE     "index.html"

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
})
