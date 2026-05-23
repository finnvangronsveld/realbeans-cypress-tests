Cypress.on("uncaught:exception", () => {
  return false;
});

const storeUrl = "https://r1043273-realbeans.myshopify.com/";
const password = "loseab";

const introText =
  "Since 1801, RealBeans has roasted premium coffee in Antwerp for Europe’s finest cafes. Ethically sourced beans, crafted with care.";

const aboutText =
  "From a small Antwerp grocery to a European coffee staple, RealBeans honors tradition while innovating for the future. Our beans are roasted in-house, shipped from Antwerp or Stockholm, and loved across the continent.";

const products = [
  {
    name: "Blended coffee 5kg",
    handle: "blended-coffee-5kg",
    price: "€55,00",
    description: "RealBeans coffee, ready to brew.",
  },
  {
    name: "Roasted coffee beans 5kg",
    handle: "roasted-coffee-beans-5kg",
    price: "€40,00",
    description: "Our best and sustainable real roasted beans.",
  },
];

function acceptCookiesIfVisible() {
  cy.get("body").then(($body) => {
    if ($body.text().includes("Cookie consent")) {
      cy.contains("button", "Accept").click();
    }
  });
}

function unlockStore() {
  cy.visit(storeUrl);

  cy.get("body").then(($body) => {
    if ($body.find('input[type="password"]').length > 0) {
      cy.get('input[type="password"]').type(password + "{enter}");
      cy.url().should("not.include", "/password");
    }
  });

  acceptCookiesIfVisible();
}

function visitPage(path = "") {
  unlockStore();
  cy.visit(storeUrl + path);
  acceptCookiesIfVisible();
}

function visibleText(text) {
  cy.contains("main", text).should("be.visible");
}

describe("RealBeans Shopify webshop", () => {
  it("opens the homepage and shows the intro text", () => {
    visitPage();

    visibleText(introText);
  });

  it("shows the product list on the homepage", () => {
    visitPage();

    cy.scrollTo("bottom");

    visibleText("Blended coffee 5kg");
    visibleText("€55,00");

    visibleText("Roasted coffee beans 5kg");
    visibleText("€40,00");
  });

  it("catalog page shows the correct products", () => {
    visitPage("collections/all");

    products.forEach((product) => {
      visibleText(product.name);
      visibleText(product.price);
    });
  });

  it("sorting by price changes product order", () => {
    visitPage("collections/all?sort_by=price-ascending");

    cy.get('main a[href*="/products/"]:visible')
      .first()
      .should("contain.text", "Roasted coffee beans 5kg");

    visitPage("collections/all?sort_by=price-descending");

    cy.get('main a[href*="/products/"]:visible')
      .first()
      .should("contain.text", "Blended coffee 5kg");
  });

  it("product detail pages show the correct descriptions, prices and images", () => {
    products.forEach((product) => {
      visitPage("products/" + product.handle);

      visibleText(product.name);
      visibleText(product.price);
      visibleText(product.description);

      cy.get("main img:visible").should("exist");
    });
  });

  it("about page shows the RealBeans history paragraph", () => {
    visitPage("pages/about");

    visibleText(aboutText);
  });
});