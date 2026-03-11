import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import { TemplateFile, TemplateFolder, OpenFile } from "../types"
import { FileSystemHelper } from "../lib/FileSystemHelper"
import { FileSystemService } from "../services/FileSystemService"

interface FileExplorerState {
  // Core state
  playgroundId: string
  templateData: TemplateFolder | null
  openFiles: OpenFile[]
  activeFileId: string | null
  
  // Simple actions
  setPlaygroundId: (id: string) => void
  setTemplateData: (data: TemplateFolder | null) => void
  
  // File operations
  openFile: (file: TemplateFile) => void
  closeFile: (fileId: string) => void
  closeAllFiles: () => void
  setActiveFile: (fileId: string | null) => void
  updateFileContent: (fileId: string, content: string) => void
  updateOpenFile: (fileId: string, updates: Partial<OpenFile>) => void
  
  // File system operations (simplified)
  createFile: (path: string, file: TemplateFile, writeFileSync?: (filePath: string, content: string) => Promise<void>, instance?: any) => Promise<void>
  createFolder: (path: string, folder: TemplateFolder, instance?: any) => Promise<void>
  deleteItem: (path: string) => Promise<void>
  renameItem: (oldPath: string, newPath: string) => Promise<void>
}
 
export const useFileExplorer = create<FileExplorerState>()(
  immer((set, get) => ({
    playgroundId: "",
    templateData: null,
    openFiles: [],
    activeFileId: null,

    setPlaygroundId: (id) => set((state) => { state.playgroundId = id }),
    setTemplateData: (data) => set((state) => { state.templateData = data }),

    //logic : open file can call to open file and pushes in openFiles array or already opened file sets as active File id in both case 
    openFile: (file) => set((state) => {
      const fileId = FileSystemHelper.generateFileId(file)
      const existingFile = state.openFiles.find((f: OpenFile) => f.id === fileId)
      
      if (existingFile) {
        state.activeFileId = fileId
      } else {
        state.openFiles.push({
          ...file,
          id: fileId,
          hasUnsavedChanges: false,
          content: file.content || "",
          originalContent: file.content || ""
        })
        state.activeFileId = fileId
      }
    }),

    //logic : remove file from OpenFiles array , if removing file is activeFIle  then set the new active file[0] first one from the openFiles array 
    closeFile: (fileId) => set((state) => {
      state.openFiles = state.openFiles.filter((f: OpenFile) => f.id !== fileId)
      if (state.activeFileId === fileId) {
        state.activeFileId = state.openFiles.length > 0 ? state.openFiles[0].id : null
      }
    }),

    closeAllFiles: () => set((state) => {
      state.openFiles = []
      state.activeFileId = null
    }),

    setActiveFile: (fileId) => set((state) => { state.activeFileId = fileId }),


    //logic : update the open file with new changes like content change or name change etc during user typing 
    updateFileContent: (fileId, content) => set((state) => {
      const file = state.openFiles.find((f: OpenFile) => f.id === fileId)
      if (file) {
        file.content = content
        file.hasUnsavedChanges = content !== file.originalContent
      }
    }),

      //logic : runs after ctrl +s saving , rewrites the udpated file content to the same preivous file content(as updateFileContent was triggered on typing )  
      // & updates content: fileToSave.content, originalContent: fileToSave.content, hasUnsavedChanges: false,
    updateOpenFile: (fileId, updates) => set((state) => {
      const file = state.openFiles.find((f: OpenFile) => f.id === fileId)
      if (file) {
        Object.assign(file, updates)
      }
    }),

    // logic : 
    // create file id -> update templateData state , open created File , save changes in db, then reflect in webcontainer
    createFile: async (path, file, writeFileSync, instance) => {
      console.log("createFile called with:", { path, file, hasWriteFileSync: !!writeFileSync, hasInstance: !!instance });
      const { templateData, playgroundId } = get()
      if (!templateData) return
      
      try {
        const updatedData = FileSystemHelper.addItem(templateData, path, file)
        set((state) => { state.templateData = updatedData })
        
        // Auto-open the new file
        get().openFile(file)
        
        // Save and sync
        await FileSystemService.saveChanges(playgroundId, updatedData)

        /// not working 
        await FileSystemService.syncWithContainer(
          writeFileSync,
          instance,
          path,
          file.content || ""
        )
        
        FileSystemService.showSuccess(`Created file: ${file.filename}.${file.fileExtension}`)
      } catch (error) {
        FileSystemService.showError("Failed to create file")
      }
    },
    
    createFolder: async (path, folder, instance) => {
      const { templateData, playgroundId } = get()
      if (!templateData) return
      
      try {
        const updatedData = FileSystemHelper.addItem(templateData, path, folder)
        set((state) => { state.templateData = updatedData })
        
        // Save and sync
        await FileSystemService.saveChanges(playgroundId, updatedData)
        await FileSystemService.createFolderInContainer(instance, path)
        
        FileSystemService.showSuccess(`Created folder: ${folder.folderName}`)
      } catch (error) {
        FileSystemService.showError("Failed to create folder")
      }
    },
    //find file -> remove from templatedata -> udpateDb -> updateWebcontainer
    deleteItem: async (path) => {
      const { templateData, openFiles, playgroundId } = get()
      if (!templateData) return
      
      try {
        const updatedData = FileSystemHelper.removeItem(templateData, path)
        
        // Close any open files in deleted path
        const filesToClose = openFiles.filter(f => 
          FileSystemHelper.isPathInFolder(f.id, path)
        )
        filesToClose.forEach(f => get().closeFile(f.id))
        
        set((state) => { state.templateData = updatedData })
        
        // Save
        await FileSystemService.saveChanges(playgroundId, updatedData)
        
        const itemName = path.split('/').pop()
        FileSystemService.showSuccess(`Deleted: ${itemName}`)
      } catch (error) {
        FileSystemService.showError("Failed to delete item")
      }
    },

      //issue: fix the ts error 
      //issue : remove unused dependencies & files 
    renameItem: async (oldPath, newPath) => {
      const { templateData, openFiles, activeFileId, playgroundId } = get()
      if (!templateData) return
      
      try {
        const updatedData = FileSystemHelper.renameItem(templateData, oldPath, newPath)
        
        // Update open file IDs and names
        const updatedFiles = openFiles.map(f => {
          if (FileSystemHelper.isPathMatch(f.id, oldPath)) {
            const newId = newPath.split('/').pop() || f.id
            const [filename, ...extParts] = newId.split('.')
            return {
              ...f,
              id: newId,
              filename: filename || f.filename,
              fileExtension: extParts.join('.') || f.fileExtension
            }
          }
          return f
        })
        
        set((state) => { 
          state.templateData = updatedData
          state.openFiles = updatedFiles
          if (activeFileId && FileSystemHelper.isPathMatch(activeFileId, oldPath)) {
            state.activeFileId = newPath.split('/').pop() ?? null
          }
        })
        
        // Save
        await FileSystemService.saveChanges(playgroundId, updatedData)
        
        const newName = newPath.split('/').pop()
        FileSystemService.showSuccess(`Renamed to: ${newName}`)
      } catch (error) {
        FileSystemService.showError("Failed to rename item")
      }
    }
    //review delete fileSystemHelper + delteitem, renameItem working ,
    // handlesave() func in playground/[id]
  }))
)
