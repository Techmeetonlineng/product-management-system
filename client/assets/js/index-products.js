// ======================================
// Create Product Card
// ======================================

function createProductCard(product) {
  const col = document.createElement("div");
  col.className = "col-md-6 col-lg-4 col-xl-3";

  // ======================================
  // Determine Image URL
  // ======================================

  let imageUrl = "/assets/images/no-image.png";

  if (product.image) {
    // Cloudinary image
    if (product.image.startsWith("http")) {
      imageUrl = product.image;
    }
    // Old local upload
    else {
      imageUrl = `/uploads/${product.image}`;
    }
  }

  // ======================================
  // Format Price
  // ======================================

  const price = Number(product.price || 0).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  });

  const description = product.description || "";

  // ======================================
  // Build Card
  // ======================================

  col.innerHTML = `
    <div class="card h-100 product-card">

      <div class="product-image-wrapper">
        <img
    src="${imageUrl}"
    class="card-img-top"
    alt="${product.product_name}"
    onerror="this.onerror=null;this.src='/assets/images/no-image.png';"
/>

        <div class="product-overlay">
          <button
            class="btn btn-sm btn-primary"
            onclick="viewProduct(${product.product_id})"
          >
            <i class="fas fa-eye"></i> View
          </button>
        </div>
      </div>

      <div class="card-body d-flex flex-column">

        <h6 class="card-title">
          ${product.product_name}
        </h6>

        <p class="card-text text-muted small">
          ${
            description.length > 60
              ? description.substring(0, 60) + "..."
              : description
          }
        </p>

        <p class="card-text text-success fw-bold mt-auto mb-2">
          ${price}
        </p>

        <small class="text-muted">
          <i class="fas fa-tag"></i>
          ${product.category_name || "Uncategorized"}
        </small>

        <small class="text-muted d-block">
          <i class="fas fa-user"></i>
          ${product.first_name} ${product.last_name}
        </small>

        <div class="mt-2 d-grid">
          <button
            class="btn btn-outline-primary btn-sm"
            onclick="addToCart(${product.product_id})"
          >
            <i class="fas fa-cart-plus"></i>
            Add to Cart
          </button>
        </div>

      </div>

    </div>
  `;

  return col;
}
