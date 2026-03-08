import { TemplateFile, TemplateFolder } from "../types"

type TemplateItem = TemplateFile | TemplateFolder

export class FileSystemHelper {
  // Add item to tree at specified path
  static addItem(root: TemplateFolder, path: string, item: TemplateFile | TemplateFolder): TemplateFolder {
    console.log("FileSystemHelper.addItem called with:", { path, item });
    const clonedRoot = JSON.parse(JSON.stringify(root))
    const parts = path.split('/').filter(Boolean)
    let current = clonedRoot
    
    // Navigate to the target folder (not parent)
    // For empty path, stay at root
    // For non-empty path, navigate to the specified folder
    for (let i = 0; i < parts.length; i++) {
      const folder = current.items.find((item: TemplateItem) => 
        'folderName' in item && item.folderName === parts[i]
      ) as TemplateFolder
      if (folder) current = folder
    }
    
    // Add the item to the current folder
    current.items.push(item)
    console.log("FileSystemHelper.addItem result:", clonedRoot);
    return clonedRoot
  }

  // Remove item from tree at specified path
  static removeItem(root: TemplateFolder, path: string): TemplateFolder {
    const clonedRoot = JSON.parse(JSON.stringify(root))
    const parts = path.split('/').filter(Boolean)
    const itemName = parts[parts.length - 1]
    let current = clonedRoot
    
    // Navigate to parent folder
    for (let i = 0; i < parts.length - 1; i++) {
      const folder = current.items.find((item: TemplateItem) => 
        'folderName' in item && item.folderName === parts[i]
      ) as TemplateFolder
      if (folder) current = folder
    }
    
    // Remove the item
    current.items = current.items.filter((item: TemplateItem) => {
      if ('filename' in item) {
        const fullName = `${item.filename}.${item.fileExtension}`
        return fullName !== itemName
      }
      return item.folderName !== itemName
    })
    
    return clonedRoot
  }

  // Rename item in tree
  static renameItem(root: TemplateFolder, oldPath: string, newPath: string): TemplateFolder {
    const clonedRoot = JSON.parse(JSON.stringify(root))
    const oldParts = oldPath.split('/').filter(Boolean)
    const newParts = newPath.split('/').filter(Boolean)
    
    const oldName = oldParts[oldParts.length - 1]
    const newName = newParts[newParts.length - 1]
    
    let current = clonedRoot
    
    // Navigate to parent folder
    for (let i = 0; i < oldParts.length - 1; i++) {
      const folder = current.items.find((item: TemplateItem) => 
        'folderName' in item && item.folderName === oldParts[i]
      ) as TemplateFolder
      if (folder) current = folder
    }
    
    // Find and rename the item
    current.items = current.items.map((item: TemplateItem) => {
      if ('filename' in item) {
        const fullName = `${item.filename}.${item.fileExtension}`
        if (fullName === oldName) {
          const [filename, ...extParts] = newName.split('.')
          return {
            ...item,
            filename: filename || item.filename,
            fileExtension: extParts.join('.') || item.fileExtension
          }
        }
      } else if (item.folderName === oldName) {
        return { ...item, folderName: newName }
      }
      return item
    })
    
    return clonedRoot
  }

  // Check if path is in folder
  static isPathInFolder(filePath: string, folderPath: string): boolean {
    return filePath.startsWith(folderPath + '/') || filePath === folderPath
  }

  // Check if path matches
  static isPathMatch(filePath: string, targetPath: string): boolean {
    const fileName = filePath.split('/').pop()
    const targetName = targetPath.split('/').pop()
    return fileName === targetName
  }

  // Generate simple file ID
  static generateFileId(file: TemplateFile): string {
    return `${file.filename}.${file.fileExtension}`
  }

  // Find file by path
  static findFileByPath(root: TemplateFolder, path: string): TemplateFile | null {
    const parts = path.split('/').filter(Boolean)
    const fileName = parts[parts.length - 1]
    let current = root
    
    // Navigate to parent folder
    for (let i = 0; i < parts.length - 1; i++) {
      const folder = current.items.find((item: TemplateItem) => 
        'folderName' in item && item.folderName === parts[i]
      ) as TemplateFolder
      if (folder) current = folder
    }
    
    // Find the file
    const file = current.items.find((item: TemplateItem) => {
      if ('filename' in item) {
        const fullName = `${item.filename}.${item.fileExtension}`
        return fullName === fileName
      }
      return false
    }) as TemplateFile
    
    return file || null
  }
}
