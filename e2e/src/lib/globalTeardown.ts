import Handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { appEnv } from "./app-env";

// AWS S3 credentials and bucket info
const s3Client = new S3Client({ region: appEnv.AWS_REGION });

// Function to upload the file
async function uploadFileToS3(filePath: string, key: string) {
  try {
    // Read the HTML file
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Set up the S3 upload parameters
    const params = {
      Bucket: appEnv.AWS_BUCKET_NAME,
      Key: key,
      Body: fileContent,
      ContentType: "text/html", // Set the MIME type
    };

    // Uploading the file to the specified bucket
    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command);
    console.log(
      `File uploaded successfully`,
      `${appEnv.AWS_BUCKET_PUBLIC_URL}/${key}`
    );
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

interface S3File {
  key?: string;
  LastModified?: Date;
  url: string;
}

// Function to list files in a specific S3 path
async function listFilesInS3Path() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: appEnv.AWS_BUCKET_NAME, // The name of the bucket
      Prefix: `${appEnv.AWS_BUCKET_UPLOAD_PATH}`, // The "folder" or path to list
    });

    const data = await s3Client.send(command);
    const files: S3File[] = [];

    if (data.Contents) {
      console.log("Files in path:", appEnv.AWS_BUCKET_UPLOAD_PATH);
      data.Contents.forEach((item) => {
        files.push({
          key: item.Key,
          LastModified: item.LastModified,
          url: `${appEnv.AWS_BUCKET_PUBLIC_URL}/${item.Key}`,
        });
      });
    } else {
      console.log("No files found in the specified path.");
    }
    return files;
  } catch (error) {
    console.error("Error listing files:", error);
  }
}

interface IndexData {
  title: string;
  data: S3File[];
}
function compileReportIndex(data: IndexData) {
  // Path to the Handlebars template file
  const templatePath = path.join(process.cwd(), "reports", "template.hbs");

  // Read the template file from the file system
  const templateSource = fs.readFileSync(templatePath, "utf-8");

  // Compile the template
  const template = Handlebars.compile(templateSource);

  // Render the template with data
  const output = template(data);

  // Define the path where the HTML will be saved
  const outputPath = path.join(process.cwd(), 'reports', "index.html");

  // Write the rendered HTML to index.html
  fs.writeFileSync(outputPath, output);
}

export default async function () {
  const filePath = path.join(
    process.cwd(),
    "reports/",
    appEnv.JEST_HTML_REPORTER_FILE_NAME
  );
  if (appEnv.AWS_REPORT_UPLOAD) {
    await uploadFileToS3(filePath, `${appEnv.AWS_BUCKET_UPLOAD_PATH}/${appEnv.JEST_HTML_REPORTER_FILE_NAME}`);
    const files = await listFilesInS3Path();
    if (files && files.length > 0) {
      await compileReportIndex(({ title: "Test Reports", data: files }));


      const indexFilePath = path.join(
        process.cwd(),
        "reports/",
        "index.html"
      );

      await uploadFileToS3(indexFilePath, `${appEnv.AWS_BUCKET_UPLOAD_PATH}/index.html`);
    }
  }
}
