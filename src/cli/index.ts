import * as program from "commander";
import config from "../config";
import { withConnection, Donation } from "../entity";
import { send } from "../email";
import { DonationStatus, SourceType } from "../types/enums";
const stripe = require("stripe")(config.get("stripe:secret"));

async function handleDonationProcessing(): Promise<void> {
  let donation: Donation = await withConnection(() => Donation.findOne({
    where: {
      type: SourceType.CC,
      status: DonationStatus.PENDING
    }
  }));

  if (!donation) return;

  donation.status = DonationStatus.PROCESSING;
  await withConnection(() => donation.save());

  try {
    console.log("Processing donation with address", donation.address);
    // console.log(stripe)
    let customer = await stripe.customers.create({
      email: donation.email,
      source: donation.id
    });
    console.log("Charging customer with id", customer.id);
    let charge = stripe.charges.create({
      amount: donation.amount,
      description: "Donation",
      currency: "usd",
      customer: customer.id,
      metadata: {
        donation_id: donation.id,
        charity: donation.charity
      }
    });
    console.log("Created charge with id", charge);
  } catch(err) {
    console.error(err);

    donation.status = DonationStatus.PENDING;
    await withConnection(() => donation.save());

    throw err;
  }

  send("cc_processed", donation, [{ address: donation.email }]);
}

function help(message: string) {
  console.log(message);
}

program
.command('cc <subaction>')
.action(function(subaction, command) {
  switch(subaction) {
    case "process":
    handleDonationProcessing();
    break;
  }
});

program.version('0.1.0').parse(process.argv);
