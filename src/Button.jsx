import { useState, useCallback, memo } from "react";

function Button({ onclick }) {
  console.log("rendering button");
  return <button onclick={onclick}>Click me!</button>;
}

export default memo(Button);
