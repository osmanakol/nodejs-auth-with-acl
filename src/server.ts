import app from "./app";
import { HOST, PORT } from "./config";

app.set("port", PORT)

app.listen(app.get("port"), '0.0.0.0', () => {
    console.info(`Server is working, http://${HOST}:${PORT}`)
})