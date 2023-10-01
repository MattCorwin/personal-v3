import type { SSTConfig } from "sst";
import { RemixSite, Api, Function } from "sst/constructs";

const SSM_PARAM_NAME = "inferenceKeysv1";

export default {
  config(_input) {
    return {
      name: "personal-v3",
      region: "us-east-2",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const dockerFn = new Function(stack, "pythonDockerFunction", {
        timeout: 30,
            environment: { ssmParamName: SSM_PARAM_NAME },
            permissions: ["ssm"],
            runtime: "container",
            handler: "functions",
      })
      const api = new Api(stack, "Api", {
        routes: {
          "POST /question": dockerFn,
        },
      });
      const site = new RemixSite(stack, "site", {
        bind: [api],
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
        apiUrl: api.url
      });
    });
  },
} satisfies SSTConfig;
