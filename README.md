# Einkaufsliste

## Requirements
Make sure to have [Docker](https://www.docker.com/) installed
Check by running
```bash
docker --version
```
## What this Container does
- Running the python Backend of the project
- Running an instance of the latest PostgreSQL Image
After locally cloning the repository
- Running pgAdmin4 to manage databases

## How to use

Build the application docker image
```bash
$ docker build .
[+] Building 9.1s (10/10) FINISHED
 => [internal] load build definition from Dockerfile
...
=> => writing image sha256:89ede1...
```
Run the container
```bash
$ docker-compose up
Starting einkaufsliste_backend_db_1 ... done
Starting pgadmin4                    ... done
Starting einkaufsliste_backend_web_1 ... done
Attaching to einkaufsliste_backend_db_1, pgadmin4, einkaufsliste_backend_web_1
```
| Page | URL |
| --- | --- |
| Backend | http://localhost:8000 |
| pgAdmin4 | http://localhost:5050 |