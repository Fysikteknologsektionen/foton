## Installing & running dev environment
```bash
$> git clone https://github.com/ECarlsson/foton
$> cd foton
$> npm install
$> npm run dev
```

Gallery visable att localhost:3000/gallery

## API
A list of all albums and album details can be fetched as JSON via the API. The available parameters are:

| Method | File           | Description                                   |
|--------|----------------|-----------------------------------------------|
| GET    | /albums/       | Lists all albums and meta data for each album |
| GET    | /albums/:album | Lists complete meta data and images of album  |