import glob
import os
import uuid
from PIL import Image

my_path = "batch/"
main_dir = "filteredImages/"
files = glob.glob(my_path + '/**/*.jpg', recursive=True)

for file in files:
    im = Image.open(file)
    if (im.width<512 or im.height<512):
        print("Image too small: " + file)
        continue
    # Generate guid
    im.close()
    guid = str(uuid.uuid4())
    filename=guid + ".jpg"
    os.rename(
        file,
        main_dir + filename
    )
