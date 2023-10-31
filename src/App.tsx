import { Box, Container, FormControl, FormLabel, Heading, Input, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import JSONExplorer from "./components/JsonExplorer"
import { getProp } from "./helper/getProp"

const jsonData = {
  date: "2021-10-27T07:49:14.896Z",
  hasError: false,
  test: 1234,
  fields: [
    {
      id: "4c212130",
      prop: "iban",
      value: "DE81200505501265402568",
      hasError: false
    }
  ]
}

function App() {
  const [path, setPath] = useState<string>("")
  const [value, setValue] = useState<string | number | boolean | undefined>("")

  // update value every time path changes (either by user typing into the field, or by clicking on a key in the JSONExplorer)
  useEffect(() => {
    setValue(getProp(jsonData, path) as string | number | boolean | undefined)
  }, [path])

  return (
    <Container maxW={"container.lg"} pt={5}>
      <Heading as="h1">JSON Viewer</Heading>
      <FormControl>
        <FormLabel>Property</FormLabel>
        <Input placeholder="data.fields[0].id" value={path} onChange={(e) => setPath(e.target.value)} />
      </FormControl>
      <Text size="sm" color="blackAlpha.600">{String(value)}</Text>
      <Box border="1px solid" borderColor={"blackAlpha.300"} borderRadius={"lg"} p="3">
      <JSONExplorer data={jsonData} onSelect={(path) => setPath(path)}/>
      </Box>
    </Container>
  )
}

export default App
