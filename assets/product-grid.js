class productitem extends HTMLElement {
  constructor() {
    super();

    this.init();
    this.initilazeVariants();
  }

  init() {
    this.popup = this.querySelector(".product-grid__popup-container");

    // button to open popup
    this.openModalBTN = this.querySelector(".product-grid__hotpost");
    this.openModalBTN.addEventListener("click", () => {
      this.popup.showModal();
      document.body.classList.add("overflow-hidden");
    });

    // button to close popup
    this.closeModalBTN = this.querySelector(".popup-close-btn");
    this.closeModalBTN.addEventListener("click", () => {
      if (this.summary) this.closeAccordion();
      this.popup.close();
      document.body.classList.remove("overflow-hidden");
    });

    this.variantSwatches = this.querySelectorAll(".product-grid__color-option");
    this.variantSelects = this.querySelectorAll(
      ".product-grid__select-option-value"
    );
    this.summary = this.querySelector(".product-grid__accordion-summary");
    this.summaryText = this.summary?.querySelector("span");

    // add to cart button
    this.addToCartBTN = this.querySelector(".product-grid__ATC");
    this.addToCartBTN.addEventListener(
      "click",
      this.handleAddToCart.bind(this)
    );
  }

  initilazeVariants() {
    this.variantSwatches.forEach((variant) => {
      if (variant.classList.contains("selected")) this.selectedSwatch = variant;
      variant.addEventListener("click", this.handleVariantSwatch.bind(this));
    });

    this.variantSelects.forEach((variant) => {
      if (variant.classList.contains("selected")) this.selectedSelect = variant;
      variant.addEventListener("click", this.handleVariantSelect.bind(this));
    });

    // activate accordion
    this.variantSelectsContainer = this.querySelector(
      ".product-grid__select-options"
    );
    if (this.summary) {
      this.summary.addEventListener("click", () => {
        this.closeAccordion();
      });
    }
  }

  handleVariantSwatch() {
    event.preventDefault();
    const selectedSwatch = event.target.closest(".product-grid__color-option");
    this.selectedSwatch.classList.remove("selected");
    selectedSwatch.classList.add("selected");
    this.selectedSwatch = selectedSwatch;
  }

  handleVariantSelect() {
    const selectedSelect = event.target.closest(
      ".product-grid__select-option-value"
    );
    this.selectedSelect.classList.remove("selected");
    selectedSelect.classList.add("selected");
    this.selectedSelect = selectedSelect;

    this.summaryText.innerHTML = this.selectedSelect.innerHTML;
    this.summary.style.justifyContent = "center";
    this.variantSelectsContainer.classList.add("hidden");
  }

  closeAccordion() {
    this.summaryText.innerHTML = "Choose your size";
    this.summary.style.justifyContent = "flex-start";
    this.variantSelectsContainer.classList.toggle("hidden");
  }

  // add to cart functionality
  handleAddToCart() {
    console.log("add to cart button clicked");
  }
}
customElements.define("product-item", productitem);
