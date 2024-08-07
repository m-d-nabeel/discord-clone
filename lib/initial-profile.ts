import { currentUser, auth } from "@clerk/nextjs/server";
import prismadb from "./db";

export const initialProfile = async () => {
  try {
    const current_user = await currentUser();
    if (!current_user) {
      return auth().redirectToSignIn();
    }
    const profile = await prismadb.profile.findUnique({
      where: {
        userId: current_user.id,
      },
    });
    if (profile) {
      return profile;
    }
    let name = current_user.firstName as string;
    if (!!current_user.lastName) {
      name += " " + current_user.lastName;
    }
    const newProfile = await prismadb.profile.create({
      data: {
        userId: current_user.id,
        name,
        imageUrl: current_user.imageUrl,
        email: current_user.emailAddresses[0].emailAddress,
      },
    });
    return newProfile;
  } catch (error) {
    console.error("currentProfile Server Error", error);
    throw error;
  }
};
