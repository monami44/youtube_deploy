# HIPAA Compliant Document Processing Service

A secure document processing service built for Azure environments, with HIPAA compliance in mind. This application allows users to upload PDF documents, process them with Azure Document Intelligence, and generate summaries using AI.

## Architecture

- **Frontend**: Next.js web application
- **Backend**: Python-based service with FastAPI and a background worker
- **Database**: PostgreSQL on Azure Flexible Server
- **Storage**: Azure Blob Storage for document storage
- **AI Services**: Azure Document Intelligence for text extraction, OpenAI for summarization

## Features

- Secure PDF document upload
- Document text extraction using Azure Document Intelligence
- AI-powered document summarization
- Custom summary regeneration with user-defined prompts
- HIPAA-compliant document processing workflow

## Prerequisites

- Azure account with necessary services:
  - Azure Postgres Flexible Server
  - Azure Blob Storage
  - Azure Document Intelligence
- OpenAI API key
- Docker and Docker Compose

## Setup

### 1. Azure Resources

Create the following Azure resources:

- **Azure Postgres Flexible Server**
- **Azure Blob Storage Account**
  - Create a container called `documents`
- **Azure Document Intelligence Resource**

### 2. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_azure_postgres_host
DB_NAME=docprocessor

# Azure Storage
AZURE_STORAGE_CONNECTION_STRING=your_storage_connection_string
AZURE_STORAGE_CONTAINER_NAME=documents

# Azure Document Intelligence
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=your_document_intelligence_endpoint
AZURE_DOCUMENT_INTELLIGENCE_KEY=your_document_intelligence_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4-turbo

# App settings
POLL_INTERVAL_SECONDS=15
```

### 3. Database Setup

Run the database setup script:

```bash
./scripts/setup_database.sh <server_name> <admin_username> <admin_password>
```

### 4. Deploy with Docker Compose

Build and start the application:

```bash
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Azure Deployment

For production deployment to Azure:

1. Create an Azure Container Registry (ACR)
2. Build and push the Docker images to ACR
3. Deploy using Azure Container Apps or Azure Kubernetes Service (AKS)
4. Configure network security and access controls according to HIPAA requirements
5. Set up Azure Application Gateway for TLS termination and routing

## HIPAA Compliance Considerations

- Ensure all Azure resources are configured for HIPAA compliance
- Enable encryption at rest and in transit for all data
- Implement proper access controls and authentication
- Set up audit logging and monitoring
- Configure backup and disaster recovery
- Conduct regular security assessments

## License

[MIT](LICENSE) # youtube_deploy
