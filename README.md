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
- Now click on the service account you created Click on Keys Tab and click Add key button.
- Click on Create New key and save it rename file to service_key.json.
- Rename the downloaded key to service_key.json.
- Put this file to Google-doc-ai-master folder in the Repo.

## 4. Create And Deploy through gcloud (Manually)

Follow the instructions provided in this section to install gcloud on your system and deploy the app.

## 5. Create And Deploy through Script (Automatically)

Run the following command to deploy the app on your project:

```bash
npm run deploy-app
