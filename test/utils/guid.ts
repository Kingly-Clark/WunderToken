export function generateGUID(): string {
  function s4(): string {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  )
}

function hexToByte(hex: string): number {
  return parseInt(hex, 16)
}

export function guidToBytes16(guid: string): Uint8Array {
  const hexValues = guid.replace(/-/g, "") // Remove hyphens
  if (hexValues.length !== 32) {
    throw new Error("Invalid GUID format")
  }

  const bytes = new Uint8Array(16)
  for (let i = 0; i < 16; i++) {
    bytes[i] = hexToByte(hexValues.substr(i * 2, 2))
  }

  return bytes
}

export function bytes16ToHex(bytes: Uint8Array): string {
  return (
    "0x" +
    bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "")
  )
}
