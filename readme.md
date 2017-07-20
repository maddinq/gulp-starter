# FRONTEND DEVELOPMENT

### Preparation (npm & bower )
*make sure that **npm** and **bower** are already installed on your system*
    1) install **Node.js** -> https://nodejs.org/en/ (LTS Version)
    2) install **Bower**

    npm install bower

### Install scss lint
    sudo gem install scss_lint

## Frontend setup
*run this code initial or after changes in bower.json (bower) or package.json (npm) or when gulp brings error*
run the **install.sh** script for automated install

    ./install-packages.sh

or run **bower** and **npm** install

    npm install
    bower install

## Frontend Builder
run **gulp**

    gulp

## prepare compressed files for deployment
run **gulp build**

    gulp build
