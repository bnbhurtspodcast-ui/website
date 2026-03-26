"use client"

import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
import { apiSpec } from "@/lib/api-spec"

export default function SwaggerPage() {
  return (
    <div style={{ colorScheme: "light", background: "#fff", minHeight: "100vh" }}>
      <SwaggerUI spec={apiSpec} />
    </div>
  )
}
