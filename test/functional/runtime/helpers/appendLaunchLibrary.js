import sandbox from "@adobe/reactor-sandbox";
import appendScript from "./appendScript";

export default container => {
  const script = sandbox.build({ container });
  return appendScript(script["/launch-EN00000000000000000000000000000000.js"]);
};
