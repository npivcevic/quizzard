# Quizzard

Do you have what it takes? Are you a true quizzard?

## Installation

### 1. Install dot.net core

https://dotnet.microsoft.com/en-us/download

### 2. cone this repository
```
git clone git@github.com:npivcevic/quizzard.git
```

### 3. run the app
```
cd quizzard
dotnet run
```

### 4. open the app in your browser

https://127.0.0.1:7181/

## Additional Info

### Recommended tools

1. Install dotnet Entity framework cli to manage db migrations

```
dotnet tool install --global dotnet-ef
```
might need to edit PATH to enable running this tool

Usefull ef commands:

```
dotnet ef migrations list //list all migrations
dotnet ef migrations add {migrationName} // create new migration for new/updated models
dotnet ef migrations remove // delete last created migration
dotnet ef database drop // delete the database
dotnet ef database update //run all migrations

```


2. Install https://sqlitebrowser.org/ to view the database

## About

App built using the dotnet cli command

```
dotnet new angular -au Individual 
```
