# Einkaufsliste

## Requirements
Use Anaconda or venv to create a virtual environment for the porject

### Environment
1. Create an environment with conda using the following command:
```bash
$ conda create --name myenv
```
2. Activate environment
```bash
$ conda activate myenv
```
3. Terminal shows indication of active env
```bash
$ (myenv) C:\...
```
### PIP Package Manager
The easiest way to install packages is using a package manager like PIP. To install run the following command with the virtual environment active:
```bash
$ conda install pip
```
### Django

Inside the virutal environment install Django
```bash
$ pip install Django
```

You are now ready to start the Django server

### Django File Structure Explanation
- \_\_init\_\_.py is an empty file that instructs Python to treat this directory as a Python package.
- settings.py contains all the website settings, including registering any applications we create, the location of our static files, database configuration details, etc.
- urls.py defines the site URL-to-view mappings. While this could contain all the URL mapping code, it is more common to delegate some of the mappings to particular applications, as you'll see later.
- wsgi.py is used to help your Django application communicate with the webserver. You can treat this as boilerplate.
- asgi.py is a standard for Python asynchronous web apps and servers to communicate with each other. ASGI is the asynchronous successor to WSGI and provides a standard for both asynchronous and synchronous Python apps (whereas WSGI provided a standard for synchronous apps only). It is backward-compatible with WSGI and supports multiple servers and application frameworks.

### Important Commands
```bash
$ manage.py migrate
```
Synchronizes the database state with the current set of models and migrations. Migrations, their relationship with apps and more are covered in depth in the migrations [documentation](https://docs.djangoproject.com/en/4.1/topics/migrations/).

```bash
$ manage.py runserver
```
Will start the development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
