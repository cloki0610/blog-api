# Headless simple Blog API

This is a lightweight solution provide a simple blog API with JWT authorization.
The application is using mongo container as local database, please check for the compose file for more information.

## Install

1. Install Docker
2. Move all the files into specific folder
3. Add backend.env with NODE_ENV, PORT(8080 or other port number) and JWTSECRET in the ENV file
4. Add mongo.env with MONGO*INITDB_ROOT_USERNAME, MONGO_INITDB_ROOT_PASSWORD in the ENV file \
   for more infomation please check [Offical mongo container](https://hub.docker.com/*/mongo)
5. Use `docker compose up` to activate the containers

## Review and help

Please feel free to let me know your thoughts to improve this project.
You can simply send the pull request for any imrpovement.
