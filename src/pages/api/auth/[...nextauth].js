import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getSession } from "next-auth/react";
import clientPromise from "@/lib/mongodb";

export const authOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                email: { type: "text" },
                password: { type: "password" },
            },

            async authorize(credentials, req) {
                const { email, password } = credentials;

                try {
                    const client = await clientPromise;
                    const db = client.db();
                    const admin = await db
                        .collection("users")
                        .findOne({ email });
                        
                    if (!admin) {
                        return null;
                    }

                    if (password) {
                        if (password === admin.password) {
                            return admin;
                        } else {
                            return null;
                        }
                    } else {
                        return null;
                    }
                } catch (error) {
                    console.log(error);
                }
            },
        }),
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token._id = user._id;
                token.email = user.email;
                token.role = user.role;
                token.accessToken = user.token;
            }
            return token;
        },
        session: ({ session, token, user }) => {
            if (token) {
                session.user._id = token._id;
                session.user.email = token.email;
                session.user.role = token.role;
                session.user.accessToken = token.accessToken;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 60 * 60 * 24,
    },
    pages: {
        signIn: "/auth/signin",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
