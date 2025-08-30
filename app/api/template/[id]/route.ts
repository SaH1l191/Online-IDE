import { client } from "@/lib/db";
import { NextRequest } from "next/server"; 
import path from "path";
import { readTemplateStructureFromJson, saveTemplateStructureToJson } from "@/features/playground/lib";
import fs from "fs/promises";

export const templatePaths = {
    REACT: "/tempate-starter-pack/react-ts",
    NEXTJS: "/tempate-starter-pack/nextjs-new",
    EXPRESS: "/tempate-starter-pack/express-simple",
    VUE: "/tempate-starter-pack/vue",
    HONO: "/tempate-starter-pack/hono-nodejs-starter",
    ANGULAR: "/tempate-starter-pack/angular"
}


//fetching a playground by its id and then looking up its template and 
// creates a temp directory in root folder and processes read and returns the parsed json reponse 
//and unlinks the temp directory created 

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const p = await params
    const id = p.id
    if (!id) return Response.json({ error: "Missing playground Id" }, { status: 400 })
    const playground = await client.playground.findUnique({
        where: { id }
    })
    if (!playground) {
        return Response.json({ error: "Playground not Found!" }, { status: 404 });
    }

    const templateKey = playground.template
    const templatePath = templatePaths[templateKey]

    if (!templatePath) {
        return Response.json({ error: "Invalid Template" }, { status: 404 })
    }

    try {
        const inputPath = path.join(process.cwd(), templatePath)
        const outputFile = path.join(process.cwd(), `output/${templateKey}.json`)
        console.log("Input Path:", inputPath);
        console.log("Output Path:", outputFile);

        await saveTemplateStructureToJson(inputPath, outputFile)
        const res = await readTemplateStructureFromJson(outputFile)

        if (!validateJsonStructure(res.items)) {
            return Response.json({ error: "Invalid Json structure" }, { status: 500 })
        }
        await fs.unlink(outputFile)
        return Response.json({ sucess: true, templateJson: res }, { status: 200 })
    }
    catch (error) {
        console.error("Error generating template JSON:", error);
        return Response.json({ error: "Failed to generate template" }, { status: 500 });
    }
}

function validateJsonStructure(data: unknown): boolean {
    try {
        JSON.parse(JSON.stringify(data))
        return true;
    } catch (error) {
        console.log("Invalid Json structure", error)
        return false
    }
}
