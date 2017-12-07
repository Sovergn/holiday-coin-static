
import * as _ from "lodash";
import * as glob from "glob";
import * as express from "express";

export function loadRoutes (dirname: string, pattern: string, app: any, without: string[]) {
  var router = express.Router();
  var filenames = glob.sync(pattern, {
    cwd: dirname,
    ignore: without
  });
  _.each(filenames, function (filename) {
    let m = require([dirname, filename].join("/"));
    if (m.default) {
      return m.default(router, app);
    } else {
      return m(router, app);
    }
  });

  return router;
}

export function validateQuery (config: object) {
  return function (req: any, res: any, next: Function) {
    let errors : string[] = [];
    _.each(config, (config, param) => {
      config = config || {};
      let validatefn = config.fn || ((v: any) => !_.isUndefined(v));
      let message = config.message || `${param} is invalid`;
      if (!validatefn(req.query[param])) {
        errors.push(message);
      }
    });
    if (errors.length) {
      res.status(400);
      res.json({
        errors: errors
      });
    } else {
      next();
    }
  };
}
