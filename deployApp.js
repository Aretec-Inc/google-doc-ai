require('dotenv').config()
const exec = require('child_process').exec
const axios = require('axios')
// const { projectId } = require('./config/gcpConfig')

const service_key = require('./service_key.json')

const projectId = service_key?.project_id

const deployApp = () => {
  try {
    exec(`gcloud auth activate-service-account --key-file=./service_key.json && gcloud config set project ${projectId} && gcloud services enable cloudbuild.googleapis.com && gcloud services enable containerregistry.googleapis.com && gcloud services enable secretmanager.googleapis.com && gcloud services enable servicenetworking.googleapis.com && gcloud services enable vpcaccess.googleapis.com`, async (error, stdout, stderr) => {
      console.log('stdout: svc', stdout, error)

      try {
        exec('gcloud services enable contentwarehouse.googleapis.com', (error, stdout, stderr) => {
          console.log('stdout: enable error', stdout, error)
        })
      }
      catch (e) {
        console.log('enable error', e)
      }

      let dbName = 'doc-ai-db'
      let region = 'us-central1'
      let bucketName = `doc_ai_${projectId}`
      let appName = `doc-ai-new`
      let imageUrl = `gcr.io/${projectId}/${appName}`
      let cloudInstance = `${projectId}:${region}:${dbName}`
      const apiUrl = `https://createprcessor-znp7f527ca-uc.a.run.app/create_processor`

      let body = {
        project_id: service_key.project_id,
        location: 'us',
        service_account_json: service_key
      }

      try {
        axios.post(apiUrl, body)
          .then((res) => {
            const { data } = res
            console.log('api response', data)
          })
          .catch((e) => console.log('api error', e))
      }
      catch (e) {
        console.log('api catch', e)
      }

      console.log('db creating')

      exec(`gcloud services enable sqladmin.googleapis.com && gcloud compute addresses create google-managed-services-default --global --prefix-length=16 --description="peering range for Google" --network=default --purpose=VPC_PEERING`, (error, stdout, stderr) => {
        // 
        exec(`gcloud sql instances create ${dbName} --database-version=POSTGRES_14 --cpu=1 --memory=3840MiB --storage-size=20480MiB --network=default --no-assign-ip --region=${region}`, (error, stdout, stderr) => {

          console.log('stdout', stdout, error)

          let privateIp = stdout?.split(' ')?.filter(v => v).slice(-2,)[0]
          console.log('privateIp', privateIp)

          exec(`gcloud sql users set-password postgres --instance=${dbName} --password=postgres`, (error, stdout, stderr) => {
            console.log('password updated', stdout, error)
          })

          exec(`gsutil mb gs://${bucketName} && gsutil uniformbucketlevelaccess set off gs://${bucketName}`, (error, stdout, stderr) => {
            console.log('storage', stdout)
          })

          exec(`gcloud compute networks vpc-access connectors create doc-ai-vpc --region=${region} --network=default --range=10.0.0.0/28 --min-instances=2 --max-instances=10 --machine-type=e2-micro`, (error, stdout, stderr) => {
            console.log('stdout: db', stdout, error)
          })

          exec(`gcloud builds submit --tag ${imageUrl} --timeout=9000 --machine-type=n1-highcpu-32`, (error, stdout, stderr) => {
            exec(`gcloud run deploy ${appName} --image=${imageUrl}:latest --set-env-vars "^@^ALLOWED_ORIGIN=https://doc-ai-znp7f527ca-uc.a.run.app@DB_USER=postgres@DB_PASSWORD=postgres@DB_HOST=${privateIp}@storage_bucket=${bucketName}" --set-cloudsql-instances=${cloudInstance} --vpc-connector=projects/${projectId}/locations/${region}/connectors/doc-ai-vpc --allow-unauthenticated --region=${region} --project=${projectId} && gcloud run services update-traffic ${appName} --to-latest --region=${region}`, (error, stdout, stderr) => {


              console.log('stdout***', stdout?.split(' ')?.filter(v => v)?.[1]?.split('\r\n')[0])
              const HOST = stdout?.split(' ')?.filter(v => v)?.[1]?.split('\r\n')[0]

              exec(`gcloud run deploy ${appName} --image=${imageUrl}:latest --set-env-vars "^@^ALLOWED_ORIGIN=${HOST}@DB_USER=postgres@DB_PASSWORD=postgres@DB_HOST=${privateIp}@storage_bucket=${bucketName}" --set-cloudsql-instances=${cloudInstance} --vpc-connector=projects/${projectId}/locations/${region}/connectors/doc-ai-vpc --allow-unauthenticated --region=${region} --project=${projectId} && gcloud run services update-traffic ${appName} --to-latest --region=${region}`, (error, stdout, stderr) => {
                console.log('stdout: cloud run', stdout)
              })
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