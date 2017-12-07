
const DEFAULTS = {
  "debug": process.env.NODE_ENV !== "production",
  "app": {
    "host": "localhost",
    "port": 8000
  },
  "secret": null,
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
