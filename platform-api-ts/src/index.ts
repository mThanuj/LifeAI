import express, { Request, Response } from "express";

const app = express();
const port = 3333;

app.get("/", (req: Request, res: Response) => {
    res.send("Hello, TypeScript Express!");
});

app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${port}`);
});
