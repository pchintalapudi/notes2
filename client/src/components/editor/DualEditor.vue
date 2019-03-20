<template>
  <div class="root">
    <label for="editor" style="position:absolute;opacity:0;pointer-events:none">Markdown Editor</label>
    <textarea name="editor" id="editor" cols="30" rows="10" v-model="rawText" @input="update"></textarea>
    <div class="terminator"></div>
    <iframe
      :src="srcdocSupported ? '' : '/mirror'"
      frameborder="0"
      ref="preview"
      sandbox="allow-scripts"
      referrer-policy="origin"
      title="Markdown Preview"
    ></iframe>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { themeStringifier } from "../../theme";
const mathPattern = /(?:\$\$([\s\S]+?)\$\$)|(?:\\\\\[([\s\S]+?)\\\\\])|(?:\\\\\(([\s\S]+?)\\\\\))/g;
const matrixPattern = /(?:\[(?:\/(s|b|B|p|v|V|(?:small))\/)?[\s]*([\s\S]+?;[\s\S]+?)\])/g;
const colorPattern = /[^\\]`color:([\s\S]+?)`[\s\S]+?([\s\S]*?)[^\\]`/g;
const arrowPattern = /(?:<!--([\s\S]*?)-->)|(?:(?:[\s]+|^)(-->)(?:[\s]+|$))|((?:[\s]+|^)(<--)(?:[\s]+)|$)|((?:[\s]+|^)<-->(?:[\s]+|$))/g;
const implicitLatex = /(?:[\s]+?|^)([A-Za-z])(?:()|())/g;
export default Vue.extend({
  mounted: function() {
    this.katex = (window as any).katex;
    this.iframe = this.$refs.preview as HTMLIFrameElement;
    this.srcdocSupported =
      false && "srcdoc" in document.createElement("iframe");
  },
  data: function() {
    return {
      rawTextOld: "",
      rawText: "",
      katex: undefined as any,
      iframe: undefined as HTMLIFrameElement | undefined,
      srcdocSupported: false,
      encoded: ""
    };
  },
  methods: {
    update: function() {
      let encoded = this.colorHandle(
        (window as any).marked(this.encodeMath(this.arrow(this.rawText)))
      );
      // if (!this.srcdocSupported) {
      this.iframe!.contentWindow!.postMessage(
        { type: "html", html: encoded },
        "*"
      );
      // } else {
      // this.encoded = this.style + encoded + "</body></html>";
      // }
      localStorage.setItem("temp", encoded);
      this.rawTextOld = this.rawText;
    },
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
      return this.katex.renderToString(
        str.split(String.fromCharCode(16)).join("\\$"),
        { throwOnError: false, displayMode }
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
    }
  }
});
</script>
<style scoped>
#editor,
.root > :last-child {
  flex: 1;
  flex-basis: 300px;
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
}
.terminator {
  background-color: var(--bg-mprimary);
  flex: 0;
  flex-basis: 10px;
}
</style>
