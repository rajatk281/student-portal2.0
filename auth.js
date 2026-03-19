import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import LinkedIn from "next-auth/providers/linkedin"
import { prisma } from "@/server/lib/prisma"
// import { PrismaAdapter } from "@auth/prisma-adapter"

export const { handlers, signIn, signOut, auth } = NextAuth({
  //adapter: PrismaAdapter(prisma),

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    LinkedIn({
      clientId: process.env.AUTH_LINKEDIN_ID,
      clientSecret: process.env.AUTH_LINKEDIN_SECRET,
    }),
  ],

  callbacks: {

    async signIn({ user }) {
      // console.log("running callback")
      try {
        // console.log("Attempting sign-in for:", user)

        if (!user?.email) {
          // console.log("No email found in user object:", user)
          return false
        }

        const existingUser = await prisma.student.findUnique({
          where: { email: user.email },
        })

        if (!existingUser) {
          await prisma.student.create({
            data: {
              email: user.email,
              username: user.name || "No Name",
            },
          })
        }

        return true
      } catch (error) {
        console.error("SIGNIN ERROR DETAILS:", error)
        return false
      }
    },
  },
})