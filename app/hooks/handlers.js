"use server"

import { signIn } from "@/auth"

export const handleGoogleSignIn = async () => {
    // console.log("clicked")
    await signIn("google", {
        redirectTo: "/student"
    })
}   
export const handleLinkedInSignIn = async () => {
    // console.log("clicked")
    await signIn("linkedin", {
        redirectTo: "/student"
    })
}
export const handleGitHubSignIn = async () => {
    // console.log("clicked")
    await signIn("github", {
        redirectTo: "/student"
    })
}