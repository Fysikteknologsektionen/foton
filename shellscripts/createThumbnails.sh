#!/bin/bash

# Creates thumbnails for images if they do not already exist

# Set working directory to script directory
cd "$(dirname "$0")"
path="../files"
albums=$(ls $path)

echo "Detected albums:"
echo $albums
for album in $albums
do
    pathToAlbum="${path}/${album}"

    # Create thumbnails directory if it does not already exist 
    if [ -d "${pathToAlbum}/thumbnails" ]
    then
    	continue
    else
        echo "Creating thumbnails for: ${album}"
        mkdir ${pathToAlbum}/thumbnails
    fi

    IFS=$'\n'
    # Create a list of all pictures in the folder
    files=$(ls ${pathToAlbum} | grep -vE "thumbnails|meta.json")
    for file in $files
    do
        # Replace non-url-friendly characters with friendly equivalents 
        mv "$pathToAlbum"/"$file" $(echo "$pathToAlbum"/"$file" | sed 'y/ÅÄÖåäö /AAOaao-/')
    done

    # Use mogrify to bulk convert images
    mogrify -path "${pathToAlbum}/thumbnails" -filter Triangle -define filter:support=2 -thumbnail 420 -unsharp 0.25x0.25+8+0.065 -dither None -posterize 136 -quality 82 -define jpeg:fancy-upsampling=off -define png:compression-filter=5 -define png:compression-level=9 -define png:compression-strategy=1 -define png:exclude-chunk=all -interlace none -colorspace sRGB -strip "${pathToAlbum}/*"
done
echo "Finished creating thumbnails. Exiting..."

