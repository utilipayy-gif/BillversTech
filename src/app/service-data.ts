export type Service = {
  slug: string;
  title: string;
  category: string;
  short: string;
  intro: string;
  benefits: string[];
  deliverables: string[];
  price?: number;
};

const startingPrices: Record<string, number> = {
  "website-design": 14999, "website-development": 24999, "responsive-websites": 17999,
  "logo-design": 7999, "website-redesign": 19999, "website-maintenance": 4999,
  "corporate-websites": 34999, "blog-websites": 17999, seo: 9999,
  "ppc-management": 9999, "social-media": 11999, "email-marketing": 8999,
  "custom-web-applications": 49999, "content-management-systems": 29999,
  "school-management-systems": 79999, "mobile-applications": 69999,
  "ecommerce-websites": 39999, "motion-presentations": 14999,
  "interactive-web-experiences": 29999, "digital-advertising-creative": 9999,
  "domain-registration": 1499, "web-hosting": 4999, "ssl-certificates": 1999,
};

export function servicePrice(service: Service) {
  return service.price ?? startingPrices[service.slug] ?? 14999;
}

export function formatPrice(service: Service) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(servicePrice(service));
}

export const serviceGroups = [
  {
    title: "Design & Development",
    number: "01",
    description: "Distinctive, responsive websites designed around your business and the actions customers should take.",
    services: ["website-design", "website-development", "responsive-websites", "logo-design", "website-redesign", "website-maintenance", "corporate-websites", "blog-websites"],
  },
  {
    title: "Internet Marketing",
    number: "02",
    description: "Practical campaigns that help the right people discover, understand and return to your business.",
    services: ["seo", "ppc-management", "social-media", "email-marketing"],
  },
  {
    title: "Application Development",
    number: "03",
    description: "Custom digital products and management tools shaped around your real workflow—not generic software.",
    services: ["custom-web-applications", "content-management-systems", "school-management-systems", "mobile-applications", "ecommerce-websites"],
  },
  {
    title: "Creative & Multimedia",
    number: "04",
    description: "Motion, interactive presentations and campaign creative that make complex ideas easier to remember.",
    services: ["motion-presentations", "interactive-web-experiences", "digital-advertising-creative"],
  },
  {
    title: "Domain & Hosting",
    number: "05",
    description: "Domain, hosting and SSL setup with dependable support, clear ownership and room to grow.",
    services: ["domain-registration", "web-hosting", "ssl-certificates"],
  },
] as const;

export const services: Service[] = [
  { slug:"website-design", title:"Website Design", category:"Design & Development", short:"Custom visual design that makes your business clear, credible and memorable.", intro:"Your website often makes the first impression before you ever speak to a customer. We create a tailored visual direction and page structure that reflects your business, guides attention and makes the next step obvious.", benefits:["A professional presence built around your brand", "Clear journeys for customers on every screen", "Original layouts instead of recycled templates"], deliverables:["Discovery and page planning", "Custom UI design", "Mobile and desktop layouts", "Enquiry-focused calls to action"] },
  { slug:"website-development", title:"Website Development", category:"Design & Development", short:"Fast, secure websites engineered to perform reliably across modern devices.", intro:"Good design only works when the build is solid. We turn approved ideas into responsive, maintainable websites with clean foundations, quick loading and the integrations your business needs.", benefits:["Reliable performance and clean code", "A foundation that can grow with the business", "Smooth forms, WhatsApp and enquiry flows"], deliverables:["Front-end development", "CMS or custom integrations", "Performance optimisation", "Launch and quality checks"] },
  { slug:"responsive-websites", title:"Responsive Website Design", category:"Design & Development", short:"One consistent experience across mobiles, tablets, laptops and large screens.", intro:"Most customers will meet your business on a phone. We plan responsive behaviour from the beginning so content stays readable, navigation stays simple and important actions remain easy to reach.", benefits:["Mobile-first customer journeys", "Consistent brand presentation", "Better usability across screen sizes"], deliverables:["Responsive layouts", "Touch-friendly navigation", "Cross-device testing", "Image and type optimisation"] },
  { slug:"logo-design", title:"Logo & Visual Identity", category:"Design & Development", short:"A recognisable identity with the practical assets needed to use it consistently.", intro:"We create focused logo and identity systems that suit the business, work at small and large sizes, and give future website and marketing material a consistent visual foundation.", benefits:["A distinctive, usable brand mark", "Consistent colours and typography", "Assets prepared for digital use"], deliverables:["Logo concepts", "Colour and type direction", "Primary file formats", "Simple usage guidance"] },
  { slug:"website-redesign", title:"Website Redesign", category:"Design & Development", short:"A clearer, faster and more current website without losing what already works.", intro:"When an existing website feels dated or difficult to use, we audit its content and journeys, retain valuable material and rebuild the experience around today’s customers and devices.", benefits:["Clearer content hierarchy", "A modern, credible presentation", "Improved speed and mobile usability"], deliverables:["Current-site audit", "Content restructuring", "New responsive design", "Migration and launch support"] },
  { slug:"website-maintenance", title:"Website Maintenance", category:"Design & Development", short:"Ongoing updates, monitoring and fixes that keep your site useful and dependable.", intro:"Websites need regular care. We handle planned content updates, technical checks, backups and small improvements so the public experience stays current and secure.", benefits:["Fewer unexpected issues", "Fresh, accurate content", "A reliable point of support"], deliverables:["Routine updates", "Backup checks", "Performance monitoring", "Priority issue support"] },
  { slug:"corporate-websites", title:"Corporate Website Design", category:"Design & Development", short:"Structured company websites that communicate capability, trust and scale.", intro:"We organise complex company information into a confident digital presence for customers, partners, recruits and stakeholders—without burying the important message under corporate clutter.", benefits:["Clear capability communication", "Stronger trust and credibility", "Flexible structure for multiple audiences"], deliverables:["Information architecture", "Service and company pages", "Proof and enquiry journeys", "CMS-ready build"] },
  { slug:"blog-websites", title:"Blog & Publication Websites", category:"Design & Development", short:"Readable, searchable publishing experiences built for a growing content library.", intro:"From an expert blog to a full publication, we create calm reading experiences and simple content management so your team can publish consistently without technical help.", benefits:["Comfortable long-form reading", "Simple categorisation and discovery", "Easy editorial publishing"], deliverables:["Article templates", "Categories and search", "Author and archive pages", "CMS configuration"] },
  { slug:"seo", title:"Search Engine Optimisation", category:"Internet Marketing", short:"Technical and content improvements that help useful pages earn visibility in search.", intro:"SEO starts with a site people and search engines can understand. We improve structure, page content, metadata and measurement, then build a practical plan around the searches that matter to your business.", benefits:["More relevant organic discovery", "Healthier site structure", "Measurable search performance"], deliverables:["Technical and content audit", "Keyword and page mapping", "On-page optimisation", "Analytics and search console setup"] },
  { slug:"ppc-management", title:"Pay Per Click Management", category:"Internet Marketing", short:"Focused paid campaigns designed around qualified visits, enquiries and measurable spend.", intro:"We plan campaign structure, landing pages and measurement together so paid traffic has a clear destination and every decision can be tied back to useful business outcomes.", benefits:["Faster access to active demand", "Controlled and visible budgets", "Campaign learning you can act on"], deliverables:["Campaign planning", "Ad and keyword structure", "Landing-page recommendations", "Tracking and optimisation"] },
  { slug:"social-media", title:"Social Media Marketing", category:"Internet Marketing", short:"A consistent social presence with content shaped for attention, trust and action.", intro:"We turn business goals into practical content themes, campaigns and creative so your brand can show up regularly without posting for the sake of activity.", benefits:["A recognisable brand voice", "More consistent publishing", "Campaigns connected to business goals"], deliverables:["Channel strategy", "Content calendar", "Post and campaign creative", "Performance review"] },
  { slug:"email-marketing", title:"Email Marketing", category:"Internet Marketing", short:"Useful email journeys that welcome, nurture and bring customers back.", intro:"From a focused newsletter to automated follow-ups, we plan messages around what recipients need next and connect campaigns to clear, measurable actions.", benefits:["Direct access to your audience", "Better lead follow-up", "Repeat visits and customer retention"], deliverables:["Campaign structure", "Email design and copy", "Automation planning", "Reporting setup"] },
  { slug:"custom-web-applications", title:"Custom Web Applications", category:"Application Development", short:"Purpose-built web tools that match the way your team or customers actually work.", intro:"Off-the-shelf tools often force businesses into the wrong process. We map the exact job, design a focused workflow and build a scalable application that can connect with your existing systems.", benefits:["Software shaped to the real workflow", "Less duplicate work and manual error", "Room for future features and integrations"], deliverables:["Workflow discovery", "UX and interface design", "Application development", "Role-based access and handover"] },
  { slug:"content-management-systems", title:"Content Management Systems", category:"Application Development", short:"Simple publishing and content controls tailored to your website and team.", intro:"A useful CMS lets authorised people update the right content without risking the whole website. We configure clear content models, permissions and editing experiences around your needs.", benefits:["Faster in-house updates", "Consistent page structure", "Controlled team access"], deliverables:["Content modelling", "Editor dashboard", "Roles and permissions", "Training and documentation"] },
  { slug:"school-management-systems", title:"School Management Systems", category:"Application Development", short:"Connected tools for student records, fees, communication and daily administration.", intro:"We bring recurring school operations into one clear system, with access appropriate for administrators, staff, students and parents.", benefits:["Less repetitive administration", "Centralised, searchable records", "Clear access for every role"], deliverables:["Student and staff records", "Fee and notice workflows", "Role-based dashboards", "Reports and exports"] },
  { slug:"mobile-applications", title:"Mobile Application Development", category:"Application Development", short:"Focused mobile products designed for the tasks users need on the move.", intro:"We plan mobile apps around a precise use case, simple navigation and maintainable technology—whether the audience is customers, staff or a specialised community.", benefits:["Convenient access on the move", "A focused, intuitive experience", "Integration with your wider platform"], deliverables:["Product planning", "Mobile UX/UI", "App development", "Testing and release support"] },
  { slug:"ecommerce-websites", title:"E-commerce Websites", category:"Application Development", short:"Product discovery and checkout experiences built to make buying feel straightforward.", intro:"We create online stores that organise products clearly, build confidence and prepare the business for secure payments, fulfilment and ongoing catalogue management.", benefits:["A simpler path from product to purchase", "Easy catalogue management", "Payment-ready, scalable foundations"], deliverables:["Storefront design", "Catalogue and inventory setup", "Cart and checkout journeys", "Payment integration planning"] },
  { slug:"motion-presentations", title:"Motion Presentations", category:"Creative & Multimedia", short:"Modern motion-led presentations that explain ideas with clarity and energy.", intro:"We replace outdated Flash-style presentations with lightweight motion, video and interactive storytelling that works across current browsers and devices.", benefits:["Complex ideas made easier to follow", "Stronger recall and engagement", "Modern cross-device delivery"], deliverables:["Storyboard and visual direction", "Motion design", "Audio or video integration", "Web-ready delivery"] },
  { slug:"interactive-web-experiences", title:"Interactive Web Experiences", category:"Creative & Multimedia", short:"Purposeful web interactions that add context, delight and product understanding.", intro:"Interaction should support the message. We create responsive demonstrations, storytelling sections and campaign experiences that feel memorable without slowing the website down.", benefits:["More engaging product stories", "Clearer demonstrations", "A distinctive digital impression"], deliverables:["Interaction concepts", "Prototype and motion system", "Responsive implementation", "Performance testing"] },
  { slug:"digital-advertising-creative", title:"Digital Advertising Creative", category:"Creative & Multimedia", short:"Flexible campaign assets designed to stay recognisable across formats and channels.", intro:"We build coherent visual systems for display, social and landing-page campaigns so every asset feels connected and can be adapted efficiently.", benefits:["Consistent campaign recognition", "Creative sized for each channel", "A reusable system for future variants"], deliverables:["Campaign direction", "Static and motion assets", "Format adaptations", "Landing-page creative"] },
  { slug:"domain-registration", title:"Domain Registration", category:"Domain & Hosting", short:"Help choosing, registering and organising the right domain under your ownership.", intro:"Your domain is a core business asset. We help select a suitable name, configure it correctly and keep ownership and renewal details clear from the start.", benefits:["Clear ownership and renewal control", "Correct DNS configuration", "A dependable base for website and email"], deliverables:["Domain selection support", "Registration guidance", "DNS setup", "Renewal documentation"] },
  { slug:"web-hosting", title:"Web Hosting", category:"Domain & Hosting", short:"Reliable hosting selected and configured for the website you actually run.", intro:"Hosting should match the website’s traffic, technology and support needs. We recommend a practical setup, manage launch and keep recurring costs transparent.", benefits:["Reliable site availability", "A setup sized to your needs", "Straightforward migration and support"], deliverables:["Hosting consultation", "Server and email setup", "Website migration", "Backup and monitoring configuration"] },
  { slug:"ssl-certificates", title:"SSL Certificates", category:"Domain & Hosting", short:"Secure HTTPS configuration that protects visitors and strengthens trust.", intro:"We issue or configure the appropriate SSL certificate, update the website to load securely and verify that visitors are not met with browser warnings.", benefits:["Encrypted visitor connections", "More customer confidence", "Correct secure-site configuration"], deliverables:["Certificate setup", "HTTPS migration", "Redirect configuration", "Renewal and security checks"] },
];

export const serviceBySlug = Object.fromEntries(services.map((service) => [service.slug, service])) as Record<string, Service>;
