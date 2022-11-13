
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
    - [How to enter secrets](#how-to-enter-secrets)
    - [How to create a djnago superuser in the docker container](#how-to-create-a-djnago-superuser-in-the-docker-container)
    - [How to to register an app for Django OAuth Tooklkit](#how-to-to-register-an-app-for-django-oauth-tooklkit)
    - [How to handle django database errors](#how-to-handle-django-database-errors)
    - [Usefull docker commands](#usefull-docker-commands)
  - [Authors](#authors)
  - [License](#license)

## Requirements
Make sure to have [Docker](https://www.docker.com/) installed.
Check by running `docker --version` in your terminal. If the command is not found, install Docker by following the instructions [here](https://docs.docker.com/get-docker/).


## What this Compose does
1. Providing all backend functionalities uncluding:
   - [x] [Django Python](https://www.djangoproject.com/) backend
   - [x] [PostgreSQL](https://www.postgresql.org/) database
   - [x] [PGAdmin](https://www.pgadmin.org/) database management

2. Providing all frontend functionalities uncluding:
   - [x] [Node](https://nodejs.org/en/) frontend
   - [x] [Angular](https://reactjs.org/) framework
   - [x] [Nginx](https://www.nginx.com/) web server

The Django Application files are mounted into the container, so you can edit them on your local machine and see the changes in the container. Therefore there is no need to rebuild the container after every change. The development can fully be done in the container.+

For the angular 

## How to use
1. Clone this repository
2. Make sure to cd into the directory which contains the docker-compose.yml file
3. Run ```docker-compose up --build``` to build and start the containers

The output should look like this:
```bash
$ docker build .
[+] Building 9.1s (10/10) FINISHED
 => [internal] load build definition from Dockerfile
...

Starting einkaufsliste_frontend_1 ... 
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

### How to enter secrets
Both the backend and frontend require secrets to be set in order to run properly. The secrets are stored in separate json files which are not included in the repository. The files are:
- ```einkaufsliste_backend/secrets.json```
- ```einkaufsliste_frontend/secrets.json```
The repository contains example files which can be used as a template. The files are:
- ```einkaufsliste_backend/secrets_template.json```
- ```einkaufsliste_frontend/secrets_template.json```
All needed secrets are stated in the template files. The files can be copied and renamed to ```secrets.json```. The secrets can then be entered in the files.

### How to create a djnago superuser in the docker container
1. Run ```docker exec -it einkaufsliste_web_1 bash```
2. The command should output something like this: ```root@2f0c290afb99:/code#```. To check if you are in the correct container run ```ls```. The output should look like this: ```root@2f0c290afb99:/code# ls
app  core  db.sqlite3  dockerfile  manage.py  requirements.txt  secrets.json  secrets_template.json  users```. If the output looks like this you are in the correct container.
3. Run ```python manage.py createsuperuser``` to create a superuser. The command will ask you to enter a username, email and password. Enter the information and press enter.

### How to to register an app for Django OAuth Tooklkit
1. Visit the admin page at http://localhost:8000/admin
2. Under DJANGO OAUTH TOOLKIT select Applications and click on Add
3. Enter the following information:
   - Client type: Confidential
   - Authorization grant type: Resource owner password-based
   - Name: einkaufsliste_frontend
4. Make sure to copy the Client ID and Client Secret. You will need them later and can't access them again since they are hashed and salted after creation.
5. Click on Save. The app is now registered.
6. Make sure to enter the Client ID and Client Secret in the ```einkaufsliste_frontend/secrets.json``` file.

### How to handle django database errors
If you encounter multiple database errors, you can try to delete the database and start over. To do so, run the following commands:
```bash
docker-compose down
docker volume rm einkaufsliste_backend_db_data
docker-compose up --build
```
After that the database should be cleared. Migrations should now work properly. Make sure to create a superuser and register the app for Django OAuth Tooklkit again. You can find the instructions above. 

### Usefull docker commands
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
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
