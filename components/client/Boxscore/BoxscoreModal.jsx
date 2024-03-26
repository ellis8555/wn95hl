"use client"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"

 function BoxscoreModal({ children }) {
  const router = useRouter()
  const dialogRef = useRef(null)

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  const closeModal = (e) =>
    e.target === dialogRef.current && router.back()

  return (
    <dialog
      ref={dialogRef}
      onClick={closeModal}
      onClose={router.back}
      className="w-10/12 lg:w-3/5 rounded-lg bg-slate-700 backdrop:bg-black/20 backdrop:backdrop-blur-sm"
    >
      <div>{children}</div>
    </dialog>
  )
}

export default BoxscoreModal;