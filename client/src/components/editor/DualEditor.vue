<template>
  <div class="root" @mouseup="expand(0)">
    <label for="editor" style="position:absolute;opacity:0;pointer-events:none">Markdown Editor</label>
    <div v-if="expanding" class="target-left" @mouseup="expand(-1)"></div>
    <div v-if="expanding" class="target-right" @mouseup="expand(1)"></div>
    <div class="editor" @mousedown="expanding=true">
      <textarea
        name="editor"
        id="editor"
        cols="30"
        rows="10"
        v-model="rawText"
        @mousedown.stop
        :class="focused == -1 ? 'expand' : focused == 1 ? 'hide' : false"
        @keydown.tab="filterTabs"
        ref="editor"
      ></textarea>
      <iframe
        :src="srcdocSupported ? '' : '/mirror'"
        frameborder="0"
        ref="preview"
        id="preview"
        sandbox="allow-scripts"
        referrer-policy="origin"
        title="Markdown Preview"
        @mousedown.stop
      ></iframe>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import math from "../../editor/math";
import marked from "marked";
import hljs from "highlight.js";
import { diff_match_patch } from "diff-match-patch";
import { themeStringifier } from "../../theme";
import { TextNote } from "../../files";
//Polyfill
interface InputEvent extends UIEvent {
  readonly data: string;
  readonly dataTransfer: DataTransfer;
  readonly inputType: string;
  readonly isComposing: boolean;
}
const colorPattern = /(?:\\\\)*\\`color:([\s]*[\S]+?)(?:\\\\)*\\`[\s\S]+?([\s\S]*?)(?:\\\\)*\\`/g;
const arrowPattern = /(?:<!--([\s\S]*?)-->)|(?:(?:[\s]+|^)(-->)(?:[\s]+|$))|((?:[\s]+|^)(<--)(?:[\s]+)|$)|((?:[\s]+|^)<-->(?:[\s]+|$))/g;
const differ: diff_match_patch = new diff_match_patch();
export default Vue.extend({
  mounted: function() {
    this.iframe = this.$refs.preview as HTMLIFrameElement;
    this.srcdocSupported =
      false && "srcdoc" in document.createElement("iframe");
  },
  data: function() {
    return {
      iframe: undefined as HTMLIFrameElement | undefined,
      srcdocSupported: false,
      encoded: "",
      expanding: false,
      focused: 0,
      cursor: undefined as undefined | number
    };
  },
  watch: {},
  beforeUpdate: function() {
    if (this.cursor === undefined) {
      let start = this.textArea.selectionStart;
      console.log(start);
      this.saveCursor(start);
      this.cursor = start;
    }
  },
  computed: {
    file: function(): TextNote {
      return this.$store.state.files.editing;
    },
    rawText: {
      get: function(): string {
        return this.file.payload.text;
      },
      set: function(text: string) {
        let diffs = differ.diff_main(this.rawText, text);
        differ.diff_cleanupEfficiency(diffs);
        this.file.payload.queueDiffs(diffs);
        let encoded = this.colorHandle(
          marked(this.encodeMath(this.arrow(text)), {
            highlight: (a, b, c) => {
              try {
                return b
                  ? hljs.highlight(b, a).value
                  : hljs.highlightAuto(a).value;
              } catch (err) {
                if (c) c(err, err ? (err as Error).name : "");
                return "";
              }
            }
          })
        );
        this.iframe!.contentWindow!.postMessage(
          { type: "html", html: encoded },
          "*"
        );
        localStorage.setItem("temp", encoded);
      }
    },
    textArea: function(): HTMLTextAreaElement {
      return this.$refs["editor"] as HTMLTextAreaElement;
    }
  },
  methods: {
    ...math,
    colorHandle: function(html: string) {
      colorPattern.lastIndex = 0;
      return html.replace(colorPattern, this.replColor);
    },
    replColor: function(match: string, p1: string, p2: string) {
      return "<span style='color:" + (p1 || "inherit") + "'>" + p2 + "</span>";
    },
    arrow: function(html: string) {
      arrowPattern.lastIndex = 0;
      return html.replace(arrowPattern, this.replArrow);
    },
    replArrow: function(
      match: string,
      p1: string,
      p2: string,
      p3: string,
      p4: string
    ): string {
      if (p1) {
        return match;
      } else if (p2) {
        return match.replace("-->", "→");
      } else if (p3) {
        return match.replace("<--", "←");
      } else {
        return match.replace("<-->", "↔");
      }
    },
    expand: function(arg: number) {
      this.expanding = false;
      this.focused = arg;
    },
    saveCursor: function(end: number) {
      let textArea = this.$refs["editor"] as HTMLTextAreaElement;
      this.$nextTick(() => {
        textArea.selectionEnd = textArea.selectionStart = end;
        this.cursor = undefined;
      });
    },
    filterTabs: function(event: KeyboardEvent) {
      if (!event.shiftKey && !event.ctrlKey && !event.metaKey) {
        let text = this.rawText,
          originalSelectionStart = (event.target as any).selectionStart,
          textStart = text.slice(0, originalSelectionStart),
          textEnd = text.slice(originalSelectionStart),
          start = this.textArea.selectionStart;
        this.rawText = textStart + "\t" + textEnd;
        (event.target as any).value = this.rawText;
        event.preventDefault();
        this.saveCursor(start + 1);
        this.cursor = start + 1;
      }
    }
  }
});
</script>
<style scoped>
#editor,
#preview {
  flex: 1;
  flex-basis: 300px;
  transition: flex 300ms flex-basis 300ms, margin 300ms;
}
.target-left:hover ~ .editor > #editor,
.hide {
  flex: 0.000000001;
  margin: 0;
}
.target-left:hover ~ .editor > #preview,
.hide + #preview {
  margin: 0;
}
.target-right:hover ~ #preview,
.expand + #preview {
  flex: 0.000000001;
  margin: 0;
}
.target-right:hover ~ .editor > #editor,
.expand {
  margin: 0;
}
.root {
  display: flex;
  flex-flow: row wrap;
  flex: 1;
}
#editor {
  padding: 2px;
  border-style: solid;
  border-width: 2px;
  border-color: transparent;
  color: var(--bg-contrast);
  resize: none;
  margin-right: 3px;
}
#preview {
  margin-left: 3px;
}
.editor {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  background-color: var(--bg-mprimary);
  width: 100%;
  cursor: ew-resize;
}
[class|="target"] {
  position: fixed;
  height: 25vh;
  background-color: blue;
}
.target-left {
  top: 0;
  left: 0;
  right: 0;
}
.target-right {
  bottom: 0;
  left: 0;
  right: 0;
}
@media (min-width: 606px) {
  .target-left {
    right: initial;
    bottom: 0;
    height: auto;
    width: 25vw;
  }
  .target-right {
    left: initial;
    top: 0;
    height: auto;
    width: 25vw;
  }
}
</style>
