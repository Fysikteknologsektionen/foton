#!/bin/bash

#Script will create thumbnails for images if they do not already exist. 
#Script must run as sudo... is this a problem?

pathtopics='/srv/helloworld/bilder'
categories=$(ls $pathtopics)

echo $categories
for category in $categories
do
    pathtocat="$pathtopics/$category"

    # Create directory thumbnails if it does not already exist. 
    if ls $pathtocat | grep thumbnails --quiet; then 
        echo exists
    else
        mkdir $pathtocat/thumbnails
    fi

    # Create a list of all pictures in the folder. 
    files=$(ls $pathtocat | grep -v thumbnails)

    for file in $files
    do
        filename="${file%%.*}"
        if ls $pathtocat/thumbnails | grep $filename --quiet; then
            echo exists
        else
            new_file = "$filename_thumbnail.${file##*.}"
            #UNTESTED AS DEVIL DOES NOT HAVE IMAGEMAGICK
            convert -resize '200x200' -gravity center -crop '200x200' $file $newfilename
        fi
    done
done
