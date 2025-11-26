import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { TemplateFolder } from '../../dashboard/lib'
import { getPlaygroundById, SaveUpdatedCode } from '../actions'





interface PlaygroundData {
    id: string,
    title: string,
    [key: string]: any //object can have n no of keys with key being a string type 
}

interface UsePlayground {
    playgroundData: PlaygroundData | null
    templateData: TemplateFolder | null
    isLoading: boolean
    error: string | null
    loadPlayground: () => Promise<void>
    saveTemplateData: (data: TemplateFolder) => Promise<void>//need to save this constanly into db 
}
export const usePlayground = (id: string): UsePlayground => {

    const [playgroundData, setPlaygroundData] = useState<PlaygroundData | null>(null)
    const [templateData, setTemplateData] = useState<TemplateFolder | null>(null);
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadPlayground = useCallback(async () => {

        if (!id) return;
        try {
            setIsLoading(true);
            setError(null);
            const data = await getPlaygroundById(id);
            console.log("data from loadPlayground in hook", data)
            // @ts-ignore
            setPlaygroundData(data)

            // 2 conditions here => 
            //1.playground data found in our db 
            // 2. new playground data ned to be loaded from templates 

            //checking 1st condition 
            const rawContent = data?.templateFiles?.[0]?.content;
            console.log("checking rawContent Content", rawContent)
            if (typeof rawContent === "string") { // serialized json data 
                const parsedContent = JSON.parse(rawContent)
                console.log("checking parsed Content", parsedContent)
                setTemplateData(parsedContent)
                toast.success("Playground Loaded Successfully!")
                return;
            }

            //load template from api (not saved in db)
            const res = await fetch(`/api/template/${id}`)
            if (!res.ok) throw new Error(`Failed to load the template ${res.status},${error}`)

            const templateRes = await res.json()
            console.log("templateRes", templateRes)

            //additional checks to ensure valid response 
            if (templateRes.templateJson && Array.isArray(templateRes.templateJson)) {
                console.log("hit if condition")
                setTemplateData({
                    folderName: "Root",
                    items: templateRes.templateJson,
                });
            } else {
                //eg => if some framewrok contains a root folder inside of it then it 
                // expands the inner root folder nothing else 
                console.log("hit else condition")
                setTemplateData(templateRes.templateJson || {
                    folderName: "Root",
                    items: [],
                });
            }
            toast.success("Template loaded successfully");
        } catch (error) {
            console.error("Error loading playground:", error);
            setError("Failed to load playground data");
            toast.error("Failed to load playground data");
        } finally {
            setIsLoading(false);
        }
    }, [id])

    const saveTemplateData = useCallback(async (data: TemplateFolder) => {
        try {
            //playgroundId,data
            await SaveUpdatedCode(id, data);
            setTemplateData(data);
            toast.success("Changes saved successfully");
        } catch (error) {
            console.error("Error saving template data:", error);
            toast.error("Failed to save changes");
            throw error;
        }
    }, [id])


    useEffect(() => {
        loadPlayground();
    }, [loadPlayground]);

    return {
        playgroundData,
        templateData,
        isLoading,
        error,
        loadPlayground,
        saveTemplateData,
    }

}
