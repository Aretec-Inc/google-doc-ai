require('dotenv').config()
const exec = require('child_process').exec
// const { projectId } = require('./config/gcpConfig')

// const service_key = require('./service_key.json')

// const projectId = service_key?.project_id

const projectId = process?.env?.projectId

const deployApp = () => {

  const serviceAccount = `doc-ai@${projectId}.iam.gserviceaccount.com`
  const postgresPassword = `postgres`

  console.log('******')

  // exec(`gcloud auth login && gcloud auth activate-service-account --key-file=./service_key.json`, (error, stdout, stderr) => {
  //   console.log('gcloud auth activate-service-account --key-file=./service_key.json', error, stdout, stderr)
  // })
  try {
    exec(`gcloud auth login && gcloud config set project ${projectId} && gcloud services enable cloudbuild.googleapis.com && gcloud services enable containerregistry.googleapis.com && gcloud services enable secretmanager.googleapis.com && gcloud services enable servicenetworking.googleapis.com && gcloud services enable vpcaccess.googleapis.com && gcloud services enable documentai.googleapis.com`, async (error, stdout, stderr) => {
      console.log('stdout: svc', stdout, error)

      exec(`gcloud iam service-accounts create doc-ai --display-name "doc-ai" && gcloud projects add-iam-policy-binding ${projectId} --member "serviceAccount:${serviceAccount}" --role "roles/editor" && gcloud projects add-iam-policy-binding ${projectId} --member "serviceAccount:${serviceAccount}" --role "roles/documentai.admin" && gcloud projects add-iam-policy-binding ${projectId} --member "serviceAccount:${serviceAccount}" --role "roles/storage.admin"`, async (error, stdout, stderr) => {
        console.log('created', error, stdout, stderr)
      })

      // const service_key = require('./service_key.json')
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
      let appName = `doc-ai`
      let imageUrl = `gcr.io/${projectId}/${appName}`
      let cloudInstance = `${projectId}:${region}:${dbName}`

      console.log('db config')

      exec(`gcloud services enable sqladmin.googleapis.com && gcloud services enable cloudresourcemanager.googleapis.com && gcloud compute addresses create google-managed-services-default --global --prefix-length=16 --description="peering range for Google" --network=default --purpose=VPC_PEERING`, (error, stdout, stderr) => {

        console.log('vpc', stdout, error)
        // 
        exec(`gcloud services vpc-peerings connect --service=servicenetworking.googleapis.com --ranges=google-managed-services-default --network=default`, (error, stdout, stderr) => {

          console.log('stdout network db creating', stdout, error)

          exec(`gcloud sql instances create ${dbName} --database-version=POSTGRES_14 --cpu=1 --memory=3840MiB --storage-size=20480MiB --network=default --no-assign-ip --region=${region}`, (error, stdout, stderr) => {

            console.log('stdout', stdout, error)

            let privateIp = stdout?.split(' ')?.filter(v => v).slice(-2,)[0]
            console.log('privateIp', privateIp)

            exec(`gcloud sql users set-password postgres --instance=${dbName} --password=${postgresPassword}`, (error, stdout, stderr) => {
              console.log('password updated', stdout, error)
            })

            exec(`gsutil mb gs://${bucketName} && gsutil uniformbucketlevelaccess set off gs://${bucketName}`, (error, stdout, stderr) => {
              console.log('storage', stdout)
            })

            exec(`gcloud compute networks create default --subnet-mode=auto`, (error, stdout, stderr) => {
              console.log('vpc done')
            })

            exec(`gcloud compute networks vpc-access connectors create doc-ai-vpc --region=${region} --network=default --range=10.0.0.0/28 --min-instances=2 --max-instances=10 --machine-type=e2-micro`, (error, stdout, stderr) => {
              console.log('stdout: db', stdout, error)
            })

            exec(`gcloud builds submit --tag ${imageUrl} --timeout=9000 --machine-type=n1-highcpu-32`, (error, stdout, stderr) => {
              exec(`gcloud services enable run.googleapis.com && gcloud run deploy ${appName} --image=${imageUrl}:latest --set-env-vars "^@^ALLOWED_ORIGIN=https://doc-ai-znp7f527ca-uc.a.run.app@DB_USER=postgres@DB_PASSWORD=${postgresPassword}@DB_HOST=${privateIp}@storage_bucket=${bucketName}@projectId=${projectId}" --set-cloudsql-instances=${cloudInstance} --vpc-connector=projects/${projectId}/locations/${region}/connectors/doc-ai-vpc --allow-unauthenticated --region=${region} --project=${projectId} --service-account=${serviceAccount} && gcloud run services update-traffic ${appName} --to-latest --region=${region}`, (error, stdout, stderr) => {

                console.log('stdout***', stdout?.split(' ')?.filter(v => v)?.[1]?.split('\r\n')[0])
                const HOST = stdout?.split(' ')?.filter(v => v)?.[1]?.split('\r\n')[0]

                exec(`gcloud run deploy ${appName} --image=${imageUrl}:latest --set-env-vars "^@^ALLOWED_ORIGIN=${HOST}@DB_USER=postgres@DB_PASSWORD=${postgresPassword}@DB_HOST=${privateIp}@storage_bucket=${bucketName}@projectId=${projectId}" --set-cloudsql-instances=${cloudInstance} --vpc-connector=projects/${projectId}/locations/${region}/connectors/doc-ai-vpc --allow-unauthenticated --region=${region} --project=${projectId} --service-account=${serviceAccount} && gcloud run services update-traffic ${appName} --to-latest --region=${region}`, (error, stdout, stderr) => {
                  console.log('stdout: cloud run', stdout)
                })
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
