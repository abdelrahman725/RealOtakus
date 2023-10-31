Make sure you have used [RealOtakus](https://realotakus.com) and interacted with its features before reading this guide

# TechStack

## Backend
- **Django** and **Django Rest Framework**
- **JWT Authentication** by [Djoser](https://djoser.readthedocs.io/en/latest/settings.html)
- **JWT tokens** are stored in httpOnly cookies.
- **Database** uses **postgres** in production and **SQLITE** in development 
- **Caching** uses **Redis** in production and [LoMemCache](https://docs.djangoproject.com/en/4.2/topics/cache/#local-memory-caching) in development 


## Frontend
 - **[Next.js](https://nextjs.org/)** which interacs with **[DRF](https://www.django-rest-framework.org/)** API

 - **[Sass](https://sass-lang.com/)** for styling


# Getting Started

1. Fork this repository.
2. Clone your fork to your local machine.
3. Create a new branch for your changes.

**Note** you have to setup both frontend and backend if you are going to work on only one of them or both.
## BackEnd Setup
4. Navigate to `backend` directory.
5. Create and activate your python virutal environment in your `backend` directory

    ```
    python3 -m venv venv && source env/bin/activate
    ```

6. Install the required dependencies:
   ```
    pip install -r requirements.txt
    ```

7. create a file called `.env.local` in your `backend` directory and add the following :
    
    ```
    DEBUG="True"
    SECRET_KEY="django-insecure-z%33@q!hg%d0cr=*t&36heh3urg2ilru&zb47uq@!i4f#5%exa"
    DOMAIN="127.0.0.1:3000"
    ALLOWED_HOSTS="127.0.0.1,localhost"
    CORS_ALLOWED_ORIGINS="http://127.0.0.1:3000"
    ADMIN_PATH="admin/"
    ```
    
8.  Migrate your database:

    ```
    python manage.py makemigrations && python manage.py migrate
    ```
9.  Start the Django development server

    ```
    python manage.py runserver
    ```
The Backend setup should be done by now !

## FrontEnd Setup
10.  Install Node.js and npm if you haven't already [Node.js Download](https://nodejs.org/en/download).

11.  Navigate to the `frontend` directory.


12. Install JavaScript dependencies using npm
    ```
    npm install
    ```

13. create a file called `.env.local` in your `frontend` directory and add the following :
    
    ```
    # django host
    NEXT_PUBLIC_HOST=http://127.0.0.1:8000 

    # Next.js
    NEXT_PUBLIC_REDIRECT_URL=http://127.0.0.1:3000
    ```

14. Install [Live Sass Compiler](vscode:extension/glenn2223.live-sass) for auto compiled css code, or alternatively you can install Sass in your machine to compile and watch [App.scss](frontend/styles/App.scss) file [see how](https://sass-lang.com/guide/#preprocessing).

15. Start the Next.js development server
    ```
    npm run dev
    ```

16. Access the Next.js app at http://127.0.0.1:3000 in your web browser.

**All Setup and Now It's time for coding 😉**

# Bug Reports and Feature Requests
If you encounter a bug or have a feature request, please open an issue in the GitHub issue tracker with a clear description. Include steps to reproduce the issue for bug reports.


# Making changes

Once you have set up the development environment, you can start making changes to the project. Here are some guidelines to follow:

* Before making any changes, please create a new branch for your work. This will make it easier to revert your changes if necessary.
* Write clear and concise commit messages. Your commit messages should be descriptive and explain what changes you have made.
* Follow the project's coding style guide.
* Test your changes thoroughly before merging them into the main branch.

### Submitting your changes

Once you are happy with your changes, you can submit them for review by creating a pull request. Here are some guidelines to follow:

* Make sure your pull request includes a clear and concise description of the changes you have made.
* Address any feedback from reviewers promptly.
* Once your pull request has been approved, it will be merged into the main branch.


# Community
Join our [Developers channel](https://discord.gg/S7yZVcR8) on discord to stay up to date on the latest developments, ask questions, and engage with other contributors, we encourage respectful and inclusive communication within our community.
