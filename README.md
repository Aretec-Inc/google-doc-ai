# Google Document AI

## 1. Overview

Google Document AI is a cloud-based document processing service that uses machine learning to extract structured data from unstructured documents. It can process a variety of documents, including invoices, receipts, contracts, and forms. Document AI extracts text, tables, and key-value pairs from documents, and can also classify documents by type.

### Capabilities of Google Document AI include:

- Extracting text and layout information from documents
- Identifying key-value pairs in structured forms
- Splitting and classifying documents by type
- Extracting and normalizing entities
- Labeling and reviewing documents

### Prerequisites

This codelab builds upon content presented in other Document AI codelabs. It is recommended that you read the following documentation and codelabs before proceeding:

- Quickstart: Set up the Document AI API
- Process documents by using the Google Cloud console
- Managing Document AI processors with Python
- Create Document AI Service Account

## 2. Validate Access to Code

Git Repo: [https://github.com/Aretec-Inc/google-doc-ai](https://github.com/Aretec-Inc/google-doc-ai)

## 3. Create a Service Account for the App

- Open the GCP search bar and type 'IAM', then select IAM from the search results.
- Click on Service Accounts in the left side bar.
- Click on Create Service Account.
- Input the name of your service account and click create and continue.
- In the Next Step Give Owner Access OR Follow Step 6 To Add Specific Roles.
- Roles needed to deploy the App:
  - Cloud Build Editor
  - Storage Admin
  - Service Networking Admin
  - Serverless VPC Access Admin
  - Document AI Administrator
  - Content Warehouse Admin
  - Cloud SQL Aadmin
  - Resource Manager Project IAM Admin
  - Cloud Run Admin

## 4. Create And Deploy through gcloud (Manually)

Follow the instructions provided in this section to install gcloud on your system and deploy the app.

# Google Cloud Project Setup

## Prerequisites

Install gcloud on your system following this [link](https://cloud.google.com/sdk/docs/install).

## Setup Steps

1. In the 'google-doc-ai' project directory, initiate your command line interface. Following that, execute the authentication process by selecting the account intended for the app's deployment:

    ```bash
    gcloud auth login
    ```

2. Set your project ID:

    ```bash
    gcloud config set project <PROJECT_ID_HERE>
    ```

3. Enable necessary APIs:

    ```bash
    gcloud services enable cloudbuild.googleapis.com && 
    gcloud services enable containerregistry.googleapis.com && 
    gcloud services enable secretmanager.googleapis.com && 
    gcloud services enable servicenetworking.googleapis.com && 
    gcloud services enable vpcaccess.googleapis.com && 
    gcloud services enable documentai.googleapis.com && 
    gcloud services enable sqladmin.googleapis.com && 
    gcloud services enable run.googleapis.com && 
    gcloud services enable cloudresourcemanager.googleapis.com
    ```

4. Enable additional APIs if required:

    ```bash
    gcloud services enable contentwarehouse.googleapis.com
    ```

5. Create a default VPC:

    ```bash
    gcloud compute addresses create google-managed-services-default --global --prefix-length=16 --description="peering range for Google" --network=default --purpose=VPC_PEERING
    ```

6. Connect with your VPC network:

    ```bash
    gcloud services vpc-peerings connect --service=servicenetworking.googleapis.com --ranges=google-managed-services-default --network=default
    ```

7. Create a database instance:

    ```bash
    gcloud sql instances create doc-ai-db --database-version=POSTGRES_14 --cpu=1 --memory=3840MiB --storage-size=20480MiB --network=default --no-assign-ip --region=us-central1
    ```

8. Update the database password:

    ```bash
    gcloud sql users set-password postgres --instance=doc-ai-db --password=postgres
    ```

9. Create a Serverless VPC:

    ```bash
    gcloud compute networks vpc-access connectors create doc-ai-vpc --region=us-central1 --network=default --range=10.8.0.0/28 --min-instances=2 --max-instances=10 --machine-type=e2-micro
    ```

10. Create a Cloud Storage Bucket (Bucket name should be unique so you can concatenate your project id with the Bucket name):

    ```bash
    gsutil mb gs://BUCKET_NAME_PROJECT_ID && gsutil uniformbucketlevelaccess set off gs://BUCKET_NAME_PROJECT_ID
    ```

11. Create a build (replace `$PROJECT_ID` with your project ID):

    ```bash
    gcloud builds submit --tag gcr.io/$PROJECT_ID/doc-ai --timeout=9000 --machine-type=n1-highcpu-32
    ```

12. Deploy the app on Cloud Run (replace `$PROJECT_ID`, `PRIVATE_IP_HERE`, and `BUCKET_NAME_HERE` with your respective values):

    ```bash
    gcloud run deploy doc-ai --image=gcr.io/$PROJECT_ID/doc-ai:latest --set-env-vars "^@^DB_USER=postgres@DB_PASSWORD=postgres@DB_HOST=PRIVATE_IP_HERE@storage_bucket=BUCKET_NAME_HERE" --set-cloudsql-instances=$PROJECT_ID:us-central1

## 5. Create And Deploy through Script (Automatically)

## Setup Instructions


1. Create a `.env` file in the root directory of the project.

2. Inside the `.env` file, add the following line:
    projectId=$PROJECT_ID
    Replace `'$PROJECT_ID'` with the ID of the project where you wish to deploy the app.

3. Ensure that your account has the appropriate access rights to the specified project. Without the necessary permissions, the deployment will not be successful.

4. Run the following command to deploy the app on your project:

```bash
npm run deploy-app


## Start Instructions
Update .env file with 

DB_HOST=""
DB_USER=""""
DB_PASSWORD=""

##  Backend
# Install node modules

npm i

# Start Frontend

yarn dev-cloud

## Frontend
cd client

yarn start-client

## 
gcloud builds submit --machine-type=E2_HIGHCPU_32 --tag gcr.io/ldh-bot-rwec/irs-doc-ai  

