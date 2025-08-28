"use server"

import { currentUser } from "@/features/auth/actions"
import { client } from "@/lib/db"

export const getAllPlaygroundForUser = async () => {
    const user = await currentUser()

    try {
        const playgrounds = await client.playground.findMany({
            where: {
                userId: user?.id
            },
            include: {
                user: true
            }
        })
        return playgrounds
    } catch (error) {
        console.log("Error in getAllPlaygroundForUser", error)
    }
}