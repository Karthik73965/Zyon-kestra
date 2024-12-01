import { UAParser } from "ua-parser-js";
import geoip from "geoip-lite";

export const extractAnalytics = (headers: any) => {
  const parser = new UAParser(headers["user-agent"]);
  const result = parser.getResult();

  const ip = headers["x-forwarded-for"] || headers["remote-addr"] || "0.0.0.0";
  const geo = geoip.lookup(ip) || {};

  return {
    location: {
      //@ts-ignore
      country: geo.country || "Unknown",
      //@ts-ignore
      city: geo.city || "Unknown",
      //@ts-ignore

      region: geo.region || "Unknown",
    },
    analytics: {
      os: result.os.name || "Unknown",
      browser: result.browser.name || "Unknown",
      device: result.device.type || "Unknown",
    },
  };
};
