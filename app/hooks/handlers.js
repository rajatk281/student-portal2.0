"use server"

import { signIn } from "@/auth"

export const handleGoogleSignIn = async () => {
    console.log("clicked")
    await signIn("google", {
        callbackUrl: "/student"
    })
}   
export const handleLinkedInSignIn = async () => {
    console.log("clicked")
    await signIn("linkedin", {
        callbackUrl: "/student"
    })
}   
export const handleGitHubSignIn = async () => {
    console.log("clicked")
    await signIn("github", {
        callbackUrl: "/student"
    })
}