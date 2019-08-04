#!/bin/bash

#Script will create thumbnails for images if they do not already exist. 

path="../files"
albums=$(ls $path)

echo $albums
for album in $albums
do
    pathToAlbum="$path/$album"

    # Create directory thumbnails if it does not already exist. 
    if ls $pathToAlbum | grep thumbnails --quiet; then 
        echo exists
    else
        mkdir $pathtocat/thumbnails
    fi

    # Create a list of all pictures in the folder. 
    files=$(ls $pathToAlbum | grep -v thumbnails)

    for file in $files
    do
        fileName="${file%%.*}"
        if ls $pathToAlbum/thumbnails | grep $fileName --quiet; then
            echo exists
        else
            newFile = "$filename_thumbnail.${file##*.}"
            convert -resize '300x200' -gravity center -crop '300x200' $file $newFile
        fi
    done
done

