/**
 * Resolve a product image.
 * Supports:
 *  - Cloudinary URLs
 *  - Old local uploads
 *  - Missing images
 */
function getProductImageUrl(product) {
  if (!product || !product.image) {
    return "/assets/images/no-image.png";
  }

  // Cloudinary
  if (
    product.image.startsWith("http://") ||
    product.image.startsWith("https://")
  ) {
    return product.image;
  }

  // Old local uploads
  return `/uploads/${product.image}`;
}
