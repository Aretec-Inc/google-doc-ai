provider "google" {
  project = "ldh-bot-rwec"
  region  = "us-central1"
}

resource "google_cloud_run_service" "doc-ai" {
  name     = "doc-ai"
  location = "us-central1"

  template {
    spec {
      containers {
        image = "gcr.io/ldh-bot-rwec/doc-ai"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

resource "google_cloud_run_service_iam_member" "all_users" {
  service  = google_cloud_run_service.nodejs_app.name
  location = google_cloud_run_service.nodejs_app.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

output "service_url" {
  value = google_cloud_run_service.nodejs_app.status[0].url
}