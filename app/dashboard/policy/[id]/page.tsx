"use client"

import { use } from "react"
import PoliciesForm from "../policy-form"

export default function EditPolicyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <PoliciesForm mode="edit" policyId={id} />
}


