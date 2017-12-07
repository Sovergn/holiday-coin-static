import * as React from "react";
import { renderToString } from 'react-dom/server';
import { Website } from "../../app/pay";
import { SourceType } from "../../types/enums";
import { withConnection, Donation, ValidationError } from "../../entity";
import * as routerUtils from "../utils/routes";

interface IDonateRequest {
  body: {
    type: SourceType;
    email: string;
    id: string;
    firstName?: string;
    lastName?: string;
    country?: string;
    state?: string;
  };
}

export default function loadRoutes (app: any): any {
  var router = routerUtils.loadRoutes(__dirname, "**/*.ts", app, ["index.ts"]);

  router.get("/robots.txt", (req: any, res: any) => {
    res.send("User-agent: *\nDisallow: /*?splash=*\n");
  });

  router.get("*", (req: any, res: any) => {
    res.render("index", {
      title: "Jesus Coin",
      meta: {
        description: ""
      },
      body: renderToString(<Website />)
    });
  });

  router.post("/donate", async (req: IDonateRequest, res: any): Promise<void> => {
    let { type, email, id, firstName, lastName, country, state } = req.body;

    try {
      let donation = new Donation();
      donation.type = type;
      donation.id = id;
      donation.email = email;
      donation.firstName = firstName;
      donation.lastName = lastName;
      donation.country = country;
      donation.state = state;

      await withConnection(() => donation.save());

      res.json({
        error: false,
        data: {
          jesusTokenAddress: donation.address
        }
      });
    } catch(err) {
      if (err instanceof ValidationError) {
        res.status(400);
        res.json({
          error: true,
          data: err
        });
      } else if (err.message.indexOf("SQLITE_CONSTRAINT") !== -1) {
        res.status(400);
        res.json({
          error: true,
          message: err.message
        });
      } else {
        res.status(500);
        res.json({
          error: true,
          message: `Server error: "${err.message}"`
        });
      }
    }
  });

  return router;
}
