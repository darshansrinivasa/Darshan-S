class productitem extends HTMLElement {
  constructor() {
    super();

    this.init();
    this.initializeVariants();
    this.cart =
      document.querySelector("cart-notification") ||
      document.querySelector("cart-drawer");
  }

  init() {
    this.popup = this.querySelector(".product-grid__popup-container");

    // Button to open popup
    this.openModalBTN = this.querySelector(".product-grid__hotpost");
    this.openModalBTN.addEventListener("click", () => {
      this.popup.showModal();
      document.body.classList.add("overflow-hidden");
    });

    // Button to close popup
    this.closeModalBTN = this.querySelector(".popup-close-btn");
    this.closeModalBTN.addEventListener("click", () => {
      if (this.summary) this.closeAccordion();
      this.popup.close();
      document.body.classList.remove("overflow-hidden");
    });

    // Variant options selectors
    this.variantSwatches = this.querySelectorAll(".product-grid__color-option");
    this.variantSelects = this.querySelectorAll(
      ".product-grid__select-option-value"
    );
    this.summary = this.querySelector(".product-grid__accordion-summary");
    this.summaryText = this.summary?.querySelector("span");

    // Add to cart button
    this.addToCartBTN = this.querySelector(".product-grid__ATC");
    this.addToCartBTN.addEventListener(
      "click",
      this.handleAddToCart.bind(this)
    );
  }

  initializeVariants() {
    // Parse product variants from the script tag
    const variantsScript = this.querySelector("script[data-variants]");
    this.productVariants = JSON.parse(variantsScript.textContent);

    // Parse selected or first available variant from the script tag
    const selectedVariantScript = this.querySelector(
      "script[data-selected-variant]"
    );
    this.selectedVariant = JSON.parse(selectedVariantScript.textContent);

    // Event listeners for variant swatches and selects
    this.variantSwatches.forEach((variant) => {
      if (variant.classList.contains("selected")) this.selectedSwatch = variant;
      variant.addEventListener("click", this.handleVariantSwatch.bind(this));
    });

    this.variantSelects.forEach((variant) => {
      if (variant.classList.contains("selected")) this.selectedSelect = variant;
      variant.addEventListener("click", this.handleVariantSelect.bind(this));
    });

    // Activate accordion and handle click on summary
    this.variantSelectsContainer = this.querySelector(
      ".product-grid__select-options"
    );
    if (this.summary) {
      this.summary.addEventListener("click", () => {
        this.summaryText.innerHTML = "Choose your size";
        this.summary.style.justifyContent = "flex-start";
        this.variantSelectsContainer.classList.toggle("hidden");
      });
    }
  }

  handleVariantSwatch(event) {
    event.preventDefault();
    const selectedSwatch = event.target.closest(".product-grid__color-option");
    if (this.selectedSwatch) {
      this.selectedSwatch.classList.remove("selected");
    }
    selectedSwatch.classList.add("selected");
    this.selectedSwatch = selectedSwatch;

    // Update variant ID based on selected options
    this.updateVariantId();
  }

  handleVariantSelect(event) {
    const selectedSelect = event.target.closest(
      ".product-grid__select-option-value"
    );
    if (this.selectedSelect) {
      this.selectedSelect.classList.remove("selected");
    }
    selectedSelect.classList.add("selected");
    this.selectedSelect = selectedSelect;

    // Update summary text and hide select options
    this.summaryText.innerHTML = this.selectedSelect.innerHTML;
    this.summary.style.justifyContent = "center";
    this.variantSelectsContainer.classList.add("hidden");

    // Update variant ID based on selected options
    this.updateVariantId();
  }

  updateVariantId() {
    // Update variant ID based on selected color and size
    const selectedColor = this.selectedSwatch.dataset.optionValue;
    const selectedSize = this.selectedSelect.dataset.optionValue;
    const combinedOption = `${selectedSize}/${selectedColor}`;

    const matchingVariant = this.productVariants.find((variant) => {
      const combinedVariantOption = `${variant.option1}/${variant.option2}`;
      return combinedVariantOption === combinedOption;
    });
    if (matchingVariant) {
      this.variantID = matchingVariant.id;
    }
  }

  closeAccordion() {
    // Reset summary text and hide size options
    this.summaryText.innerHTML = "Choose your size";
    this.summary.style.justifyContent = "flex-start";
    this.variantSelectsContainer.classList.add("hidden");
  }

  // add to cart functionality
  handleAddToCart() {
    // Show loading spinner
    this.loadingContainer = this.querySelector(".loader-atc");
    this.loader = this.querySelector(".loading__spinner");
    this.loadingContainer.classList.add("overlay");
    this.loader.classList.remove("hidden");

    // If no variant is selected, default to the selected or first available variant
    if (!this.variantID) {
      if (this.selectedVariant && this.selectedVariant.id) {
        this.variantID = this.selectedVariant.id;
      } else {
        const firstAvailableVariant = this.productVariants.find(
          (variant) => variant.available
        );
        if (firstAvailableVariant) {
          this.variantID = firstAvailableVariant.id;
        } else {
          console.error("No available variants.");
          return;
        }
      }
    }

    // Prepare data for adding to cart
    const variantID = this.variantID;
    const quantity = 1;

    const formData = {
      items: [
        {
          id: variantID,
          quantity: quantity,
        },
      ],
    };

    fetch(window.Shopify.routes.root + "cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("response", response);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        // Hide loading spinner and show success message and close popup
        this.loadingContainer.classList.remove("overlay");
        this.loader.classList.add("hidden");
        console.log("product addded to cart");
        this.viewSuccessMsg();
      });
  }

  viewSuccessMsg() {
    this.successMsgContainer = this.querySelector(".success-message-container");
    this.successMsgContainer.classList.remove("hidden");
    // Hide success message and close popup after 3 seconds
    setTimeout(() => {
      this.successMsgContainer.classList.add("hidden");
      this.popup.close();
      document.body.classList.remove("overflow-hidden");
    }, 3000);
  }
}

customElements.define("product-item", productitem);
