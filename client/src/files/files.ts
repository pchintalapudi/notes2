enum FileType {
  NOTE,
  FOLDER,
  BINARY
}
interface FileBase {
  title: string;
  date: Date;
  type: FileType;
  parent?: number;
  id: number;
}
interface Folder extends FileBase {
  children: FileBase[];
}
interface Note extends FileBase {
  text: string;
}

export { FileType, FileBase, Folder, Note };
