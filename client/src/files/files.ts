import { Diff, diff_match_patch } from "diff-match-patch";
const diff_applier = new diff_match_patch();
enum FileType {
  NOTE,
  FOLDER,
  BINARY
}

//For testing purposes, we simulate a server by applying the diff immediately to the current text
async function serverSimulator(
  serverText: string,
  diffs: Diff[]
): Promise<string> {
  return diff_applier.patch_apply(
    diff_applier.patch_make(serverText, diffs),
    serverText
  )[0];
}

class NotePayload {
  queuedDiffs = [] as Diff[];
  private _serverText: string;
  private computed?: string = "";

  constructor(serverText?: string) {
    this._serverText = serverText || "";
  }

  queueDiffs(diffs: Diff[]) {
    if (diffs.length) {
      this.queuedDiffs.push(...diffs);
      //Send an update request.
      serverSimulator(this._serverText, this.queuedDiffs).then(s => {
        this._serverText = s;
        this.queuedDiffs.splice(
          this.queuedDiffs.indexOf(diffs[0]),
          diffs.length
        );
        this.computed = undefined;
      });
    }
  }

  set serverText(serverText: string) {
    this._serverText = serverText;
    this.computed = undefined;
  }

  get computedText() {
    return this.computed === undefined
      ? diff_applier.patch_apply(
          diff_applier.patch_make(this.serverText, this.queuedDiffs),
          this.serverText
        )[0]
      : this.computed;
  }

  get saved() {
    return this.queuedDiffs.length > 0;
  }
}
interface FileBase {
  title: string;
  date: Date;
  type: FileType;
  parent?: number;
  id: number;
}
interface NoteFolder extends FileBase {
  children: FileBase[];
}
interface TextNote extends FileBase {
  //Client usage stuffs
  payload: NotePayload;
}

export { FileType, FileBase, NoteFolder, TextNote, NotePayload };
