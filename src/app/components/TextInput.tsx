"use client"

import { useRecoilState } from "recoil";
import { textState } from "@/state/state";
function TextInput() {
  const [text, setText] = useRecoilState(textState);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };
  return (
    <div>
      <input type="text" value={text} onChange={onChange} />
      <br />
      Echo: {text}
    </div>
  );
}
export default TextInput;
