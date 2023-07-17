import NextAuth from "next-auth";
import YandexProvider from "next-auth/providers/yandex";
import { getSession } from "next-auth/react";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import axios from "axios";

export const authOptions = {
  providers: [
    YandexProvider({
      clientId: process.env.YANDEX_CLIENT_ID,
      clientSecret: process.env.YANDEX_CLIENT_SECRET,
      scope: "login:info",
      async profile(profile, tokens) {
        const { access_token } = tokens;

        const { data } = await axios.get("https://login.yandex.ru/info", {
          headers: {
            Authorization: `OAuth ${access_token}`,
          },
        })

        return profile
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user  }) {
      const client = await clientPromise;
      const db = client.db();

      const customUsersCollection = db.collection("customUser");

      if (session.user) {
        const existingUser = await customUsersCollection.findOne({ userId: user.id });
        if (!existingUser) {
          const newCustomUser = {
            userId: user.id,
            name: user.display_name,
            phone: user.default_phone?.number,
            email: user.default_email,
            image: `https://avatars.yandex.net/get-yapic/${user.default_avatar_id}/islands-200`,
            role: "user",
          };

          await customUsersCollection.insertOne(newCustomUser);

          session.customUser = newCustomUser;
        } else {
          session.customUser = existingUser;
        }
      }

      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  theme: {
    colorScheme: "light",
    brandColor: "#1A1A19",
    logo: "",
    buttonText: "",
  },
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.JWT_SECRET,
};

export default NextAuth(authOptions);