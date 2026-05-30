import { Locale, routing } from "@/i18n/routing";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { notFound } from "next/navigation";
import { PropsWithChildren } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Box } from "@chakra-ui/react";
import Script from "next/script";

export const dynamic = "force-dynamic";

export default async function LocaleLayout({
  children,
  params: { locale },
}: PropsWithChildren<{ params: { locale: Locale } }>) {
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Script
        async
        src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
        crossOrigin="anonymous"
        strategy="beforeInteractive"
      />
      <Script
        id="tiktok-pixel-javascript"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

  ttq.load('D884TSJC77UDONQHT2A0');
  ttq.page();
}(window, document, 'ttq');
          `,
        }}
      />
      <Header locale={locale} />
      <Box as="main">{children}</Box>
      <Footer locale={locale} />
    </NextIntlClientProvider>
  );
}
