import { auth } from "@/auth"
import { use } from "react"
 
export const UserAvatar = async() => {
  const session = await auth()
 
  if (!session?.user) return null
 
  return (
    <div>
      <img
  src={session.user.image}
  alt="User Avatar"
  className="w-10 h-10 rounded-full"
/>
    </div>
  )
}

export const UserName = async() => {
  const session = await auth()
 
  if (!session?.user) return null
 
  return (
    <div>
      {session.user.name}
    </div>
  )
}