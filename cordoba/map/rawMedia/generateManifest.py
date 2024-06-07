import os
import json
from PIL import Image
from pillow_heif import register_heif_opener
import piexif
from datetime import datetime
register_heif_opener()

import math

# set the maximum distance between posts to combine
MAX_DISTANCE = 20 # meters

rawsFolderPath = "rawMedia/"
folder_path = rawsFolderPath + "assets/"
file_list = []

# loop over all files in the folder
for filename in os.listdir(folder_path):
    if filename.endswith(".HEIC") or filename.endswith(".JPG"):
        file_path = os.path.join(folder_path, filename)

        # convert HEIC file to JPEG and save it with a modified name
        if filename.endswith(".HEIC"):
            new_filename = os.path.splitext(filename)[0] + ".jpg"
            new_file_path = os.path.join(folder_path, new_filename)
            with Image.open(file_path) as img:
                img.save(new_file_path)

        # read metadata from the image file
        with Image.open(file_path) as img:
            exif_dict = piexif.load(img.info["exif"])
            gps_dict = exif_dict["GPS"]
            lat = gps_dict[piexif.GPSIFD.GPSLatitude]
            lon = gps_dict[piexif.GPSIFD.GPSLongitude]
            lat_ref = gps_dict[piexif.GPSIFD.GPSLatitudeRef]
            lon_ref = gps_dict[piexif.GPSIFD.GPSLongitudeRef]
            lat_val = (lat[0][0]/lat[0][1]) + (lat[1][0]/lat[1][1])/60 + (lat[2][0]/lat[2][1])/3600
            lon_val = (lon[0][0]/lon[0][1]) + (lon[1][0]/lon[1][1])/60 + (lon[2][0]/lon[2][1])/3600
            if lat_ref == b'S':
                lat_val = -lat_val
            if lon_ref == b'W':
                lon_val = -lon_val
            timestamp_str = exif_dict["Exif"][piexif.ExifIFD.DateTimeOriginal].decode("utf-8")
            timestamp = datetime.strptime(timestamp_str, "%Y:%m:%d %H:%M:%S")

        # add the file to the manifest list
        file_dict = {
            "files": [new_file_path if filename.endswith(".HEIC") else file_path],
            "title": "Raw Media",
            "tags": ["image"],
            "lat": lat_val,
            "long": lon_val,
            "timestamp": timestamp.isoformat()
        }
        file_list.append(file_dict)

# combine posts that are close together
for i in range(len(file_list)):
    # get the GPS coordinates of the current post
    lat1 = file_list[i]["lat"]
    lon1 = file_list[i]["long"]

    # check if this post has already been combined with another post
    if "combined" in file_list[i]:
        continue

    # create a new combined post
    combined_post = {
        "files": [],
        "title": "Media Post",
        "tags": [],
        "lat": lat1,
        "long": lon1,
        "timestamp":file_list[i]["timestamp"]
    }

    # add the current post to the combined post
    combined_post["files"] += file_list[i]["files"]
    for tag in file_list[i]["tags"]:
        if tag not in combined_post["tags"]:
            combined_post["tags"].append(tag)

    file_list[i]["combined"] = True

    # loop through the remaining posts and check if they should be combined
    for j in range(i+1, len(file_list)):
        # get the GPS coordinates of the other post
        lat2 = file_list[j]["lat"]
        lon2 = file_list[j]["long"]

        # check if this post has already been combined with another post
        if "combined" in file_list[j]:
            continue

        # calculate the distance between the two posts
        distance = math.sqrt((lat1-lat2)**2 + (lon1-lon2)**2) * 111319.9 # convert degrees to meters

        # check if the posts are close enough to be combined
        if distance <= MAX_DISTANCE:
            # add the other post to the combined post
            combined_post["files"] += file_list[j]["files"]
            # combined_post["tags"] += file_list[j]["tags"]
            for tag in file_list[j]["tags"]:
                if tag not in combined_post["tags"]:
                    combined_post["tags"].append(tag)

            file_list[j]["combined"] = True

            # update the GPS coordinates of the combined post (average of the two posts)
            combined_post["lat"] = (combined_post["lat"] + lat2) / 2
            combined_post["long"] = (combined_post["long"] + lon2) / 2

    # add the combined post to the file list
    file_list.append(combined_post)

# remove the individual posts that have been combined
file_list = [post for post in file_list if "combined" not in post]

# write the manifest list to a JSON file
json_string = json.dumps(file_list, indent=4)

#combine entries based on proximity

#save the result
with open(os.path.join(rawsFolderPath, "geotagged_files.json"), "w") as f:
    f.write(json_string)
