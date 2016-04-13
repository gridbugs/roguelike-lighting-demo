(ns js.build-task)

(defn task [form]
  (fn [callback]
    (let [result (form)
          error nil]
         (callback error result))))

