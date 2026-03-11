// types.ts (shared)
export interface TemplateItem {
  filename?: string;
  fileExtension?: string;
  content?: string;
  folderName?: string;
  items?: TemplateItem[];
}

type WCFile = { file: { contents: string } };
type WCDir  = { directory: Record<string, WCFile | WCDir> };
type WCFS   = Record<string, WCFile | WCDir>;

// Single recursive function 
export function transformToWebContainerFormat(template: { items: TemplateItem[] }): WCFS {
  function processItem(item: TemplateItem): WCFile | WCDir {
    if (item.folderName && item.items) {
      return {
        directory: Object.fromEntries(
          item.items.map(child => [itemKey(child), processItem(child)])
        )
      };
    }
    return { file: { contents: item.content ?? "" } };
  }

  return Object.fromEntries(
    template.items.map(item => [itemKey(item), processItem(item)])
  );
}

function itemKey(item: TemplateItem): string {
  return item.folderName ?? `${item.filename}.${item.fileExtension}`;
}