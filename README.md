
# DRUG-INDICATION-API



## Step-by-Step Setup for Running the Project

Follow these steps to set up and run the project locally:

**1. Clone the repository:** Clone the repository to your local environment:
```
 git clone git@github.com:thiagoncaetano/drug-indications-api.git
```

**2. Install Docker:** Ensure that Docker is installed on your system. If not, download and install Docker Desktop.

**3. Configure environment variables:** Create a ```.env``` file in the root folder and paste the following:
```
NODE_ENV=production
PORT=3001
GLOBAL_PREFIX='api'
JTW_SECRET=o0kB9ZmOFi
POSTGRES_HOST=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=mapmed
POSTGRES_PORT=5432
DRUG_INDICATIONS_URL='https://dailymed.nlm.nih.gov/dailymed/search.cfm'
AI_API_URL="https://api.together.xyz/v1/chat/completions"
AI_API_KEY=tgp_v1__8N2mWG-RTK5Rz51_id_i9jcur2f1cK6TNs43ruCf5k
AI_API_MODEL="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free"
```

**4. Start the Docker containers:** : Navigate to the root directory of the project and run the following command to build and start the necessary containers:
```
 docker-compose up
```

**5. Import the Postman Collection:**: The Postman collection was sent via email. Import it into Postman to test the API.

**6. Execute the API requests:**: Once the Postman collection is imported, follow the instructions within the collection to execute the API requests and interact with the application.


## Documentação da API

This API provides endpoints for managing users, authentication, and drug indications with ICD-10 code mapping.

### Routes

#### 1. Create User (Authentication: Not Required)
```
  POST /api/users
```

#### 2. Login (Authentication: Not Required)
```
  POST /api/auth/login
```

#### 3. Scrape and Map Indications (Authentication: Required (Bearer Token))
```
  GET /api/scraping?drug=dupixent

  Query Parameters
  drug: The drug name to scrape information for.
```

#### 4. Create Indication (Authentication: Required (Bearer Token))
```
  POST /api/indications
```


#### 5. Get Indications (Authentication: Required (Bearer Token))
```
  GET /api/indications?indicationId={indicationId}&drugId={drugId}&code={code}

  Query Parameters:
  indicationId (optional): The ID of the indication.
  drugId (optional): The ID of the drug.
  code (optional): The ICD-10 code associated with the indication.
```

#### 6. Get Indication (Authentication: Required (Bearer Token))
```
  GET /api/indications/{indicationId}
```

#### 7. Update Indication (Authentication: Required (Bearer Token))
```
  PUT /api/indications/{indicationId}
```

#### 8. Delete Indication (Authentication: Required (Bearer Token))
```
  DELETE /api/indications/{indicationId}
```

#### 9. Logout (Authentication: Required (Bearer Token))
```
  POST /api/auth/logout
```

#### 10. Logout (Authentication: Required (Bearer Token))
```
  POST /api/health
```

## Potential Improvements & Production Challenges

#### Potential Improvements

❗️Better ICD-10 AI: Use a more accurate model with confidence scoring.

❗️Async processing: Run scraping and mapping in background jobs.

❗️Filters & pagination: Add filters and pagination to improve scalability.

#### Production Challenges

❗️Website structure changes: DailyMed's layout may change and break scraping.

❗️ICD-10 accuracy: One indication may match multiple valid codes.

❗️Rate limiting: External APIs like OpenAI may enforce usage limits.

## How would you lead an engineering team to implement and maintain this project?

I would guide the team with a focus on collaboration, code quality, and knowledge sharing. We'd use clear guidelines, automated tests, and regular syncs to ensure stability and progress. Prioritizing maintainability and documentation would be key to long-term success.







