
# Einkaufsliste

## Requirements
Make sure to have [Docker](https://www.docker.com/) installed.
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

Make sure you navigated into the project folder which has ```docker-compose.yml```, ```dockerfile``` and ```manage.py``` in it.

Build the application docker image:
```bash
$ docker build .
[+] Building 9.1s (10/10) FINISHED
 => [internal] load build definition from Dockerfile
...
=> => writing image sha256:89ede1...
```
Run the container:
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
=======
# Shopping List Web Application <!-- omit in toc -->

![app img](.)

## Table of Contents <!-- omit in toc -->
- [Introduction](#introduction)
- [Getting Started](#getting-started)
  - [Requirements](#requirements)
  - [Installation](#installation)
- [Authors](#authors)
- [License](#license)


## Introduction
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Vue](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)

## Getting Started
### Requirements
### Installation

## Authors

## License

