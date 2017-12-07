import * as ejs from "ejs";
import * as SparkPost from "sparkpost";
import config from "../config";

export async function send(template: string, context: any, recipients: { address: string }[]): Promise<boolean> {
  let { key, from, ...options } = config.get("sparkpost");
  let client = new SparkPost(key, options);
  let transmissionOptions = {
    "sandbox": false
  };

  if (config.get("debug")) {
    transmissionOptions.sandbox = true;
  }

  try {
    let subjectTxt: string = await new Promise<string>((resolve, reject) => {
      ejs.renderFile(`${__dirname}/views/${template}_subject.txt`, context, (err, str) => {
        if (err) return reject(err);
        return resolve(str);
      });
    });
    let bodyHtml: string = await new Promise<string>((resolve, reject) => {
      ejs.renderFile(`${__dirname}/views/${template}_body.html`, context, (err, str) => {
        if (err) return reject(err);
        return resolve(str);
      });
    });
    let bodyTxt: string = await new Promise<string>((resolve, reject) => {
      ejs.renderFile(`${__dirname}/views/${template}_body.txt`, context, (err, str) => {
        if (err) return reject(err);
        return resolve(str);
      });
    });
    let data = await client.transmissions.send({
      options: transmissionOptions,
      content: {
        from: from,
        subject: subjectTxt,
        html: bodyHtml,
        text: bodyTxt
      },
      recipients: recipients
    });
    console.log(data);
    return true;
  } catch(err) {
    console.error(err);
    return false;
  }
}