const { v4: uuidv4 } = require("uuid");
const download_pdf = require("./downloadFileFromStorage");
const insertToDB = require("./insertToDB");
const get_form_field_values = require("./getFormFieldValues");
const { default: axios } = require("axios");
const { Storage } = require("@google-cloud/storage");
const { runQuery } = require("./postgresQueries");
const fs = require("fs").promises;
const path = require("path");
const { postgresDB, schema, docAiClient, projectId } = require("../config");

const rajat_project = "rajat-demo-354311";
const storage = new Storage({
  projectId: rajat_project,
  keyFilename: "rajat_service_key.json",
});

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function downloadFromGCS(gcsUrl) {
  try {
    // Parse GCS URL (format: gs://bucket-name/path/to/file)
    const gcsPath = gcsUrl.replace("gs://", "");
    const [bucketName, ...pathParts] = gcsPath.split("/");
    const sourceFilename = pathParts.join("/");

    // Use the base filename as destination
    const destinationFilename = path.basename(sourceFilename);

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(sourceFilename);

    // Download options
    const options = {
      destination: destinationFilename,
    };

    await file.download(options);
    console.log(`Downloaded ${sourceFilename} to ${destinationFilename}`);
    return destinationFilename;
  } catch (error) {
    console.error("Error downloading file:", error);
    return null;
    // throw error;
  }
}

async function pollGoogleStorageUrl(gsUrl) {
  // Configuration
  const POLL_INTERVAL = 5000; // 5 seconds
  const TIMEOUT = 300000; // 5 minutes
  const startTime = Date.now();

  // Parse bucket and filename from gsUrl
  let bucket, filename;
  if (gsUrl.startsWith("gs://")) {
    const parts = gsUrl.replace("gs://", "").split("/");
    bucket = parts[0];
    filename = parts.slice(1).join("/");
  } else {
    const parts = gsUrl.split("/");
    bucket = parts[0];
    filename = parts.slice(1).join("/");
  }

  // Helper function to check if file exists
  async function checkFile() {
    try {
      const bucketObj = storage.bucket(bucket);
      const file = bucketObj.file(filename);
      const [exists] = await file.exists();
      return exists;
    } catch (error) {
      console.error("Error checking file:", error);
      return false;
    }
  }

  // Main polling loop
  while (Date.now() - startTime < TIMEOUT) {
    try {
      console.log(`Checking file: ${bucket}/${filename}`);
      const exists = await checkFile();

      if (exists) {
        console.log("File found!");
        return `gs://${bucket}/${filename}`;
      }

      console.log("File not found, waiting before next check...");
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
    } catch (error) {
      console.error("Error during polling:", error);

      // If it's a temporary issue, continue polling
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
    }
  }

  console.log("Timeout reached, file not found");
  return null;
}

async function transferFiles(sourceUrl, destinationUrl) {
  try {
    // Validate input URLs
    if (!sourceUrl.startsWith("gs://") || !destinationUrl.startsWith("gs://")) {
      throw new Error("Invalid URL format. Both URLs must start with gs://");
    }

    // Parse source URL
    const sourceParams = parseGcsUrl(sourceUrl);

    // Parse destination URL
    const destParams = parseGcsUrl(destinationUrl);

    // Initialize Storage clients for both projects
    const sourceStorage = new Storage();

    // Get source bucket and file
    const sourceBucket = sourceStorage.bucket(sourceParams.bucketName);
    const sourceFile = sourceBucket.file(sourceParams.filePath);

    // Get destination bucket and create write stream
    const destBucket = storage.bucket(destParams.bucketName);
    const destFile = destBucket.file(destParams.filePath);

    // Create read stream from source
    const readStream = sourceFile.createReadStream();

    // Create write stream to destination
    const writeStream = destFile.createWriteStream();

    // Handle potential errors
    readStream.on("error", (error) => {
      throw new Error(`Error reading from source: ${error.message}`);
    });

    writeStream.on("error", (error) => {
      throw new Error(`Error writing to destination: ${error.message}`);
    });

    // Return promise that resolves when transfer is complete
    return new Promise((resolve, reject) => {
      writeStream.on("finish", () => {
        console.log(
          `Successfully transferred ${sourceUrl} to ${destinationUrl}`
        );
        resolve();
      });

      writeStream.on("error", reject);

      // Pipe the read stream to the write stream
      readStream.pipe(writeStream);
    });
  } catch (error) {
    console.error("Transfer failed:", error);
    throw error;
  }
}

/**
 * Helper function to parse GCS URL into bucket name and file path
 * @param {string} gcsUrl - GCS URL to parse
 * @returns {{ bucketName: string, filePath: string }}
 */
function parseGcsUrl(gcsUrl) {
  // Remove 'gs://' prefix
  const urlWithoutPrefix = gcsUrl.replace("gs://", "");

  // Split into bucket name and file path
  const [bucketName, ...pathParts] = urlWithoutPrefix.split("/");

  // Join the remaining parts to form the file path
  const filePath = pathParts.join("/");

  if (!bucketName || !filePath) {
    throw new Error(`Invalid GCS URL format: ${gcsUrl}`);
  }

  return {
    bucketName,
    filePath,
  };
}

const getGCSJsonPaths = (pdfFileName) => {
  const GCS_BUCKET = "irs-docai-demo-app-ref-files";
  const STATIC_JSON_PATH = "irs-form-941x-files/inference";
  const GT_JSON_PATH = "irs-form-941x-files/groundtruth";

  // Handle special case for pdf_form_data

  return {
    inference: `gs://${GCS_BUCKET}/${STATIC_JSON_PATH}/inference_${pdfFileName.replace(
      ".pdf",
      ".json"
    )}`,
    groundTruth: `gs://${GCS_BUCKET}/${GT_JSON_PATH}/gt_${pdfFileName.replace(
      ".pdf",
      ".json"
    )}`,
  };
};

const getJsonPaths = (pdfFileName) => {
  // Handle special case for pdf_form_data
  if (pdfFileName.startsWith("pdf_form_data")) {
    return {
      inference: `../docAIJSON/${pdfFileName.replace(".pdf", ".json")}`,
      groundTruth: {},
    };
  }

  // Extract UUID from filename
  const uuidMatch = pdfFileName.match(
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
  );
  if (!uuidMatch) {
    throw new Error("No UUID found in filename");
  }
  const uuid = uuidMatch[0];

  // Handle incubator handwritten case
  if (pdfFileName.includes("incubator_handwritten")) {
    return {
      inference: `../docAIJSON/f941_${uuid}_pred.json`,
      groundTruth: `../gtDocAIJSON/f941_${uuid}_gt.json`,
    };
  }

  // Handle f941sb case
  if (pdfFileName.includes("f941sb")) {
    return {
      inference: `../docAIJSON/inference-f941sb_${uuid}.json`,
      groundTruth: `../gtDocAIJSON/groundtruth-f941sb_${uuid}.json`,
    };
  }

  // Handle regular irs_demo case
  const fileNumberMatch = pdfFileName.match(/0+(\d+)-f941/);
  const fileNumber = fileNumberMatch ? fileNumberMatch[1] : "";

  return {
    inference: `../docAIJSON/inference_${fileNumber.padStart(
      7,
      "0"
    )}-f941_${uuid}.json`,
    groundTruth: `../gtDocAIJSON/gt_${fileNumber.padStart(
      7,
      "0"
    )}-f941_${uuid}.json`,
  };
};

const cleanFieldName = (name, dontTrim) => {
  /**
     *  A column name must contain only letters (a-z, A-Z), numbers (0-9), or underscores (_), and it must start with a letter or underscore. The maximum column name length is 300 characters. A column name cannot use any of the following prefixes:

     */
  let removeExtraSpacesOrUnderScore = (txt) =>
    txt?.replace(/ |\/|\\/gi, "_")?.replace(/__/gi, "_");

  let cleanedWord = removeExtraSpacesOrUnderScore(
    (dontTrim ? name : name?.trim())?.replace(/[^a-z0-9_/\\ ]/gi, "")
  );
  if (cleanedWord?.startsWith("_")) {
    cleanedWord = cleanedWord?.slice(1, cleanedWord?.length);
    cleanedWord = removeExtraSpacesOrUnderScore(cleanedWord);
  }

  if (!isNaN(cleanedWord?.[0])) {
    cleanedWord = "a_" + cleanedWord?.slice(0, cleanedWord?.length);
    cleanedWord = removeExtraSpacesOrUnderScore(cleanedWord);
  }
  return cleanedWord;
};

const getUniqueArrayOfObjects = (ary, objectPropertName) => {
  let cleanProperty = (property) =>
    typeof property == "string" ? property?.trim().toLowerCase() : property;
  return ary.filter((elem, index) => {
    let filteredByProperty = ary?.findIndex((obj) => {
      let obj1V = obj?.[objectPropertName];
      let obj2V = elem?.[objectPropertName];
      let value1 = cleanProperty(obj1V);
      let value2 = cleanProperty(obj2V);
      return value1 == value2;
    });
    return filteredByProperty == index;
  });
};

const docAI = ({
  location,
  processorId,
  bucket_name,
  file_name,
  given_json,
  isTesting,
  formKeyPairTableName,
  processorName,
}) => {
  // const gcs_input_uri = 'gs://' + bucket_name + '/' + file_name
  return new Promise(async (resolve, reject) => {
    try {
      const file_names = file_name?.split("/");
      const exact_file_name_with_ext = file_names?.[file_names?.length - 1];
      let skip_docai = false;
      let isObject = (value) => {
        let jsonAfterParse = value;

        if (typeof value == "string") {
          //check if the object is stringified.
          try {
            jsonAfterParse = JSON.parse(value);
          } catch (e) {
            jsonAfterParse = value;
            console.log("Not an stringified object.");
          }
        }
        return (
          typeof jsonAfterParse == "object" &&
          !Array.isArray(jsonAfterParse) &&
          Object.keys(jsonAfterParse)?.length
        );
      };
      let jsonIsObject = isObject(given_json);
      const extract_from_json =
        (given_json &&
          typeof given_json == "string" &&
          given_json.length > 5) ||
        jsonIsObject;

      // The full resource name of the processor, e.g.:
      // projects/project-id/locations/location/processor/processor-id
      // You must create new processors in the Cloud Console first
      const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

      // Read the file into memory.

      let document = {};
      let gtDocument = {};
      if (extract_from_json) {
        console.log("JSON IS GIVEN !!!! ");
        if (!jsonIsObject) {
          let url = await getAuthUrl(given_json, storage);

          // console.log('url', url)

          let { data } = await axios.get(url);
          let isDataObj = isObject(data);

          // console.log('isDataObj', isDataObj)
          if (!isDataObj) {
            throw new Error(`Invalid Json.`);
          }
          document = data;
        } else {
          console.log("IS OBJECT = TRUE");
          document = given_json;
          console.log("LOADING AI FROM NODEJS");
        }
      }
      if (!extract_from_json) {
        console.log("JSON IS NOT GIVENNN !!!!");
        if (!bucket_name) {
          throw new Error(`Bucket Name Is Required.`);
        }

        // console.log(`Downloading File!`)

        // Convert the image data to a Buffer and base64 encode it.
        const encodedImage = await download_pdf(bucket_name, file_name);
        console.log("Download Finish.");
        // console.log('Encoding', encodedImage)
        const request = {
          name,
          document: {
            content: encodedImage,
            mimeType: "application/pdf",
          },
        };

        console.log(
          `AI Process started with Processor ID ${processorId} and file: gs://${bucket_name}/${file_name} .`
        );

        // Recognizes text entities in the PDF document
        
        let json_file = {};
        let gt_json_file = {};

        const uuidRegex =
          /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})-/;
        const filename_without_id = file_name.replace(uuidRegex, "");

        console.log("filename_without_id", filename_without_id);

        let json_file_obj = getGCSJsonPaths(filename_without_id);
        console.log("json_file_obj==>", json_file_obj);
        if (json_file_obj?.inference) {
          let json_file_name = await downloadFromGCS(json_file_obj?.inference);
          console.log("json_file_name-->", json_file_name);
          try {
            json_file = require(`../${json_file_name}`);
          } catch (error) {
            json_file = null;
          }
        }
        if (json_file_obj?.groundTruth) {
          let gt_json_file_name = await downloadFromGCS(
            json_file_obj?.groundTruth
          );
          try {
            gt_json_file = require(`../${gt_json_file_name}`);
          } catch (e) {
            gt_json_file = null;
          }
        }
        if (json_file) {
          skip_docai = true;
        }
        if (skip_docai) {
          await delay(10000)
          console.log("skipping docai");
          document = json_file;
          gtDocument = gt_json_file || {};
        } else {
          let custom_docai = false;
          let destination_url = "";
          let destination_json_url = "";
          if (processorName == "Form 941") {
            destination_url = `gs://irs_dai_demo_01_2025/auto_uploaded/pdf/941/${file_name}`;
            destination_json_url = `gs://irs_dai_demo_01_2025/auto_uploaded/output_json/941/${file_name.replace(
              ".pdf",
              ".json"
            )}`;
          } else if (processorName == "Form 941 Schedule B") {
            destination_url = `gs://irs_dai_demo_01_2025/auto_uploaded/pdf/941_schedule_b/${file_name}`;
            destination_json_url = `gs://irs_dai_demo_01_2025/auto_uploaded/output_json/941_schedule_b/${file_name.replace(
              ".pdf",
              ".json"
            )}`;
          } else if (processorName == "Form 941 Schedule R") {
            destination_url = `gs://irs_dai_demo_01_2025/auto_uploaded/pdf/941_schedule_r/${file_name}`;
            destination_json_url = `gs://irs_dai_demo_01_2025/auto_uploaded/output_json/941_schedule_r/${file_name.replace(
              ".pdf",
              ".json"
            )}`;
          }

          if (custom_docai ) {
            console.log("processor name==>", processorName);
            let source_url = `gs://${bucket_name}/${file_name}`;

            await transferFiles(source_url, destination_url);
            destination_json_url = await pollGoogleStorageUrl(
              destination_json_url
            );
            console.log("destination_json_url-->", destination_json_url);
            if (!destination_json_url) {
              return reject({
                status: "pending",
              });
            }
            let json_file_name = await downloadFromGCS(destination_json_url);

            try {
              json_file = require(`../${json_file_name}`);
            } catch (error) {
              json_file = null;
            }
            document = json_file;
          } else {
            const [result] = await docAiClient.processDocument(request);
            document = result?.document;
          }
          try {
            await fs.writeFile(
              "response.json",
              JSON.stringify(document, null, 2),
              "utf8"
            );
            console.log("Successfully wrote response.json");
          } catch (error) {
            console.error("Error writing response.json:", error);
          }
        }
        let obj = {};
        for (var e of document?.entities) {
          if (e?.properties?.length) {
            if (!obj[e?.type]) {
              obj[e?.type] = [];
            }
            let objChild = {};
            for (var p of e?.properties) {
              var field_name = p?.type?.split("/")?.slice(-1)?.[0];
              objChild[field_name] = p?.mentionText;
            }
            obj[e?.type]?.push(objChild);
          } else {
            obj[e?.type] = e?.mentionText;
          }
        }
        let sqlQuery = `INSERT INTO ${schema}.export_table (file_name, processor_name, processor_id, all_fields, created_at) VALUES ('${file_name}', '${processorName}', '${processorId}', '${JSON.stringify(
          obj
        )}'::jsonb, NOW());`;
        await runQuery(postgresDB, sqlQuery);
        console.log("AI Process end.");
      }

      // return document
      // Get all of the document text as one big string
      const { text } = document;
      const gtText = gtDocument?.text;

      // Read the text recognition output from the processor
      console.log("The document contains the following paragraphs:");
      const pages = document.pages || [];
      let entities = document.entities || [];

      let gtEntities = gtDocument.entities || [];
      // const [page1] = pages;
      // const { paragraphs } = page1;

      try {
        if (!isTesting && text) {
          console.log("pdf_document start");
          insertToDB.pdf_document({
            file_name: exact_file_name_with_ext || "",
            pages_count: pages?.length || 0,
            entities_count: entities?.length || 0,
            text,
          });

          console.log("pdf_document end");
        }
      } catch (e) {
        console.log("e", e);
      }

      let pagesArray = [];

      for (const page of pages) {
        try {
          if (!isTesting) {
            console.log("pdf_pages start");
            pagesArray.push(
              insertToDB.pdf_pages({
                file_name: exact_file_name_with_ext,
                dimensions: page.dimension,
                pageNumber: page?.pageNumber || page?.page_number,
                paragraphs: page.paragraphs,
              })
            );
            console.log("pdf_pages end");
          }
        } catch (e) {
          console.error(e);
        }
      }

      await Promise.all(pagesArray);

      let pageFormFieldsArray = [];
      console.log("**************************************");
      for (let i = 0; i < pages.length; i++) {
        let page = pages?.[i];
        let pageNumber = page?.pageNumber || page?.page_number;

        console.log("pageNumber", pageNumber);

        const formFields = page?.formFields || page?.form_fields;

        if (Array.isArray(formFields)) {
          for (const formField of formFields) {
            let formfieldValues = get_form_field_values(
              formField,
              { text, pageNumber, exact_file_name_with_ext },
              isTesting
            );
            pageFormFieldsArray.push(formfieldValues);
          }
        }
      }

      let entitiesArray = [];
      let extraProperties =
        entities
          ?.map((d) => d?.properties)
          ?.filter((d) => Array.isArray(d) && d?.length) || [];
      let hasExtraProperties =
        Array.isArray(extraProperties) && extraProperties.length;
      if (hasExtraProperties) {
        extraProperties = extraProperties.flat();
      } else {
        extraProperties = [];
      }

      let pageEntitiesArray = [];
      let gtPageEntitiesArray = [];

      if (Array.isArray(entities)) {
        for (const entity of entities) {
          // console.log("form field going------------", formField)
          const pageNumber =
            parseInt(
              entity?.pageAnchor?.pageRefs?.[0]?.page ||
                entity?.page_anchor?.page_refs?.[0]?.page
            ) + 1 || 1;
          let entityValues = get_form_field_values(
            entity,
            { text, pageNumber, exact_file_name_with_ext },
            isTesting
          );
          if (Array.isArray(entity?.properties) && entity?.properties?.length) {
            for (let sub_entity of entity?.properties) {
              let parent_field_name = entity?.type;
              if (!sub_entity["type"]?.includes(`${parent_field_name}/`)) {
                sub_entity[
                  "type"
                ] = `${parent_field_name}/${sub_entity["type"]}`;
              }
              entityValues = get_form_field_values(
                sub_entity,
                { text, pageNumber, exact_file_name_with_ext },
                isTesting
              );

              pageEntitiesArray.push(entityValues);
            }
          } else {
            pageEntitiesArray.push(entityValues);
          }
        }
      }

      if (Array.isArray(gtEntities)) {
        for (const entity of gtEntities) {
          // console.log("form field going------------", formField)
          const pageNumber =
            parseInt(
              entity?.pageAnchor?.pageRefs?.[0]?.page ||
                entity?.page_anchor?.page_refs?.[0]?.page
            ) + 1 || 1;
          let entityValues = get_form_field_values(
            entity,
            { text: gtText, pageNumber, exact_file_name_with_ext },
            isTesting
          );
          if (Array.isArray(entity?.properties) && entity?.properties?.length) {
            for (let sub_entity of entity?.properties) {
              let parent_field_name = entity?.type;
              sub_entity["type"] = `${parent_field_name}/${sub_entity["type"]}`;
              entityValues = get_form_field_values(
                sub_entity,
                { text: gtText, pageNumber, exact_file_name_with_ext },
                isTesting
              );

              gtPageEntitiesArray.push(entityValues);
            }
          } else {
            gtPageEntitiesArray.push(entityValues);
          }
        }
      }

      console.log("entityValues==>", pageEntitiesArray);
      // if (Array.isArray(entities) && entities?.length) {
      //     if (hasExtraProperties) {
      //         entities = [...entities, ...extraProperties]
      //     }
      //     for (const entity of entities) {
      //         entitiesArray.push(get_form_field_values(entity, { type: typeEntities, text, exact_file_name_with_ext, isEntity: true }, isTesting))
      //     }
      // }

      let trim = (v) => (typeof v == "string" ? v?.trim() : v);

      const arrayToString = (arryy) =>
        arryy
          ?.map((d) => trim(d))
          ?.filter(Boolean)
          ?.toString();
      // let formFieldsValues = arrayToString(pageFormFieldsArray)
      let formFieldsValues = arrayToString(pageEntitiesArray);
      let gtFormFieldsValues = arrayToString(gtPageEntitiesArray);
      let pageFormFieldsValues = arrayToString(pageFormFieldsArray);
      // let formEntities = arrayToString(entitiesArray)

      console.log("insert_form_key_pair_with_values start");
      let insert_form_fields =
        !isTesting && formFieldsValues?.length
          ? insertToDB.insert_form_key_pair_with_values({
              formKeyPairTableName,
              VALUES: formFieldsValues,
            })
          : null;

      let insert_gt_form_fields =
        !isTesting && gtFormFieldsValues?.length
          ? insertToDB.insert_gt_form_key_pair_with_values({
              formKeyPairTableName: `${schema}.gt_schema_form_key_pair`,
              VALUES: gtFormFieldsValues,
            })
          : null;

      let insert_page_form_fields =
        !isTesting && pageFormFieldsValues?.length
          ? insertToDB.insert_gt_form_key_pair_with_values({
              formKeyPairTableName,
              VALUES: pageFormFieldsValues,
            })
          : null;

      console.log("insert_form_key_pair_with_values end");

      console.log("insert_form_key_pair_with_values start");

      // let insert_form_entities = (!isTesting && formEntities?.length) ? insertToDB.insert_form_key_pair_with_values({ formKeyPairTableName, VALUES: formEntities }) : null

      console.log("insert_form_key_pair_with_values end");

      let finalResult = null;
      let failedRequests = [];
      try {
        if (!isTesting) {
          if (skip_docai) {
            finalResult = await Promise.allSettled([
              ...pagesArray,
              insert_form_fields,
              insert_gt_form_fields,
              insert_page_form_fields,
            ]);
          } else {
            finalResult = await Promise.allSettled([
              ...pagesArray,
              insert_form_fields,
              insert_page_form_fields,
            ]);
          }
          failedRequests = finalResult?.filter(
            (res) => res.status !== "fulfilled"
          );
        }
      } catch (e) {
        console.error(e);
      }

      console.log("FUNCTION COMPLTES ~!!");

      // return document

      // console.log('entituesss ', entitiesArray)
      let schemaForJSON = entitiesArray.map((d) => ({
        name: cleanFieldName(d?.field_name),
        type: "STRING",
        mode: "NULLABLE",
      }));
      const bigquerySchema = getUniqueArrayOfObjects(schemaForJSON, "name");
      // console.log('bigquerySchema', JSON.stringify(bigquerySchema))
      resolve({
        original_entities: document?.entities?.length || 0,
        extracted_entities: entitiesArray?.length,
        // key_pair_counts: pageFormFieldsArray?.length,
        key_pair_counts: pageEntitiesArray?.length,
        failureCount: failedRequests?.length,
        failedRequests,
        formKeyPairTableName,
        schemaJSON: bigquerySchema,
      });
    } catch (e) {
      console.log("error from doc_ai.js", JSON.stringify(e));
      reject(e);
    }
  });
};

const isFalsyValue = (value) => {
  // console.log(value)
  if (typeof value == "number") {
    //returns boolean form of number, 0 will be false, all others true.
    return Boolean(value);
  } else if (typeof value == "boolean") {
    //if its boolean return opposite boolean, means if boolean true, it will return false, if boolean is false, returns true.
    return !value;
  } else if (Array.isArray(value)) {
    //if its empty array it will return true
    return Boolean(value?.length);
  } else if (value && typeof value == "object") {
    //if empty object, returns true
    return Boolean(Object.keys(value)?.length);
  } else {
    //now lets check for string
    return (
      !value ||
      value == undefined ||
      value == null ||
      value?.trim()?.toLowerCase() == "null" ||
      value?.trim()?.toLowerCase() == "undefined" ||
      value?.trim()?.toLowerCase() == "false"
    );
  }
};

const docAIv3 = async (obj) => {
  // console.log(req,'====>request')
  const id = uuidv4();
  const documentTable = `${schema}.documents`;
  const should_update = true;

  // let queryLocation = req?.query?.location
  let bodyLocation = obj?.location;
  let defaultLocation = "us";

  // let queryProcessorId = req?.query?.processorId
  let bodyProcessorId = obj?.processorId;
  let defaultProcessorId = "478e2c892dc83bbc";

  const location = !isFalsyValue(bodyLocation) ? bodyLocation : defaultLocation;
  const processorId = !isFalsyValue(bodyProcessorId)
    ? bodyProcessorId
    : defaultProcessorId; // Create processor in Cloud Console
  const processorName = obj?.processorName;
  const formKeyPairTableName = `${schema}.schema_form_key_pairs`; // table to save keypairs data.

  var gcs_input_uri = obj?.gcs_input_uri;
  var match = gcs_input_uri?.match(/gs:\/\/(.+?)\/(.+)/i);

  const file_name = match?.[2];
  const bucket_name = match?.[1];

  console.log(
    "BUCKEt",
    bucket_name,
    "f",
    file_name,
    gcs_input_uri,
    "body",
    obj
  );

  const given_json = {};
  // const isTesting = true
  const isTesting = !isFalsyValue(obj?.isTesting);

  let removeQuotes = (txt) =>
    typeof txt?.replace == "function" ? txt?.replace(/[''`]+/g, "") : txt;

  let updateAttempts = async (error) => {
    try {
      if (!isTesting) {
        let justFileName = file_name?.slice(
          file_name.lastIndexOf("/") + 1,
          file_name.length
        );

        let query = `SELECT * FROM ${documentTable} where file_name='${justFileName}'`;
        // let artifactData = await runBigQuery(query)
        let artifactData = await runQuery(postgresDB, query);
        let numberOfAttempt =
          parseInt(artifactData[0]?.number_of_attempts) || 0;
        let hasError = Boolean(error);
        let errorStr = hasError ? `'${removeQuotes(error)}'` : null;

        let updateQuery = `UPDATE ${documentTable} SET number_of_attempts=${
          numberOfAttempt + 1
        }, error=${errorStr} where file_name='${justFileName}' `;
        console.log("qury1", query, "query2", updateQuery);
        // await runBigQuery(updateQuery)
        await runQuery(postgresDB, updateQuery);
        console.log("hasError", hasError);
        console.log(hasError ? "Operation Failed" : `ALL DONE SUCCESFULLY`);
      }
    } catch (e) {
      console.log("attempts error", e);
    }
  };

  try {
    if (!given_json) {
      throw new Error("Missing JSON");
    }
    // if (!isTesting) {
    //     axios.post(`https://context-api-2my7afm7yq-ue.a.run.app/api/image_crop_vision_ai`, { gcs_input_uri })
    //         .then((d) => {
    //             console.log('Succesfully Added Custom Fields using Vision AI', d?.data)
    //         })
    //         .catch(e => {
    //             console.error(`Custom fields from vision A.I failed`, e)
    //         })
    // }

    let result = await docAI({
      location,
      processorId,
      file_name,
      bucket_name,
      id,
      given_json,
      isTesting,
      formKeyPairTableName,
      processorName,
    });

    console.log("result", JSON.stringify(result));

    await updateAttempts();

    if (should_update) {
      let justFileName = file_name?.slice(
        file_name.lastIndexOf("/") + 1,
        file_name.length
      );
      let query = `UPDATE ${schema}.documents SET is_completed=${true} WHERE file_name='${justFileName}'`;
      await runQuery(postgresDB, query);
    }
    // call here
    callOcrHitlFindings(gcs_input_uri);

    let obj = {
      success: true,
      result,
    };
    return obj;
  } catch (e) {
    console.log("eeee", e);
    let error = e?.message ? e.message : e.toString();
    console.error("docAI index.js error", error);

    await updateAttempts(error);

    let obj = {
      message: error,
      error: e.toString(),
    };
    return obj;
  }
};

async function callOcrHitlFindings(gsUrl) {
  try {
    const baseUrl = process.env.PYTHON_URL || "http://localhost:8000";
    const encodedUrl = encodeURIComponent(gsUrl);
    const response = await fetch(
      `${baseUrl}/api/v1/field-findings/ocr-hitl-findings?gs_url=${encodedUrl}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log("HITL response", response.status);
      // throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error calling OCR HITL Findings API:", error);
    // throw error;
  }
}

module.exports = docAIv3;
