import katex from "katex";
enum state {
  NONE,
  SINGLE_DOLLAR,
  SINGLE_BACKSLASH,
  DOUBLE_BACKSLASH
}
enum delim {
  NONE,
  DOLLAR,
  BRACKET,
  PAREN
}
const mathPattern = /(?:\$\$([\s\S]+?)\$\$)|(?:\\\\\[([\s\S]+?)\\\\\])|(?:\\\\\(([\s\S]+?)\\\\\))/g;
const matrixPattern = /(?:\[(?:\/(s|b|B|p|v|V|(?:small))\/)?[\s]*([\s\S]+?;[\s\S]+?)\])/g;
const implicitLatex = /(?:[\s]+?|^)([A-Za-z\d{}]+[\s]?[\^+/\-=][\s]*?(?:[A-Za-z\d{}]*?\)*[\s]?[\^+/\-*=_]\(*[\s]?)*[A-Za-z\d{}]+\)*)/g;
export default {
  encodeMath: function(html: string): string {
    mathPattern.lastIndex = 0;
    implicitLatex.lastIndex = 0;
    let builder = [];
    let buffer = [];
    let current_state = state.NONE;
    let current_delim = delim.NONE;
    for (let i = 0; i < html.length; i++) {
      let char = html[i];
      switch (char) {
        case "\\":
          switch (current_state) {
            case state.NONE:
              current_state = state.SINGLE_BACKSLASH;
              break;
            case state.SINGLE_BACKSLASH:
              current_state = state.DOUBLE_BACKSLASH;
              break;
            case state.DOUBLE_BACKSLASH:
              buffer.push("\\");
              current_state = state.SINGLE_BACKSLASH;
              break;
            case state.SINGLE_DOLLAR:
              buffer.push("$");
              current_state = state.NONE;
          }
          break;
        case "$":
          switch (current_state) {
            case state.DOUBLE_BACKSLASH:
              buffer.push("\\");
            //Fallthrough
            case state.NONE:
              current_state = state.SINGLE_DOLLAR;
              break;
            case state.SINGLE_BACKSLASH:
              buffer.push("$");
              current_state = state.NONE;
            case state.SINGLE_DOLLAR:
              switch (current_delim) {
                case delim.NONE:
                  builder.push(
                    buffer.join("").replace(implicitLatex, this.replImplicit)
                  );
                  buffer.length = 0;
                  current_delim = delim.DOLLAR;
                  break;
                case delim.DOLLAR:
                  current_delim = delim.NONE;
                  builder.push(
                    katex.renderToString(buffer.join(""), {
                      throwOnError: false,
                      displayMode: true
                    })
                  );
                  buffer.length = 0;
                  break;
                default:
                  buffer.push("$$");
              }
              current_state = state.NONE;
              break;
          }
          break;
        case "(":
          switch (current_state) {
            case state.NONE:
              buffer.push("(");
              break;
            case state.SINGLE_BACKSLASH:
              buffer.push("(");
              break;
            case state.SINGLE_DOLLAR:
              buffer.push("$(");
              break;
            case state.DOUBLE_BACKSLASH:
              if (current_delim !== delim.NONE) {
                buffer.push("\\(");
              } else {
                builder.push(
                  buffer.join("").replace(implicitLatex, this.replImplicit)
                );
                buffer.length = 0;
                current_delim = delim.PAREN;
              }
              break;
          }
          current_state = state.NONE;
          break;
        case ")":
          switch (current_state) {
            case state.NONE:
              buffer.push(")");
              break;
            case state.SINGLE_BACKSLASH:
              buffer.push(")");
              break;
            case state.SINGLE_DOLLAR:
              buffer.push("$)");
              break;
            case state.DOUBLE_BACKSLASH:
              if (current_delim === delim.PAREN) {
                current_delim = delim.NONE;
                builder.push(
                  katex.renderToString(buffer.join(""), {
                    throwOnError: false,
                    displayMode: false
                  })
                );
              } else {
                buffer.push("\\(");
              }
              break;
          }
          current_state = state.NONE;
          break;
        case "[":
          switch (current_state) {
            case state.NONE:
              buffer.push("[");
              break;
            case state.SINGLE_BACKSLASH:
              buffer.push("[");
              break;
            case state.SINGLE_DOLLAR:
              buffer.push("$[");
              break;
            case state.DOUBLE_BACKSLASH:
              if (current_delim !== delim.NONE) {
                buffer.push("\\[");
              } else {
                builder.push(
                  buffer.join("").replace(implicitLatex, this.replImplicit)
                );
                buffer.length = 0;
                current_delim = delim.BRACKET;
              }
              break;
          }
          current_state = state.NONE;
          break;
        case "]":
          switch (current_state) {
            case state.NONE:
              buffer.push("]");
              break;
            case state.SINGLE_BACKSLASH:
              buffer.push("]");
              break;
            case state.SINGLE_DOLLAR:
              buffer.push("$]");
              break;
            case state.DOUBLE_BACKSLASH:
              if (current_delim === delim.PAREN) {
                current_delim = delim.NONE;
                builder.push(
                  katex.renderToString(buffer.join(""), {
                    throwOnError: false,
                    displayMode: true
                  })
                );
              } else {
                buffer.push("\\]");
              }
              break;
          }
          current_state = state.NONE;
          break;
        default:
          buffer.push(char);
          current_state = state.NONE;
          break;
      }
    }
    builder.push(buffer.join("").replace(implicitLatex, this.replImplicit));
    buffer.length = 0;
    return builder.join("");
    // return transformed
    //   .replace(mathPattern, this.replMath)
    //   .replace("\0", "\\\\");
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
  replImplicit: function(match: string, p1: string) {
    return (
      match.substring(0, match.indexOf(p1)) +
      katex.renderToString(p1.replace("*", "\\cdot "))
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
  }
};
