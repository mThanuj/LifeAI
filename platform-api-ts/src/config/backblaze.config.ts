import B2 from "backblaze-b2";
import env from "./config";

const b2 = new B2({
    applicationKeyId: env.BACKBLAZE_API_ID,
    applicationKey: env.BACKBLAZE_API_KEY,
});

export default b2;
