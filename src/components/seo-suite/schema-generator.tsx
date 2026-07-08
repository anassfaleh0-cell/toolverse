"use client";

import { useState } from "react";
import { Input, Button } from "@/components/ui";
import { CopyButton } from "@/components/shared";

function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: "application/ld+json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

type SchemaType = "Article" | "Product" | "LocalBusiness" | "FAQ" | "BreadcrumbList" | "Organization" | "Person" | "Recipe" | "Event" | "Review";

const SCHEMA_TYPES: SchemaType[] = ["Article", "Product", "LocalBusiness", "FAQ", "BreadcrumbList", "Organization", "Person", "Recipe", "Event", "Review"];

interface SchemaFields {
  name: string;
  description: string;
  url: string;
  image: string;
  authorName: string;
  publisherName: string;
  datePublished: string;
  price: string;
  currency: string;
  availability: string;
  address: string;
  telephone: string;
  openingHours: string;
  questions: string;
  position: string;
  logo: string;
  jobTitle: string;
  recipeCuisine: string;
  cookTime: string;
  ingredients: string;
  startDate: string;
  endDate: string;
  location: string;
  reviewRating: string;
  reviewBody: string;
  itemReviewed: string;
}

const defaultFields: SchemaFields = {
  name: "",
  description: "",
  url: "https://example.com",
  image: "",
  authorName: "",
  publisherName: "",
  datePublished: new Date().toISOString().split("T")[0],
  price: "",
  currency: "USD",
  availability: "InStock",
  address: "",
  telephone: "",
  openingHours: "",
  questions: "",
  position: "",
  logo: "",
  jobTitle: "",
  recipeCuisine: "",
  cookTime: "",
  ingredients: "",
  startDate: "",
  endDate: "",
  location: "",
  reviewRating: "",
  reviewBody: "",
  itemReviewed: "",
};

export function SchemaGenerator() {
  const [schemaType, setSchemaType] = useState<SchemaType>("Article");
  const [fields, setFields] = useState<SchemaFields>(defaultFields);

  function setField(key: keyof SchemaFields, value: string) {
    setFields(prev => ({ ...prev, [key]: value }));
  }

  function generateSchema() {
    const schema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": schemaType,
    };

    switch (schemaType) {
      case "Article":
        if (fields.name) schema.headline = fields.name;
        if (fields.description) schema.description = fields.description;
        if (fields.url) schema.url = fields.url;
        if (fields.image) schema.image = fields.image;
        if (fields.datePublished) schema.datePublished = fields.datePublished;
        if (fields.authorName) schema.author = { "@type": "Person", name: fields.authorName };
        if (fields.publisherName) schema.publisher = { "@type": "Organization", name: fields.publisherName };
        break;
      case "Product":
        if (fields.name) schema.name = fields.name;
        if (fields.description) schema.description = fields.description;
        if (fields.image) schema.image = fields.image;
        if (fields.price) schema.offers = { "@type": "Offer", price: fields.price, priceCurrency: fields.currency || "USD", availability: `https://schema.org/${fields.availability || "InStock"}` };
        break;
      case "LocalBusiness":
        if (fields.name) schema.name = fields.name;
        if (fields.description) schema.description = fields.description;
        if (fields.address) schema.address = { "@type": "PostalAddress", streetAddress: fields.address };
        if (fields.telephone) schema.telephone = fields.telephone;
        if (fields.openingHours) schema.openingHours = fields.openingHours.split("\n").filter(Boolean);
        if (fields.url) schema.url = fields.url;
        break;
      case "FAQ":
        if (fields.questions) {
          const qaList = fields.questions.split("\n").filter(Boolean).map(q => {
            const [qText, aText] = q.split("|").map(s => s.trim());
            return qText ? { "@type": "Question", name: qText, acceptedAnswer: { "@type": "Answer", text: aText || "Answer" } } : null;
          }).filter(Boolean);
          schema.mainEntity = qaList;
        }
        break;
      case "BreadcrumbList":
        if (fields.questions) {
          const items = fields.questions.split("\n").filter(Boolean).map((item, i) => {
            const [name, href] = item.split("|").map(s => s.trim());
            return { "@type": "ListItem", position: i + 1, name, ...(href ? { item: href } : {}) };
          });
          schema.itemListElement = items;
        }
        break;
      case "Organization":
        if (fields.name) schema.name = fields.name;
        if (fields.description) schema.description = fields.description;
        if (fields.url) schema.url = fields.url;
        if (fields.logo) schema.logo = fields.logo;
        break;
      case "Person":
        if (fields.name) schema.name = fields.name;
        if (fields.jobTitle) schema.jobTitle = fields.jobTitle;
        if (fields.url) schema.url = fields.url;
        if (fields.description) schema.description = fields.description;
        break;
      case "Recipe":
        if (fields.name) schema.name = fields.name;
        if (fields.description) schema.description = fields.description;
        if (fields.image) schema.image = fields.image;
        if (fields.recipeCuisine) schema.recipeCuisine = fields.recipeCuisine;
        if (fields.cookTime) schema.cookTime = fields.cookTime;
        if (fields.ingredients) schema.recipeIngredient = fields.ingredients.split("\n").filter(Boolean);
        if (fields.authorName) schema.author = { "@type": "Person", name: fields.authorName };
        if (fields.datePublished) schema.datePublished = fields.datePublished;
        break;
      case "Event":
        if (fields.name) schema.name = fields.name;
        if (fields.description) schema.description = fields.description;
        if (fields.startDate) schema.startDate = fields.startDate;
        if (fields.endDate) schema.endDate = fields.endDate;
        if (fields.location) schema.location = { "@type": "Place", name: fields.location };
        if (fields.url) schema.url = fields.url;
        break;
      case "Review":
        if (fields.reviewRating) schema.reviewRating = { "@type": "Rating", ratingValue: fields.reviewRating };
        if (fields.reviewBody) schema.reviewBody = fields.reviewBody;
        if (fields.authorName) schema.author = { "@type": "Person", name: fields.authorName };
        if (fields.itemReviewed) schema.itemReviewed = { "@type": "Thing", name: fields.itemReviewed };
        break;
    }

    return JSON.stringify(schema, null, 2);
  }

  const output = generateSchema();

  const renderFields = () => {
    switch (schemaType) {
      case "Article":
        return (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label htmlFor="s-name" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Headline</label><Input id="s-name" value={fields.name} onChange={(e) => setField("name", e.target.value)} aria-label="Headline" /></div>
              <div><label htmlFor="s-url" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">URL</label><Input id="s-url" type="url" value={fields.url} onChange={(e) => setField("url", e.target.value)} aria-label="URL" /></div>
            </div>
            <div><label htmlFor="s-desc" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label><textarea id="s-desc" value={fields.description} onChange={(e) => setField("description", e.target.value)} rows={2} className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-400" aria-label="Description" /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label htmlFor="s-author" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Author Name</label><Input id="s-author" value={fields.authorName} onChange={(e) => setField("authorName", e.target.value)} aria-label="Author" /></div>
              <div><label htmlFor="s-publisher" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Publisher Name</label><Input id="s-publisher" value={fields.publisherName} onChange={(e) => setField("publisherName", e.target.value)} aria-label="Publisher" /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label htmlFor="s-date" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Date Published</label><Input id="s-date" type="date" value={fields.datePublished} onChange={(e) => setField("datePublished", e.target.value)} aria-label="Date published" /></div>
              <div><label htmlFor="s-image" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Image URL</label><Input id="s-image" type="url" value={fields.image} onChange={(e) => setField("image", e.target.value)} aria-label="Image" /></div>
            </div>
          </>
        );
      case "Product":
        return (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label htmlFor="s-pname" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Product Name</label><Input id="s-pname" value={fields.name} onChange={(e) => setField("name", e.target.value)} aria-label="Product name" /></div>
              <div><label htmlFor="s-pimage" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Image URL</label><Input id="s-pimage" type="url" value={fields.image} onChange={(e) => setField("image", e.target.value)} aria-label="Image" /></div>
            </div>
            <div><label htmlFor="s-pdesc" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label><textarea id="s-pdesc" value={fields.description} onChange={(e) => setField("description", e.target.value)} rows={2} className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-400" aria-label="Description" /></div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div><label htmlFor="s-price" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Price</label><Input id="s-price" type="number" step="0.01" value={fields.price} onChange={(e) => setField("price", e.target.value)} aria-label="Price" /></div>
              <div><label htmlFor="s-currency" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Currency</label><Input id="s-currency" value={fields.currency} onChange={(e) => setField("currency", e.target.value)} aria-label="Currency" /></div>
              <div><label htmlFor="s-avail" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Availability</label><select id="s-avail" value={fields.availability} onChange={(e) => setField("availability", e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-400" aria-label="Availability"><option value="InStock">In Stock</option><option value="OutOfStock">Out of Stock</option><option value="PreOrder">Pre-Order</option></select></div>
            </div>
          </>
        );
      case "FAQ":
        return (
          <div>
            <label htmlFor="s-faq" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Questions and Answers (one per line: Question | Answer)</label>
            <textarea id="s-faq" value={fields.questions} onChange={(e) => setField("questions", e.target.value)} rows={5} className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-400" placeholder="What is your return policy? | We accept returns within 30 days.&#10;How long does shipping take? | Standard shipping takes 5-7 business days." aria-label="FAQ entries" />
          </div>
        );
      case "BreadcrumbList":
        return (
          <div>
            <label htmlFor="s-bread" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Breadcrumb Items (one per line: Name | URL)</label>
            <textarea id="s-bread" value={fields.questions} onChange={(e) => setField("questions", e.target.value)} rows={5} className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-400" placeholder="Home | https://example.com&#10;Products | https://example.com/products&#10;Product Name" aria-label="Breadcrumb items" />
          </div>
        );
      case "LocalBusiness":
        return (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label htmlFor="s-bname" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Business Name</label><Input id="s-bname" value={fields.name} onChange={(e) => setField("name", e.target.value)} aria-label="Business name" /></div>
              <div><label htmlFor="s-btel" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Telephone</label><Input id="s-btel" value={fields.telephone} onChange={(e) => setField("telephone", e.target.value)} aria-label="Telephone" /></div>
            </div>
            <div><label htmlFor="s-bdesc" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label><textarea id="s-bdesc" value={fields.description} onChange={(e) => setField("description", e.target.value)} rows={2} className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-400" aria-label="Description" /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label htmlFor="s-addr" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Street Address</label><Input id="s-addr" value={fields.address} onChange={(e) => setField("address", e.target.value)} aria-label="Address" /></div>
              <div><label htmlFor="s-burl" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Website URL</label><Input id="s-burl" type="url" value={fields.url} onChange={(e) => setField("url", e.target.value)} aria-label="Website URL" /></div>
            </div>
            <div><label htmlFor="s-hours" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Opening Hours (one per line, e.g., Mo-Fr 09:00-17:00)</label><textarea id="s-hours" value={fields.openingHours} onChange={(e) => setField("openingHours", e.target.value)} rows={3} className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-400" aria-label="Opening hours" /></div>
          </>
        );
      case "Organization":
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label htmlFor="s-orgname" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Organization Name</label><Input id="s-orgname" value={fields.name} onChange={(e) => setField("name", e.target.value)} aria-label="Organization name" /></div>
            <div><label htmlFor="s-orgurl" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">URL</label><Input id="s-orgurl" type="url" value={fields.url} onChange={(e) => setField("url", e.target.value)} aria-label="URL" /></div>
            <div><label htmlFor="s-orglogo" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Logo URL</label><Input id="s-orglogo" type="url" value={fields.logo} onChange={(e) => setField("logo", e.target.value)} aria-label="Logo" /></div>
            <div><label htmlFor="s-orgdesc" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label><Input id="s-orgdesc" value={fields.description} onChange={(e) => setField("description", e.target.value)} aria-label="Description" /></div>
          </div>
        );
      case "Person":
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label htmlFor="s-pername" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label><Input id="s-pername" value={fields.name} onChange={(e) => setField("name", e.target.value)} aria-label="Name" /></div>
            <div><label htmlFor="s-job" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Job Title</label><Input id="s-job" value={fields.jobTitle} onChange={(e) => setField("jobTitle", e.target.value)} aria-label="Job title" /></div>
            <div><label htmlFor="s-perurl" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">URL</label><Input id="s-perurl" type="url" value={fields.url} onChange={(e) => setField("url", e.target.value)} aria-label="URL" /></div>
            <div><label htmlFor="s-perdesc" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label><Input id="s-perdesc" value={fields.description} onChange={(e) => setField("description", e.target.value)} aria-label="Description" /></div>
          </div>
        );
      case "Recipe":
        return (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label htmlFor="s-rname" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Recipe Name</label><Input id="s-rname" value={fields.name} onChange={(e) => setField("name", e.target.value)} aria-label="Recipe name" /></div>
              <div><label htmlFor="s-rcuisine" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Cuisine</label><Input id="s-rcuisine" value={fields.recipeCuisine} onChange={(e) => setField("recipeCuisine", e.target.value)} aria-label="Cuisine" /></div>
            </div>
            <div><label htmlFor="s-rdesc" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label><textarea id="s-rdesc" value={fields.description} onChange={(e) => setField("description", e.target.value)} rows={2} className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-400" aria-label="Description" /></div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div><label htmlFor="s-rtime" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Cook Time (ISO 8601)</label><Input id="s-rtime" value={fields.cookTime} onChange={(e) => setField("cookTime", e.target.value)} placeholder="PT30M" aria-label="Cook time" /></div>
              <div><label htmlFor="s-rauthor" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Author</label><Input id="s-rauthor" value={fields.authorName} onChange={(e) => setField("authorName", e.target.value)} aria-label="Author" /></div>
              <div><label htmlFor="s-rdate" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Date Published</label><Input id="s-rdate" type="date" value={fields.datePublished} onChange={(e) => setField("datePublished", e.target.value)} aria-label="Date published" /></div>
            </div>
            <div><label htmlFor="s-rings" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Ingredients (one per line)</label><textarea id="s-rings" value={fields.ingredients} onChange={(e) => setField("ingredients", e.target.value)} rows={3} className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-400" placeholder="2 cups flour&#10;1 cup sugar&#10;3 eggs" aria-label="Ingredients" /></div>
            <div><label htmlFor="s-rimg" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Image URL</label><Input id="s-rimg" type="url" value={fields.image} onChange={(e) => setField("image", e.target.value)} aria-label="Image" /></div>
          </>
        );
      case "Event":
        return (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label htmlFor="s-ename" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Event Name</label><Input id="s-ename" value={fields.name} onChange={(e) => setField("name", e.target.value)} aria-label="Event name" /></div>
              <div><label htmlFor="s-eloc" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Location</label><Input id="s-eloc" value={fields.location} onChange={(e) => setField("location", e.target.value)} aria-label="Location" /></div>
            </div>
            <div><label htmlFor="s-edesc" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label><textarea id="s-edesc" value={fields.description} onChange={(e) => setField("description", e.target.value)} rows={2} className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-400" aria-label="Description" /></div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div><label htmlFor="s-sdate" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Start Date</label><Input id="s-sdate" type="datetime-local" value={fields.startDate} onChange={(e) => setField("startDate", e.target.value)} aria-label="Start date" /></div>
              <div><label htmlFor="s-edate" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">End Date</label><Input id="s-edate" type="datetime-local" value={fields.endDate} onChange={(e) => setField("endDate", e.target.value)} aria-label="End date" /></div>
              <div><label htmlFor="s-eurl" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">URL</label><Input id="s-eurl" type="url" value={fields.url} onChange={(e) => setField("url", e.target.value)} aria-label="URL" /></div>
            </div>
          </>
        );
      case "Review":
        return (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label htmlFor="s-revitem" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Item Reviewed</label><Input id="s-revitem" value={fields.itemReviewed} onChange={(e) => setField("itemReviewed", e.target.value)} aria-label="Item reviewed" /></div>
              <div><label htmlFor="s-revrating" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Rating (1-5)</label><Input id="s-revrating" type="number" min="1" max="5" step="0.5" value={fields.reviewRating} onChange={(e) => setField("reviewRating", e.target.value)} aria-label="Rating" /></div>
            </div>
            <div><label htmlFor="s-revbody" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Review Body</label><textarea id="s-revbody" value={fields.reviewBody} onChange={(e) => setField("reviewBody", e.target.value)} rows={3} className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-400" aria-label="Review body" /></div>
            <div><label htmlFor="s-revauthor" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Author Name</label><Input id="s-revauthor" value={fields.authorName} onChange={(e) => setField("authorName", e.target.value)} aria-label="Author" /></div>
          </>
        );
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <label htmlFor="s-type" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Schema Type</label>
        <select id="s-type" value={schemaType} onChange={(e) => { setSchemaType(e.target.value as SchemaType); setFields(defaultFields); }} className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-400" aria-label="Schema type">
          {SCHEMA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {renderFields()}

      <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between border-b bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">JSON-LD Schema</p>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => downloadFile(output, "schema.jsonld")} aria-label="Download schema">
              Download
            </Button>
            <CopyButton text={output} label="Copy" />
          </div>
        </div>
        <pre className="overflow-x-auto p-5 font-mono text-sm text-zinc-900 dark:text-zinc-50">{output}</pre>
      </div>
    </div>
  );
}
