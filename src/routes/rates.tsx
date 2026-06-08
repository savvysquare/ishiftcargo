import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  AlertCircle,
  ArrowRight,
  ArrowRightLeft,
  Plane,
  Ship,
  Snowflake,
  Car,
  Search,
  Check,
  X,
  AlertTriangle,
  Scale,
  DollarSign,
  Package,
  Info,
  ChevronDown
} from "lucide-react";

export const Route = createFileRoute("/rates")({
  head: () => ({
    meta: [
      { title: "Rates & Guidelines | iShiftCargo" },
      { name: "description", content: "Transparent rates, guidelines, allowed/prohibited items, and schedules for air, frozen, and sea shipping between Nigeria and Canada." },
      { property: "og:title", content: "Rates & Guidelines | iShiftCargo" },
      { property: "og:description", content: "Transparent rates and guidelines for shipping between Nigeria and Canada." },
      { property: "og:url", content: "/rates" },
    ],
    links: [{ rel: "canonical", href: "/rates" }],
  }),
  component: RatesPage,
});

type Service = {
  icon: typeof Plane;
  title: string;
  schedule: string;
  rows: { label: string; value: string }[];
  notes?: string[];
};

const canadaToNigeria: Service[] = [
  {
    icon: Plane, title: "Bi-Weekly Air Cargo (Dry)", schedule: "7–10 business days",
    rows: [
      { label: "5 kg and above", value: "$14.00 / kg CAD" },
      { label: "4.99 kg or less", value: "Flat $70 CAD" },
      { label: "Personal / smart electronics", value: "$70 CAD per device (negotiable for multiples)" },
      { label: "Weight basis", value: "Higher of physical or volumetric" },
    ],
    notes: ["No hidden clearance fees in Nigeria."],
  },
  {
    icon: Ship, title: "Sea Cargo — Box Shipping", schedule: "Approx. 2–3 months",
    rows: [
      { label: "Medium / large U-Haul box (max 32 kg / 70 lbs)", value: "$120 CAD" },
      { label: "Extra-large or overweight boxes", value: "Not accepted" },
    ],
    notes: ["No hidden charges. No clearance fees in Nigeria."],
  },
  {
    icon: Car, title: "Vehicle Shipping", schedule: "On-demand · varies",
    rows: [
      { label: "Sedans and SUVs from", value: "$1,650 USD (customs separate)" },
      { label: "Loading & securing", value: "Professional, included" },
      { label: "Mode", value: "Port-to-port or door-to-door" },
      { label: "Full container", value: "Available for 4+ vehicles" },
    ],
    notes: ["Vehicle inspection reports provided. Insurance options available."],
  },
];

const nigeriaToCanada: Service[] = [
  {
    icon: Snowflake,
    title: "Frozen / Fresh Produce-Air Cargo",
    schedule: "3 to 5 business days to Calgary",
    rows: [
      { label: "Shipping Fee (Naira)", value: "₦8,800 / kg" },
      { label: "Udara / Agbalumo Surcharge", value: "+ ₦1,000 / kg" },
      { label: "Clearance Fee (Canada)", value: "3.00 CAD / kg" },
      { label: "Minimum Chargeable Weight", value: "10 kg" }
    ],
    notes: [
      "Frozen food must be stone frozen at drop-off.",
      "Pack in transparent flat button pouches (ziplocks, nylon, or newspaper not allowed).",
      "Certain items cannot be mixed (e.g., Veggies cannot be mixed with snails).",
      "Pudding-like items (pap, locust beans) must be branded, in plastic containers with tight lids, and stone frozen."
    ]
  },
  {
    icon: Plane,
    title: "Dry-Air Cargo",
    schedule: "2 to 3 weeks (7 to 15 business days to Calgary)",
    rows: [
      { label: "Shipping Fee (Naira)", value: "₦6,300 / kg" },
      { label: "Clearance Fee (Canada)", value: "2.00 CAD / kg" },
      { label: "Minimum Chargeable Weight", value: "10 kg" }
    ],
    notes: [
      "For non-perishable foods, personal items, clothes etc.",
      "Supermarket-grade packaging is mandatory for all food items (transparent pouches with bilingual English/French labels)."
    ]
  },
  {
    icon: Ship,
    title: "Dry-Sea Cargo to Canada",
    schedule: "3 to 4 months from Nigeria to Calgary",
    rows: [
      { label: "Shipping Fee (Naira)", value: "₦400 / kg" },
      { label: "Minimum Chargeable Weight", value: "50 kg" },
      { label: "Clearance (Calgary)", value: "1.50 CAD / kg" },
      { label: "Clearance (Edmonton)", value: "1.60 CAD / kg" },
      { label: "Clearance (Toronto)", value: "1.80 CAD / kg" },
      { label: "Clearance (Other Cities)", value: "2.30 CAD / kg" }
    ],
    notes: [
      "Clearance to other cities includes delivery to a pickup location in your city.",
      "If there are not enough customers in your city to cover delivery, you will pay Calgary clearance ($1.50 CAD/kg) and pick up in Calgary or cover doorstep delivery."
    ]
  }
];

const itemsCatalog = [
  // DRY FOOD
  { name: "Dry grinded corn", allowed: true, type: "air-sea", category: "Food (Dry)" },
  { name: "Achi", allowed: true, type: "air-sea", category: "Food (Dry)" },
  { name: "Elubo", allowed: true, type: "air-sea", category: "Food (Dry)" },
  { name: "Cameroon pepper", allowed: true, type: "air-sea", category: "Food (Dry)" },
  { name: "Beans", allowed: true, type: "air-sea", category: "Food (Dry)", notes: "Add pepper and bay leaves for preservation" },
  { name: "Ofada rice", allowed: true, type: "air-sea", category: "Food (Dry)" },
  { name: "Golden Morn", allowed: true, type: "air-sea", category: "Food (Dry)" },
  { name: "Well-dried fish", allowed: true, type: "air-only", category: "Food (Dry)", notes: "Allowed for Air Cargo ONLY. Prohibited for Sea Cargo." },
  { name: "Pepper soup spice", allowed: true, type: "air-sea", category: "Food (Dry)" },
  { name: "Ehuru", allowed: true, type: "air-sea", category: "Food (Dry)" },
  { name: "Uda", allowed: true, type: "air-sea", category: "Food (Dry)" },
  { name: "Egbo", allowed: true, type: "air-sea", category: "Food (Dry)" },
  { name: "Ugba", allowed: true, type: "air-sea", category: "Food (Dry)" },
  { name: "Bitter kola", allowed: true, type: "air-sea", category: "Food (Dry)" },
  { name: "Dry iru (locust beans)", allowed: true, type: "air-sea", category: "Food (Dry)" },
  { name: "Ogbono/Ogbono (Blended)", allowed: true, type: "air-only", category: "Food (Dry)", notes: "Allowed for Air Cargo ONLY. Prohibited for Sea Cargo." },
  { name: "Crayfish (Blended/Unblended)", allowed: true, type: "air-only", category: "Food (Dry)", notes: "Allowed for Air Cargo ONLY. Prohibited for Sea Cargo." },
  { name: "Semo", allowed: true, type: "air-sea", category: "Food (Dry)" },
  { name: "Yam flour", allowed: true, type: "air-sea", category: "Food (Dry)" },
  { name: "Egusi", allowed: true, type: "air-sea", category: "Food (Dry)" },
  { name: "Garri", allowed: true, type: "air-sea", category: "Food (Dry)" },
  { name: "Okpa flour / Beans flour / Fufu flour", allowed: true, type: "air-sea", category: "Food (Dry)" },
  { name: "Plantain flour", allowed: true, type: "air-sea", category: "Food (Dry)" },
  { name: "Dry ogi of ogi flour", allowed: true, type: "air-sea", category: "Food (Dry)" },
  { name: "Abacha / Tapioca / Acha powder", allowed: true, type: "air-sea", category: "Food (Dry)" },
  { name: "Herbs / Tree barks", allowed: true, type: "air-sea", category: "Food (Dry)", notes: "Must be grounded only" },
  { name: "Seedless Dates", allowed: true, type: "air-sea", category: "Food (Dry)", notes: "Seeds must be removed" },

  // PROCESSED FOOD
  { name: "Non-alcoholic drinks (e.g. Maltina)", allowed: true, type: "air-sea", category: "Food (Processed)" },
  { name: "Maggi Signature", allowed: true, type: "air-sea", category: "Food (Processed)" },
  { name: "Knorr (ordinary)", allowed: true, type: "air-sea", category: "Food (Processed)", notes: "Chicken-flavored seasonings are strictly prohibited" },
  { name: "Salt / Sugar", allowed: true, type: "air-sea", category: "Food (Processed)" },
  { name: "Bournvita / Milo / Ovaltine", allowed: true, type: "air-sea", category: "Food (Processed)" },
  { name: "Milo tea", allowed: true, type: "air-sea", category: "Food (Processed)" },
  { name: "Sardine (Titus)", allowed: true, type: "air-sea", category: "Food (Processed)" },
  { name: "Geisha", allowed: true, type: "air-sea", category: "Food (Processed)" },
  { name: "Blue Band Margarine", allowed: true, type: "air-sea", category: "Food (Processed)" },
  { name: "Suya spice", allowed: true, type: "air-sea", category: "Food (Processed)" },
  { name: "Blended pepper soup spices", allowed: true, type: "air-sea", category: "Food (Processed)" },
  { name: "Dry banga spices", allowed: true, type: "air-sea", category: "Food (Processed)" },
  { name: "Pepper mix (like Gino)", allowed: true, type: "air-sea", category: "Food (Processed)" },
  { name: "Zobo leaves", allowed: true, type: "air-sea", category: "Food (Processed)" },
  { name: "Plantain chips", allowed: true, type: "air-sea", category: "Food (Processed)" },
  { name: "Burger-peanut snack", allowed: true, type: "air-sea", category: "Food (Processed)" },

  // FRESH/FROZEN
  { name: "Vegetables", allowed: true, type: "frozen-air", category: "Fresh/Frozen Produce", notes: "Keep fresh and chilled, NOT frozen" },
  { name: "Agbalumo / African Star Apple (Udara)", allowed: true, type: "frozen-air", category: "Fresh/Frozen Produce", notes: "Keep fresh and chilled, NOT frozen. Additional ₦1,000/kg surcharge" },
  { name: "Pear", allowed: true, type: "frozen-air", category: "Fresh/Frozen Produce", notes: "Keep fresh and chilled, NOT frozen" },
  { name: "Pap (Fermented cornmeal)", allowed: true, type: "frozen-air", category: "Fresh/Frozen Produce", notes: "Must be packed in branded plastic containers with tight lids, and stone frozen" },
  { name: "Frozen Snails", allowed: true, type: "frozen-air", category: "Fresh/Frozen Produce", notes: "Must be stone frozen at drop-off. Cannot be mixed with veggies in same box" },
  { name: "Frozen Periwinkles", allowed: true, type: "frozen-air", category: "Fresh/Frozen Produce", notes: "Must be stone frozen at drop-off" },
  { name: "Frozen Locust Beans (Iru)", allowed: true, type: "frozen-air", category: "Fresh/Frozen Produce", notes: "Must be packed in plastic containers with tight lids, branded, and stone frozen" },
  { name: "Moi Moi Leaves", allowed: true, type: "frozen-air", category: "Fresh/Frozen Produce", notes: "Shrink-wrapped, keep fresh and chilled" },
  { name: "Fish (Frozen/Smoked)", allowed: true, type: "frozen-air", category: "Fresh/Frozen Produce", notes: "Must be stone frozen at drop-off" },

  // HOUSEHOLD & KITCHEN
  { name: "Palm oil", allowed: true, type: "air-sea", category: "Household & Kitchen", notes: "Must be padded to prevent spilling (padding is at additional cost). Packaged separately" },
  { name: "Cooking pots", allowed: true, type: "air-sea", category: "Household & Kitchen" },
  { name: "Mortar & pestle", allowed: true, type: "air-sea", category: "Household & Kitchen" },

  // PERSONAL CARE
  { name: "Shampoo / Conditioner / Relaxer", allowed: true, type: "air-sea", category: "Personal Care" },
  { name: "Body cream", allowed: true, type: "air-sea", category: "Personal Care", notes: "No bleaching or whitening creams allowed" },
  { name: "African shea butter (Ori)", allowed: true, type: "air-sea", category: "Personal Care" },

  // CLOTHING
  { name: "Expression (hair extensions)", allowed: true, type: "air-sea", category: "Clothing & Accessories" },
  { name: "Weave-on and attachments", allowed: true, type: "air-sea", category: "Clothing & Accessories" },
  { name: "Native attires", allowed: true, type: "air-sea", category: "Clothing & Accessories" },
  { name: "Footwear / Clothes", allowed: true, type: "air-sea", category: "Clothing & Accessories" },

  // HERBAL DRINKS
  { name: "Coco samba", allowed: true, type: "air-sea", category: "Herbal Drinks" },
  { name: "Jekomo", allowed: true, type: "air-sea", category: "Herbal Drinks" },
  { name: "Shenuebo", allowed: true, type: "air-sea", category: "Herbal Drinks" },
  { name: "Handmade herbal drinks", allowed: true, type: "air-sea", category: "Herbal Drinks", notes: "Must be grounded or soaked, and bring ONLY the water" },
  { name: "Long jack", allowed: false, type: "none", category: "Herbal Drinks", notes: "Strictly prohibited" },
  { name: "Origin bitters", allowed: false, type: "none", category: "Herbal Drinks", notes: "Strictly prohibited" },

  // MISC
  { name: "Bible / Quran", allowed: true, type: "air-sea", category: "Religious & Spiritual" },
  { name: "Cake tools", allowed: true, type: "air-sea", category: "Tools & Miscellaneous" },
  { name: "Bags", allowed: true, type: "air-sea", category: "Tools & Miscellaneous" },
  { name: "Unbreakable frames", allowed: true, type: "air-sea", category: "Tools & Miscellaneous" },
  { name: "Books", allowed: true, type: "air-sea", category: "Tools & Miscellaneous" },
  { name: "Ayo Olopon (traditional game)", allowed: true, type: "air-sea", category: "Tools & Miscellaneous" },

  // PROHIBITED
  { name: "Meat / Chicken products (e.g. ponmo, kilishi)", allowed: false, type: "none", category: "Prohibited Items", notes: "Strictly prohibited by customs" },
  { name: "Milk (in any form, including baby food)", allowed: false, type: "none", category: "Prohibited Items", notes: "Strictly prohibited" },
  { name: "Chicken-flavored seasonings", allowed: false, type: "none", category: "Prohibited Items", notes: "Strictly prohibited" },
  { name: "Fake designer wear", allowed: false, type: "none", category: "Prohibited Items", notes: "Strictly prohibited" },
  { name: "Gold or valuable items", allowed: false, type: "none", category: "Prohibited Items", notes: "Costume jewelry is permitted, real gold is prohibited" },
  { name: "Herbs (ungrounded), seeds, sand or soil", allowed: false, type: "none", category: "Prohibited Items", notes: "Strictly prohibited" },
  { name: "Dry leaves", allowed: false, type: "none", category: "Prohibited Items", notes: "Only 1-2 pouches maximum allowed" },
  { name: "Skincare / Whitening / Bleaching products", allowed: false, type: "none", category: "Prohibited Items", notes: "Strictly prohibited" },
  { name: "Chemicals, drugs, or medicines", allowed: false, type: "none", category: "Prohibited Items", notes: "Strictly prohibited" },
  { name: "Explosives, flammables, aerosols, compressed containers", allowed: false, type: "none", category: "Prohibited Items", notes: "Strictly prohibited" },
  { name: "Parboiled rice", allowed: false, type: "none", category: "Prohibited Items", notes: "Ofada/local rice is allowed, parboiled is prohibited" },
  { name: "Charcoal", allowed: false, type: "none", category: "Prohibited Items", notes: "Strictly prohibited" },
  { name: "Camphor", allowed: false, type: "none", category: "Prohibited Items", notes: "Strictly prohibited" },
  { name: "Frozen soup", allowed: false, type: "none", category: "Prohibited Items", notes: "Perishable foods like frozen soup are prohibited" },
  { name: "Blended/unblended pepper (fresh/frozen)", allowed: false, type: "none", category: "Prohibited Items", notes: "Dry Cameroon pepper is allowed, fresh/frozen pepper is prohibited" },
];

function RatesPage() {
  const [tab, setTab] = useState<"ca-ng" | "ng-ca">("ng-ca");
  const active = tab === "ca-ng" ? canadaToNigeria : nigeriaToCanada;

  // Catalog state
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "allowed" | "prohibited">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = useMemo(() => {
    const cats = new Set(itemsCatalog.map(item => item.category));
    return ["all", ...Array.from(cats)];
  }, []);

  const filteredItems = useMemo(() => {
    return itemsCatalog.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                            item.category.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filterType === "all" || 
                            (filterType === "allowed" && item.allowed) || 
                            (filterType === "prohibited" && !item.allowed);
      const matchesCat = categoryFilter === "all" || item.category === categoryFilter;

      return matchesSearch && matchesFilter && matchesCat;
    });
  }, [search, filterType, categoryFilter]);

  return (
    <>
      <section className="bg-[var(--surface)] relative overflow-hidden">
        <div className="container-x py-20 md:py-28 relative z-10 text-center md:text-left">
          <div className="flex justify-center md:justify-start items-center gap-2 mb-4">
            <span className="rounded-full bg-[var(--teal-soft)] px-3 py-1 text-xs font-bold text-[var(--teal)] uppercase tracking-wider">
              iSHIFT & Debillicious Partnership
            </span>
          </div>
          <span className="eyebrow">Rates, Guidelines & Prohibitions</span>
          <h1 className="mt-5 mx-auto md:mx-0 max-w-3xl text-4xl font-bold tracking-tight text-[var(--navy)] md:text-6xl">
            Transparent pricing. Complete packing rules.
          </h1>
          <p className="mt-5 mx-auto md:mx-0 max-w-2xl text-lg text-muted-foreground">
            We publish every rate and guideline clearly. Before shipping, confirm current pricing and browse our searchable catalog of allowed and prohibited items.
          </p>
        </div>
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-[var(--teal-soft)]/20 rounded-full blur-3xl -z-10" />
      </section>

      {/* PRICE VOLATILITY WARNING */}
      <div className="bg-amber-50 border-y border-amber-200">
        <div className="container-x py-3 flex items-center justify-center gap-2.5 text-sm text-amber-800">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
          <p className="font-medium">
            <strong>⚠️ IMPORTANT:</strong> All prices are valid <strong>TODAY ONLY</strong> and subject to change <strong>WITHOUT NOTICE</strong>. Always confirm current rates before shipping.
          </p>
        </div>
      </div>

      <section className="section-y">
        <div className="container-x">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-[var(--navy)]">Select Shipping Direction</h2>
            <p className="text-sm text-muted-foreground mt-2">Switch tabs to see rates and terms for each route.</p>
            <div className="mt-6 inline-flex w-full max-w-sm items-center rounded-full border border-border bg-background p-1 shadow-soft">
              {[
                { key: "ng-ca", label: "Nigeria → Canada" },
                { key: "ca-ng", label: "Canada → Nigeria" },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key as typeof tab)}
                  className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
                    tab === t.key ? "bg-[var(--navy)] text-white shadow-soft" : "text-muted-foreground hover:text-[var(--navy)]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 items-stretch">
            {active.map((s) => (
              <article key={s.title} className="flex flex-col rounded-3xl border border-border bg-card p-8 shadow-soft relative">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--teal-soft)] text-[var(--navy)] shrink-0">
                    <s.icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--navy)] leading-tight">{s.title}</h3>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--teal)] mt-1">{s.schedule}</p>
                  </div>
                </div>

                <dl className="mt-6 divide-y divide-border">
                  {s.rows.map((r) => (
                    <div key={r.label} className="grid grid-cols-2 gap-4 py-3 text-sm">
                      <dt className="text-muted-foreground">{r.label}</dt>
                      <dd className="text-right font-bold text-[var(--navy)]">{r.value}</dd>
                    </div>
                  ))}
                </dl>

                {s.notes && (
                  <ul className="mt-auto pt-6 space-y-2 border-t border-dashed border-border">
                    {s.notes.map((n) => (
                      <li key={n} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--teal)] mt-1.5 shrink-0" />
                        <span className="leading-relaxed">{n}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>

          {/* SPECIAL ITEMS & PACKAGING CHARGES */}
          {tab === "ng-ca" && (
            <div className="mt-16 grid gap-8 md:grid-cols-2">
              <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
                <h3 className="text-xl font-bold text-[var(--navy)] flex items-center gap-2 mb-4">
                  <Car className="h-5 w-5 text-[var(--teal)]" /> Special Electronics Cargo
                </h3>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--surface-2)] border border-border">
                  <div>
                    <p className="text-sm font-semibold text-[var(--navy)]">Laptops, Tablets & Phones</p>
                    <p className="text-xs text-muted-foreground">Flat rate clearance & shipping</p>
                  </div>
                  <span className="text-lg font-bold text-[var(--teal)]">₦40,000 / item</span>
                </div>
                <div className="mt-6 space-y-3 text-xs leading-relaxed text-muted-foreground">
                  <p>⚠️ Electronic items are inspected, verified, and secured with dedicated handling processes to clear Canadian customs safely.</p>
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
                <h3 className="text-xl font-bold text-[var(--navy)] flex items-center gap-2 mb-4">
                  <Package className="h-5 w-5 text-[var(--teal)]" /> Packaging Materials & Options
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Supermarket-grade packaging is mandatory for all food items. You can purchase these at our warehouse or bring yours.
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Styrofoam Box (50L)</span>
                    <span className="font-semibold text-[var(--navy)]">₦19,500</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Styrofoam Box (30L)</span>
                    <span className="font-semibold text-[var(--navy)]">₦12,500</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Styrofoam Box (4.5L)</span>
                    <span className="font-semibold text-[var(--navy)]">₦6,300</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Cartons</span>
                    <span className="font-semibold text-[var(--navy)]">₦1,000 – ₦3,000</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Vacuum Seal Bags</span>
                    <span className="font-semibold text-[var(--navy)]">₦1,000 – ₦2,000</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Pouches with bilingual labels (Large / Small)</span>
                    <span className="font-semibold text-[var(--navy)]">₦500 / ₦400</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Food handling fee (per customer)</span>
                    <span className="font-semibold text-[var(--navy)]">₦5,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Freezing services (optional)</span>
                    <span className="font-semibold text-[var(--navy)]">₦400 / kg / day <span className="text-[10px] text-muted-foreground">(Ice blocks free)</span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SEARCHABLE ITEMS CATALOG */}
      <section className="bg-[var(--surface)] section-y border-y border-border">
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <span className="eyebrow">Interactive Verification</span>
            <h2 className="mt-3 text-3xl font-bold text-[var(--navy)] md:text-4xl">Can I ship this item?</h2>
            <p className="mt-2 text-base text-muted-foreground">
              Search and filter our comprehensive catalog of acceptable and strictly prohibited shipping items.
            </p>
          </div>

          <div className="max-w-4xl mx-auto rounded-3xl border border-border bg-card p-5 md:p-8 shadow-soft">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-center">
              {/* Search */}
              <div className="relative sm:col-span-2 md:col-span-2">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search item (e.g. Garri, Snails, Meat...)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-sm text-[var(--navy)] outline-none focus:ring-2 focus:ring-[var(--teal)]/20 focus:border-[var(--teal)]"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-[var(--navy)] outline-none focus:ring-2 focus:ring-[var(--teal)]/20 focus:border-[var(--teal)]"
                >
                  <option value="all">All Statuses</option>
                  <option value="allowed">Allowed / Approved</option>
                  <option value="prohibited">Prohibited / Contraband</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-[var(--navy)] outline-none focus:ring-2 focus:ring-[var(--teal)]/20 focus:border-[var(--teal)]"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* List Results */}
            <div className="mt-8 rounded-2xl border border-border bg-background overflow-hidden">
              <div className="overflow-x-auto max-h-[440px] overflow-y-auto">
                <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-[var(--surface-2)] text-[var(--navy)] font-semibold border-b border-border">
                      <th className="px-4 py-3 whitespace-nowrap">Item Name</th>
                      <th className="px-4 py-3 whitespace-nowrap">Category</th>
                      <th className="px-4 py-3 whitespace-nowrap">Status</th>
                      <th className="px-4 py-3 whitespace-nowrap">Handling Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-[var(--surface)]/50 transition-colors">
                          <td className="px-4 py-3 font-medium text-[var(--navy)] min-w-[160px]">{item.name}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{item.category}</td>
                          <td className="px-4 py-3">
                            {item.allowed ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 whitespace-nowrap">
                                <Check className="h-3 w-3" /> Allowed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 whitespace-nowrap">
                                <X className="h-3 w-3" /> Prohibited
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground leading-relaxed min-w-[200px]">
                            {item.notes || "Standard packaging guidelines apply."}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-muted-foreground">
                          No items found matching your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground flex items-start gap-1.5">
              <Info className="h-3.5 w-3.5 text-[var(--teal)] shrink-0 mt-0.5" />
              <span>Blended Ogbono, Crayfish, and Dried Fish are permitted on <strong>air cargo only</strong>. Sea cargo strictly prohibits these items.</span>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILED INFORMATION & DISCLAIMERS */}
      <section className="section-y">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <span className="eyebrow">Guidelines & Terms</span>
              <h2 className="mt-5 text-3xl font-bold text-[var(--navy)] md:text-4xl">Essential shipping information.</h2>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                iSHIFT Services Inc and Debillicious Cart & Cargo partner to provide transparent, reliable shipping. Please carefully review these custom regulations, timelines, and packaging policies.
              </p>
              <div className="mt-8 space-y-6">
                <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                  <h4 className="text-sm font-bold text-[var(--navy)]">⏰ Timeline & Dispatch Disclaimer</h4>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    iSHIFT does not guarantee shipping timelines. Shipping time-sensitive items is at your own risk. iSHIFT is not liable for customs delays. Ask our team for premium express DHL/UPS options if required.
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                  <h4 className="text-sm font-bold text-[var(--navy)]">🍍 Yam & Perishable Goods Disclaimer</h4>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    Shipping perishable items like yam is at the customer's own risk. We are not liable for spoilage due to the condition items are dropped off in. Perishables must be inspected and in excellent state at drop-off.
                  </p>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                  <h4 className="text-sm font-bold text-[var(--navy)]">🚛 Local Delivery Services Liability</h4>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    Optional delivery, courier, and pickup services are offered as a convenience. Alternatively, direct warehouse pick-up is available. Customers use delivery and courier services at their own risk.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-amber-200 bg-amber-50/50 p-6 md:p-8">
                <h4 className="text-base font-bold text-amber-900 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-700 shrink-0" /> Customs & Export Regulations
                </h4>
                <div className="mt-4 space-y-3 text-xs leading-relaxed text-amber-800">
                  <p>
                    <strong>Export Inspection:</strong> All shipments are re-examined at the airport by export authorities in Nigeria. Items can be rejected or destroyed at the point of examination.
                  </p>
                  <p>
                    <strong>Destination Inspections:</strong> Custom Officials in Canada may choose to examine container shipments upon arrival. These destination examinations are always at a cost set by customs. If a container is examined, customers are required to pay the inspection cost share to release the container.
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-soft">
                <h4 className="text-base font-bold text-[var(--navy)] flex items-center gap-2">
                  <Scale className="h-5 w-5 text-[var(--teal)] shrink-0" /> Packaging Weight Policy
                </h4>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  The weight of packaging materials (e.g. cartons, styrofoam boxes, padding) is included in your total chargeable shipment weight. 
                </p>
                <div className="mt-4 rounded-xl bg-[var(--surface-2)] p-4 text-xs font-semibold text-[var(--navy)] flex items-center gap-2">
                  <span className="text-lg font-bold text-[var(--teal)]">Example:</span>
                  <span>7 kg food item + 3 kg packaging = 10 kg total chargeable weight.</span>
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-soft">
                <h4 className="text-base font-bold text-[var(--navy)] mb-4">💡 Pro-tips for a Smooth Shipment</h4>
                <ul className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                  <li className="flex gap-2">
                    <span className="text-[var(--teal)] font-bold shrink-0">1.</span>
                    <span><strong>Avoid Friday Drop-offs:</strong> Drop off packages early from Monday to Thursday. Timely drop-off avoids rush and ensures inclusion.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[var(--teal)] font-bold shrink-0">2.</span>
                    <span><strong>Pre-estimate Weight:</strong> Weigh your items at home to check rates and avoid last-minute repacking or removing items.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[var(--teal)] font-bold shrink-0">3.</span>
                    <span><strong>Dry Fish & Frozen Prep:</strong> Dry fish must be fully dry to prevent mold. Frozen foods must be rock-solid at drop-off. Veggies must be fresh and chilled.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[var(--teal)] font-bold shrink-0">4.</span>
                    <span><strong>Bilingual Labels:</strong> CFIA regulations require English and French product listings on transparent food pouches.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-14 rounded-3xl border border-border bg-[var(--navy)] p-8 text-center text-white shadow-lift md:p-12">
            <h2 className="text-2xl font-bold md:text-3xl">Ready to ship?</h2>
            <p className="mt-2 text-sm text-white/75 md:text-base">Get an instant estimate and book your shipment online in minutes.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/book" className="inline-flex items-center justify-center rounded-full bg-[var(--teal)] px-6 py-3 text-sm font-semibold text-white">
                Book a shipment
              </Link>
              <a href="tel:+14034316456" className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
                Contact Calgary Office
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
