import React from "react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <link rel="stylesheet" href="/css/admin.css" />
      </head>
      <div>{children}</div>
    </>
  )
}
