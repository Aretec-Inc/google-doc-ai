require('dotenv').config()
const exec = require('child_process').exec
// const { projectId } = require('./config/gcpConfig')

const service_key = require('./service_key.json')

const projectId = service_key?.project_id

const deployApp = () => {
  try {
    exec(`gcloud auth activate-service-account --key-file=./service_key.json && gcloud config set project ${projectId} && gcloud services enable contentwarehouse.googleapis.com && gcloud services enable cloudbuild.googleapis.com && gcloud services enable containerregistry.googleapis.com && gcloud services enable secretmanager.googleapis.com`, async (error, stdout, stderr) => {
      console.log('stdout: svc', stdout, error)

      let dbName = 'doc-ai-db'
      let region = 'us-east1'
      let bucketName = `doc_ai_${projectId}`
      let appName = `doc-ai-new`
      let imageUrl = `gcr.io/${projectId}/${appName}`
      let cloudInstance = `${projectId}:${region}:${dbName}`

      exec(`gcloud sql instances ${dbName} --database-version=POSTGRES_14 --cpu=1 --memory=3840MiB --storage-size=20480MiB --network=default --no-assign-ip --region=${region}`, (error, stdout, stderr) => {

        let privateIp = stdout?.split(' ')?.filter(v => v).slice(-2,)[0]
        console.log('privateIp', privateIp)

        exec(`gcloud compute networks vpc-access connectors create doc-ai-vpc --region=${region} --network=default --range=10.0.0.0/28 --min-instances=2 --max-instances=10 --machine-type=e2-micro && gsutil mb gs://${bucketName} && gsutil uniformbucketlevelaccess set off gs://${bucketName}`, (error, stdout, stderr) => {
          console.log('stdout: db', stdout, error)
        })

        exec(`gcloud builds submit --tag ${imageUrl} --timeout=9000 --machine-type=n1-highcpu-32`, (error, stdout, stderr) => {
          exec(`gcloud run deploy ${appName} --image=${imageUrl}:latest --set-env-vars "^@^ALLOWED_ORIGIN=https://doc-ai-znp7f527ca-uc.a.run.app@DB_USER=postgres@DB_PASSWORD=postgres@DB_HOST=${privateIp}" --set-cloudsql-instances=${cloudInstance} --vpc-connector=projects/${projectId}/locations/${region}/connectors/doc-ai-vpc --allow-unauthenticated --region=${region} --project=${projectId} && gcloud run services update-traffic ${appName} --to-latest --region=${region}`, (error, stdout, stderr) => {

            const HOST = stdout?.split(' ')?.filter(v => v)?.[0]?.split('\n')?.[0]

            exec(`gcloud run deploy ${appName} --image=${imageUrl}:latest --set-env-vars "^@^ALLOWED_ORIGIN=${HOST}@DB_USER=postgres@DB_PASSWORD=postgres@DB_HOST=${privateIp}" --set-cloudsql-instances=${cloudInstance} --vpc-connector=projects/${projectId}/locations/${region}/connectors/doc-ai-vpc --allow-unauthenticated --region=${region} --project=${projectId} && gcloud run services update-traffic ${appName} --to-latest --region=${region}`, (error, stdout, stderr) => {
              console.log('stdout: cloud run', stdout)
            })
          })
        })
      })
    })
  }
  catch (e) {
    console.log('e', e)
  }
}

deployApp()