import type { Metadata } from "next";
import { getServices } from "@/lib/content-store";
import { BillversFooter,BillversHeader } from "../site-chrome";
import CheckoutForm from "./checkout-form";

export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Choose a Service Package | BillversTech",description:"Build your BillversTech service package and prepare for secure payment."};
export default async function CheckoutPage({searchParams}:PageProps<"/checkout">){const services=await getServices(),query=await searchParams;const initialService=typeof query.service==="string"?query.service:undefined,initialPackage=typeof query.package==="string"?query.package:undefined;return <main className="bh-site"><BillversHeader services={services}/><section className="bh-page-hero bh-page-hero-short"><span className="bh-kicker">ORDER / BUILD YOUR PACKAGE</span><h1>Choose what you need. See the price <em>clearly.</em></h1><p>Select a service—or the exact package within it—then add your details and review the total before secure payment.</p></section><section className="bh-section bh-order-page"><div className="order-steps"><span><b>01</b> Choose service &amp; package</span><span><b>02</b> Add your details</span><span><b>03</b> Secure payment</span></div><CheckoutForm services={services} initialService={initialService} initialPackage={initialPackage}/></section><BillversFooter/></main>}
