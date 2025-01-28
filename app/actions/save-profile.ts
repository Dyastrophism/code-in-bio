"use server";

import { randomUUID } from "crypto";
import { db, storage } from "../lib/firebase";
import { Timestamp } from "firebase-admin/firestore";
import { auth } from "../lib/auth";

export async function saveProfile(formData: FormData) {

    const session = await auth();

    if(!session) return;

    try {
        const profileId = formData.get("profileId") as string;
        const yourName = formData.get("yourName") as string;
        const yourDescription = formData.get("yourDescription") as string;
        const profilePic = formData.get("profilePic") as File;

        let imagePath = null;
    
        const hasProfilePic = profilePic && profilePic.size > 0;

        if(hasProfilePic) {
            const currentPorfilePic = await db
            .collection("profiles")
            .doc(profileId)
            .get();
            const currentImagePath = currentPorfilePic.data()?.imagePath;

            if(currentImagePath) {
                const currentStorageRef = storage.file(currentImagePath);
                const [exists] = await currentStorageRef.exists();

                if(exists) {
                    await currentStorageRef.delete();
                }
            }

            const storageRef = storage.file(`profiles-images/${profileId}/${randomUUID()}`);
            const awaitBuffer = await profilePic.arrayBuffer();
            const buffer = Buffer.from(awaitBuffer);

            await storageRef.save(buffer);

            imagePath = storageRef.name;
        }

        await db.collection("profiles").doc(profileId).update({
            name: yourName,
            description: yourDescription,
            ...(hasProfilePic && { imagePath }),
            updatedAt: Timestamp.now().toMillis(),
        });

        return true;

    } catch (error) {
        console.log(error);
        return false;
    }
}