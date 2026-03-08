import { toast } from "sonner"
import { TemplateFile, TemplateFolder } from "../types"
import { SaveUpdatedCode } from "../actions"

export class FileSystemService {
  // Save changes to database
  static async saveChanges(playgroundId: string, data: TemplateFolder): Promise<void> {
    try {
      await SaveUpdatedCode(playgroundId, data)
    } catch (error) {
      console.error("Error saving changes:", error)
      toast.error("Failed to save changes")
      throw error
    }
  }

  // Sync with WebContainer (simplified)
  static async syncWithContainer(
    writeFileSync: ((filePath: string, content: string) => Promise<void>) | undefined,
    instance: any,
    path: string,
    content: string = ""
  ): Promise<void> {
    try {
      console.log("FileSystemService.syncWithContainer called:", { path, content, hasWriteFileSync: !!writeFileSync, hasInstance: !!instance });
      if (writeFileSync) {
        await writeFileSync(path, content);
      }
      if (instance && instance.fs) {
        await instance.fs.writeFile(path, content);
      }
    } catch (error) {
      console.error("Error syncing with container:", error);
      // Don't throw - sync failures shouldn't block the UI
    }
  }

  // Create folder in container
  static async createFolderInContainer(
    instance: any,
    path: string
  ): Promise<void> {
    try {
      if (instance && instance.fs) {
        await instance.fs.mkdir(path, { recursive: true })
      }
    } catch (error) {
      console.error("Error creating folder in container:", error)
      // Don't throw - container failures shouldn't block the UI
    }
  }

  // Show success message
  static showSuccess(message: string): void {
    toast.success(message)
  }

  // Show error message
  static showError(message: string): void {
    toast.error(message)
  }
}
