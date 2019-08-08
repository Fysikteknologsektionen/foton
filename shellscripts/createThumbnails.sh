#!/bin/bash

# Creates thumbnails for images if they do not already exist

path="../files"
albums=$(ls $path)

echo $albums
for album in $albums
do
    pathToAlbum="${path}/${album}"

    # Create thumbnails directory if it does not already exist 
    if [ ! -d "${pathToAlbum}/thumbnails" ]; then 
    	mkdir ${pathToAlbum}/thumbnails
    fi

    # Create a list of all pictures in the folder
    files=$(ls $pathToAlbum | grep -vE "thumbnails|meta.json")

    for file in $files
    do
	fileName="${file%.*}"
	fileExtension="${file##*.}"
	newFile="${fileName}_thumbnail.${fileExtension}"
        if ! ls ${pathToAlbum}/thumbnails | grep -q $newFile; then
            convertedFile="${pathToAlbum}/thumbnails/${newFile}"
            xDim=identify -format "%w" "${pathToAlbum}/${file}"
            yDim=identify -format "%h" "${pathToAlbum}/${file}"
            if [$xDim/$yDim -eq "1.5"]; then
                # Horizontal image
                convert -resize '420x280' -gravity center -crop '420x280' "${pathToAlbum}/${file}" $convertedFile
            else
                # Assume vertical image
                convert -resize '280x420' -gravity center -crop '280x420' "${pathToAlbum}/${file}" $convertedFile
            fi
	    echo $file
        fi
    done
done

