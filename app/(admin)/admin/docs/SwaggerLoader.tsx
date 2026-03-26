"use client"

import dynamic from "next/dynamic"

const SwaggerPage = dynamic(() => import("./SwaggerPage"), { ssr: false })

export default function SwaggerLoader() {
  return <SwaggerPage />
}
