
# Einkaufsliste

## Introduction
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)



## Table of Contents <!-- omit in toc -->
- [Einkaufsliste](#einkaufsliste)
  - [Introduction](#introduction)
  - [Requirements](#requirements)
  - [What this Compose does](#what-this-compose-does)
  - [How to use](#how-to-use)
    - [1. Get the code](#1-get-the-code)
    - [2. Use the vars](#2-use-the-vars)
    - [3. Setting the DJANGO\_APP\_CLIENT\_ID and DJANGO\_APP\_CLIENT\_SECRET](#3-setting-the-django_app_client_id-and-django_app_client_secret)
  - [How to start over, delete all data and start from scratch](#how-to-start-over-delete-all-data-and-start-from-scratch)
    - [Usefull docker commands](#usefull-docker-commands)
  - [Authors](#authors)
  - [License](#license)

## Requirements
Make sure to have [Docker](https://www.docker.com/) installed.
Check by running `docker --version` in your terminal. If the command is not found, install Docker by following the instructions stated [here](https://docs.docker.com/get-docker/).

## What this Compose does
1. Providing all backend functionalities uncluding:
   - [x] [Django Python](https://www.djangoproject.com/) backend
   - [x] [PostgreSQL](https://www.postgresql.org/) database
   - [x] [PGAdmin](https://www.pgadmin.org/) database management

2. Providing all frontend functionalities uncluding:
   - [x] [Node](https://nodejs.org/en/) frontend
   - [x] [Angular](https://reactjs.org/) framework
   - [x] [Nginx](https://www.nginx.com/) web server

The Django Application files are mounted into the container, so they can easily be edited during development and be seen in realtime. Therefore there is no need to rebuild the container after every change. The development can fully be done in the container.+

For the angular application this needs to be done manually. The angular application is built and copied into the nginx container. Therefore you need to rebuild the container after every change. The development should therefore be done on your local machine and the container is only used for testing.

## How to use
### 1. Get the code
1. Clone this repository
2. Make sure to cd into the directory which contains the docker-compose.yml file
3. Switch to the develop branch by running ```git checkout develop```
4. Run ```docker-compose up --build``` to build and start the containers

The output should look similar to this:
```bash
$ docker build .
[+] Building 9.1s (10/10) FINISHED
 => [internal] load build definition from Dockerfile
...

Starting einkaufsliste_frontend_1 ... done
Starting einkaufsliste_db_1       ... done
Starting einkaufsliste_web_1      ... done
```
The components are now running on the following ports:
| Page | URL |
| --- | --- |
| Backend | http://localhost:8000 |
| pgAdmin4 | http://localhost:5050 |
| Frontend | http://localhost:4200 |

### 2. Use the vars

Both the backend and frontend require variables to be set. These aren't set in the repository since they contain sensitive information. Both, the backend and frontend use the same ```.env``` file. The file must be located in teh root directory of the project. For the development branch the file must be named ```dev_vars.env```. For the production branch the file must be named ```prod_vars.env```. The file must contain the following key value pairs:
```bash
ALLOWED_HOST
BACKEND_URL
CORS_ALLOWED_ORIGINS
DB_HOST
DB_PORT
DJANGO_APP_CLIENT_ID
DJANGO_APP_CLIENT_SECRET
DJANGO_SECRET_KEY=
DJANGO_SECRET_KEY
FRONTEND_URL
GOOGLE_API_KEY_CLIENT_ID
GOOGLE_PLACES_API_KEY
POSTGRES_DB
POSTGRES_PASSWORD
POSTGRES_USER
DJANGO_SECRET_KEY
SENTRY_DSN
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET
```
An example file named ```xy_vars.env.example``` is provided in the repository. The file must be renamed to ```dev_vars.env``` and the values must be set.

### 3. Setting the DJANGO_APP_CLIENT_ID and DJANGO_APP_CLIENT_SECRET
The OAUTH Toolkit requires a client id and a client secret. Using a fresh database requires to create a new application. To do so, we provide a script which creates a new application in the context of a generated user within the docker container. To run the script, run the following command:
```bash
docker exec -it einkaufsliste_web bash -c "python manage.py createauthconfig"
```
The script will output the client id and the client secret. These values must be set in the ```.env``` file.

**Congratulations! You are now ready to use the application! :checkered_flag:**

## How to start over, delete all data and start from scratch
To delete all data and start from scratch, run the following commands:
```bash
docker-compose -f docker-compose-dev.yml down -v
docker-compose -f docker-compose-dev.yml up --build
```

### Usefull docker commands
| Command | Description |
| --- | --- |
| ```docker-compose up --build``` | Builds and starts the containers |
| ```docker-compose images``` | Lists all images |
| ```docker-compose ps``` | Lists all running containers |
| ```docker-compose down``` | Stops and removes the containers |
| ```docker-compose down -v``` | Stops and removes the containers and volumes |
| ```docker-compose down -v --rmi all``` | Stops and removes the containers, volumes and images |
| ```docker-compose up -d``` | Builds and starts the containers in the background |

## Authors

## License

spoonacular API

google maps API

Open Food Facts API