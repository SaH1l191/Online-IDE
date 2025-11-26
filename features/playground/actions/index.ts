"use server"

import { currentUser } from "@/features/auth/actions"
import { client } from "@/lib/db"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { TemplateFolder } from "../../dashboard/lib"

export const toggleStarMarked = async (playGroundId: string, isChecked: boolean) => {
    const user = await currentUser()
    const userId = user?.id
    if (!userId) { throw new Error("user not found") }
    try {
        if (isChecked) {
            await client.starMark.create({
                data: {
                    playgroundId: playGroundId,
                    isMarked: isChecked,
                    userId: userId
                }
            })
        }
        revalidatePath("/dashboard")
        return { success: true, error: null, isMarked: isChecked }
    }
    catch (error) {
        return { success: false, error: (error as Error).message, isMarked: !isChecked }
    }
}

export const createPlayground = async (data: {
    title: string;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
    description?: string;
}) => {
    const user = await currentUser()
    const userId = user?.id
    if (!userId) { throw new Error("user not found") }
    const { template, title, description } = data;

    try {
        const playground = await client.playground.create({
            data: {
                title: title,
                description: description,
                template: template,
                userId: userId
            }
        })
        revalidatePath("/dashboard")
        return playground
    } catch (err) {
        console.log(err)
    }
}



export const getAllPlayground = async () => {
    const user = await currentUser()
    const userId = user?.id
    if (!userId) { throw new Error("user not found") }
    try {
        const playgrounds = await client.playground.findMany({
            where: {
                userId: userId,
            },
            include: {
                StarMark: {
                    where: {
                        userId: userId
                    },
                    select: {
                        isMarked: true
                    }
                },
                user: true
            }
        })
        console.log("getallplayground from primsa", playgrounds)
        return playgrounds
    } catch (err) {
        console.log(err)
    }
}

export const deletePlayGroundById = async (playGroundId: string) => {
    const user = await currentUser()
    const userId = user?.id
    if (!userId) { throw new Error("user not found") }
    try {
        await client.playground.delete({
            where: {
                id: playGroundId
            }
        })
        revalidatePath("/dashboard")
    } catch (err) {
        console.log(err)
    }
}
export const editPlayGroundById = async (playGroundId: string, data: { title: string, description?: string }
) => {
    const user = await currentUser()
    const userId = user?.id
    if (!userId) { throw new Error("user not found") }
    try {
        await client.playground.update({
            where: {
                id: playGroundId
            },
            data: data
        })
        revalidatePath("/dashboard")
    } catch (err) {
        console.log(err)
    }
}

export const duplicatePlaygroundById = async (playGroundId: string) => {
    try {
        const originalPlayground = await client.playground.findUnique({
            where: {
                id: playGroundId
            },
            include: {
                templateFiles: true
            }
        })
        if (!originalPlayground) {
            throw new Error("Original playground not found");
        }
        const duplicatedPlayground = await client.playground.create({
            data: {
                title: `${originalPlayground.title}`,
                description: `${originalPlayground.description}`,
                userId: `${originalPlayground.userId}`,
                templateFiles: {
                    create: originalPlayground.templateFiles.map((file) => ({
                        content: file.content!
                    }))
                }
            }
        })
        revalidatePath("/dashboard")
        return duplicatedPlayground

    } catch (err) {
        console.log(err)
    }
}

export const getPlaygroundById = async (playGroundId: string) => {
    try {
        const PlayGroundTemplateContent = await client.playground.findUnique({
            where: {
                id: playGroundId
            },
            select: {
                id: true,
                title: true,
                templateFiles: {
                    select: {
                        content: true
                    }
                }
            }
        }) 
        return PlayGroundTemplateContent

    } catch (err) {
        console.log(err)
    }
}

export const SaveUpdatedCode = async (playgroundId: string, data: TemplateFolder) => {
    const user = await currentUser()
    if (!user) return null
    try {
        //inserts new or updates existing  data
        const updatedPlayground = await client.templateFile.upsert({
            where: {
                playgroundId: playgroundId
            },
            update: {
                content: JSON.stringify(data)
            },
            create: {
                playgroundId: playgroundId,
                content: JSON.stringify(data)
            }
        })
        return updatedPlayground
    } catch (err) {
        console.log(err)
    }
}