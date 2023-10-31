import React, { useCallback } from "react"

interface JSONExplorerProps {
  data: JSONObject
  onSelect?: (keyPath: string, value: JSONPrimitive) => void
}

type JSONPrimitive = string | number | boolean | null
type JSONValue = JSONPrimitive | JSONObject | JSONArray
type JSONObject = { [member: string]: JSONValue }
interface JSONArray extends Array<JSONValue> {}

const INDENT_SIZE = 4

const JSONExplorer: React.FC<JSONExplorerProps> = ({ data, onSelect }) => {
  const handleKeyClick = useCallback(
    (keyPath: string, value: JSONPrimitive) => {
      onSelect?.(keyPath, value)
    },
    [onSelect]
  )

  // Helper to render the correct indentation
  const renderIndent = useCallback((numSpaces: number) => {
    const spaces = "&nbsp".repeat(numSpaces)
    return <span dangerouslySetInnerHTML={{ __html: spaces }} />
  }, [])

  const renderJSON = useCallback(
    (data: JSONObject, path = "", depth = 0) => {
      // Render array values
      if (Array.isArray(data)) {
        return (
          <span>
            {"["}
            {data.map((item, index) => (
              // since we don't know the format of the data, only stringifying the item can assure a unique key
              <div key={JSON.stringify(item)}>{renderJSON(item, `${path}[${index}]`, depth + 1)}</div>
            ))}
            {renderIndent(depth * INDENT_SIZE)}
            {"]"}
          </span>
        )

        // Render object keys
      } else if (typeof data === "object" && data !== null) {
        return (
          <div>
            {renderIndent(depth * INDENT_SIZE)}
            {"{"}
              {Object.keys(data).map((key) => {
              // If the keys value is either an object or an array, render it recursively, also only add styling and onClick if it's not a nested type
                const hasChildren = (typeof (data as JSONObject)[key] === "object" || Array.isArray((data as JSONObject)[key])) && (data as JSONObject)[key] !== null
                return (
                  <div key={key}>
                    {renderIndent((depth + 1) * INDENT_SIZE)}
                    <span
                      style={hasChildren ? {} : { color: "blue", cursor: "pointer" }}
                      onClick={() => {
                        if (hasChildren) return
                        // if path is root level, don't add a dot
                        handleKeyClick(path ? `${path}.${key}` : key, data[key] as JSONPrimitive)
                      }}>
                      "{key}"
                    </span>
                    {/* if path is root level, don't add a dot */}
                    : {renderJSON(data[key] as JSONObject, path ? `${path}.${key}` : key, depth + 1)},
                  </div>
                )
              })}
            {renderIndent(depth * INDENT_SIZE)}
            {"}"}
          </div>
        )
      } else {
        // render single values, stringify them to get the correct formatting (quotes for strings, no quotes for numbers or booleans)
        return <span>{JSON.stringify(data)}</span>
      }
    },
    [handleKeyClick, renderIndent]
  )

  return (
    <div>
      <pre>{renderJSON(data)}</pre>
    </div>
  )
}

export default JSONExplorer
