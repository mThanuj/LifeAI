import { Request, Response } from "express";
import b2 from "../config/backblaze.config";
import env from "../config/config";
import prisma from "../config/prisma.config";
import { User } from "../generated/prisma";

export const uploadDocument = async (req: Request, res: Response) => {
    try {
        const file = req.file;
        const userId = (req.user as User).id;

        if (!file || !file.buffer) {
            res.status(400).json({ message: "File is missing." });
            return;
        }

        if (!userId) {
            res.status(401).json({ message: "Authentication required." });
            return;
        }

        await b2.authorize();
        let response = await b2.getUploadUrl({
            bucketId: env.BACKBLAZE_BUCKET_ID,
        });
        let uploadData = response.data;

        response = await b2.uploadFile({
            data: file?.buffer,
            fileName: file.originalname,
            uploadAuthToken: uploadData.authorizationToken,
            uploadUrl: uploadData.uploadUrl,
            mime: file.mimetype,
        });
        uploadData = response.data;

        const new_document = prisma.document.create({
            data: {
                bucket_id: uploadData.bucketId,
                file_size_in_bytes: uploadData.contentLength,
                fileId: uploadData.fileId,
                filename: uploadData.fileName,
                user_id: userId,
            },
        });

        res.status(200).json({
            message: "Document uploaded successfully",
            document: new_document,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
        });
    }
};
