var mutate = require('xtend/mutable')
var tables = /^CREATE TABLE `([^`]+)`.*$/
var columns = /^`([^`]+)`.*$/

module.exports = lazy

function lazy (input) {
  var output = {}
  var table, column, match, changed

  function parse (input) {
    var lines = input.split(/\r?\n/)

    lines.forEach(function (line, i) {
      if (!(line = line.trim())) return changed = true

      if (changed) {
        if (match = line.match(tables)) changed = !changed
        return match && (table = match[1])
      }

      if (!table) return
      output[table] = output[table] || {}
      if (column = values(line)) mutate(output[table], column)
    })

    return output
  }

  parse.output = output
  return input ? parse(input) : parse
}

function values (line) {
  if (!columns.test(line)) return false
  var parts = line.split(/\s+/)
  var name = parts[0].slice(1, -1)
  var column = {}
  column[name] = type(parts[1])
  return column
}

function type (t) {
  var first = t.split(/\b/)[0]
  if (/(int|float|fixed|double|dec)/.test(first)) return 'number'
  if (/(text|char|enum)/.test(first)) return 'string'
  if (/(date|timestamp)/.test(first)) return 'date'
  return first
}
