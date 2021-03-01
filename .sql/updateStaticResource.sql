UPDATE article SET thumbnail=REPLACE(thumbnail, "res.cloudinary.com", "static.owwners.com");
UPDATE article SET photos=REPLACE(photos, "res.cloudinary.com", "static.owwners.com");
UPDATE user SET thumbnail=REPLACE(thumbnail, "res.cloudinary.com", "static.owwners.com");
UPDATE user SET profileImage=REPLACE(profileImage, "res.cloudinary.com", "static.owwners.com");
