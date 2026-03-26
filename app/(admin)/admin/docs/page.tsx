import type { Metadata } from "next"
import SwaggerLoader from "./SwaggerLoader"

export const metadata: Metadata = {
  title: "API Reference",
}

export default function DocsPage() {
  return <SwaggerLoader />
}
