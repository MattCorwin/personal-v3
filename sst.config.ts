import type { SSTConfig } from "sst";
import { RemixSite } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "personal-v3",
      region: "us-east-2",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new RemixSite(stack, "site", {
        customDomain:
      app.stage === "prod"
        ? {
            domainName: "mattcorwin.com",
            domainAlias: "www.mattcorwin.com",
          }
        : undefined,
      });
      stack.addOutputs({
        url: site.customDomainUrl || site.url || "http://localhost:3000",
      });
    });
  },
} satisfies SSTConfig;
