
const DEFAULTS = {
  "debug": process.env.NODE_ENV !== "production",
  "app": {
    "host": "localhost",
    "port": 8000
  },
  "secret": null,
  "mailchimp": {
    "key": null,
    "from": "root@localhost",
    "version": "2.0"
  },
  "sparkpost": {
    "endpoint": "https://api.sparkpost.com",
    "from": "root@localhost",
    "key": null
  },
  "stripe": {
    "secret": null,
    "key": null
  }
};

export default DEFAULTS;
