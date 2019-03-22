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
import katex from "katex";
import marked from "marked";
import { diff_match_patch } from "diff-match-patch";
import { themeStringifier } from "../../theme";
const mathPattern = /(?:\$\$([\s\S]+?)\$\$)|(?:\\\\\[([\s\S]+?)\\\\\])|(?:\\\\\(([\s\S]+?)\\\\\))/g;
const matrixPattern = /(?:\[(?:\/(s|b|B|p|v|V|(?:small))\/)?[\s]*([\s\S]+?;[\s\S]+?)\])/g;
const colorPattern = /[^\\]`color:([\s\S]+?)`[\s\S]+?([\s\S]*?)[^\\]`/g;
const arrowPattern = /(?:<!--([\s\S]*?)-->)|(?:(?:[\s]+|^)(-->)(?:[\s]+|$))|((?:[\s]+|^)(<--)(?:[\s]+)|$)|((?:[\s]+|^)<-->(?:[\s]+|$))/g;
const implicitLatex = /(?:[\s]+?|^)([A-Za-z])(?:()|())/g;
const differ: diff_match_patch = new diff_match_patch();
export default Vue.extend({
  mounted: function() {
    this.iframe = this.$refs.preview as HTMLIFrameElement;
    this.srcdocSupported =
      false && "srcdoc" in document.createElement("iframe");
  },
  data: function() {
    return {
      rawText: "",
      iframe: undefined as HTMLIFrameElement | undefined,
      srcdocSupported: false,
      encoded: "",
      expanding: false,
      focused: 0
    };
  },
  watch: {
    rawText: function(next, old) {
      let diffs = differ.diff_cleanupEfficiency(differ.diff_main(old, next));
      this.$store.dispatch("realTime/queueDiffs", diffs);
    },
    computedText: function(next) {
      let encoded = this.colorHandle(
        marked(this.encodeMath(this.arrow(this.rawText)))
      );
      this.iframe!.contentWindow!.postMessage(
        { type: "html", html: encoded },
        "*"
      );
      localStorage.setItem("temp", encoded);
    }
  },
  computed: {
    computedText: function(): string {
      return this.$store.getters["realTime/computedText"];
    }
  },
  methods: {
    encodeMath: function(html: string): string {
      mathPattern.lastIndex = 0;
      return html
        .replace("\\\\", "\0")
        .split(/\\\$/)
        .join(String.fromCharCode(16))
        .replace(mathPattern, this.replMath)
        .replace("\0", "\\\\");
    },
    replMath: function(
      match: string,
      p1: string,
      p2: string,
      p3: string
    ): string {
      let str = p1 || p2 || p3;
      matrixPattern.lastIndex = 0;
      str = str.replace(matrixPattern, this.replMatrix);
      let displayMode = p1 || p2;
      return katex.renderToString(
        str.split(String.fromCharCode(16)).join("\\$"),
        { throwOnError: false, displayMode: !!displayMode }
      );
    },
    replMatrix: function(match: string, p1: string, p2: string) {
      return (
        "\\begin{" +
        (p1 || "b") +
        "matrix}" +
        p2.replace(/;[\s]*/g, "\\\\").replace(/[\s]{2,}/g, "&") +
        "\\end{" +
        (p1 || "b") +
        "matrix}"
      );
    },
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
