"use client";

import { useEffect } from "react";
import Script from "next/script";
import { captureUtm } from "@/lib/track";

const GA = process.env.NEXT_PUBLIC_GA_ID;
const PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const CLARITY = process.env.NEXT_PUBLIC_CLARITY_ID;
const ADS = process.env.NEXT_PUBLIC_GADS_ID;

/** Loads GA4, Meta Pixel and Microsoft Clarity only when their IDs are set in the environment. */
export function Analytics() {
  useEffect(() => captureUtm(), []);
  return (
    <>
      {(GA || ADS) && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA || ADS}`} strategy="afterInteractive" />
          <Script id="gtag" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());${GA ? `gtag('config','${GA}');` : ""}${ADS ? `gtag('config','${ADS}');` : ""}`}</Script>
        </>
      )}
      {PIXEL && (
        <Script id="meta-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL}');fbq('track','PageView');`}</Script>
      )}
      {CLARITY && (
        <Script id="clarity" strategy="afterInteractive">{`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY}");`}</Script>
      )}
    </>
  );
}
