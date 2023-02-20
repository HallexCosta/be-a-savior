## Be a Savior - Server API

This is the repository of project Be a Savior Server API.  
Click [here](https://www.figma.com/file/gCI9SPrN1WMvo2WkqN0DFY/Be-a-Savior?t=3TkE4U8GDea94UD6-0) to access Figma.  
Click [here](https://github.com/hallancosta/be-a-savior) to access front-end mobile repository  
Click [here](https://be-a-savior.netlify.app) to access landing page presentation.

How to use?

```sh
# Create .env file 
$ cp .env.example .env

# Install dependencies
$ yarn

# Build project
$ yarn build

# Start api
$ yarn start
```

## API Domains

| Domains   | GET | POST | PATCH | DELETE |
|-----------|-----|------|-------|--------|
| incidents | ✅  | ✅   | ✅    | ✅     |
| donations | ✅  | ✅   | ❌    | ❌     |
| ongs      | ✅  | ✅   | ❌    | ❌     |
| donors    | ✅  | ✅   | ❌    | ❌     |
