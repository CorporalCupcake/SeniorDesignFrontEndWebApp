import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const client = new S3Client({
    credentials: {
        accessKeyId: 'AKIAWTJZLRJS6FXG2ZMH',
        secretAccessKey: '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',
    },
    region: 'us-east-1'
});

export const listObjects = async () => {
    const command = new ListObjectsV2Command({
        Bucket: "test-bucket-coe491-s23",
        MaxKeys: 1,
    });

    try {
        let isTruncated = true;

        console.log("Your bucket contains the following objects:\n")
        let contents = "";

        while (isTruncated) {
            const { Contents, IsTruncated, NextContinuationToken } = await client.send(command);
            const contentsList = Contents.map((c) => ` • ${c.Key}`).join("\n");
            contents += contentsList + "\n";
            isTruncated = IsTruncated;
            command.input.ContinuationToken = NextContinuationToken;
        }
        console.log(contents);

    } catch (err) {
        console.error(err);
    }
};