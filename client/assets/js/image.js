function getImageUrl(image) {
  if (!image) {
    return "/assets/images/no-image.png";
  }

  // Cloudinary image
  if (image.startsWith("http")) {
    return image;
  }

  // Old upload image
  return "/assets/images/no-image.png";
}
