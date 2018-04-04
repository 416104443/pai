// Copyright (c) Microsoft Corporation
// All rights reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
// to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
// BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// module dependencies
const Vc = require('../models/vc');
const logger = require('../config/logger');

/**
 * Load job and append to req.
 */
/**
 * Load job and append to req.
 */
const load = (req, res, next, vcName) => {
  new Vc(vcName, (vcInfo, error) => {
    if (error) {
      if (error.message === 'VcNotFound') {
        logger.warn('load vc %s error, could not find vc', vcName);
        return res.status(404).json({
          error: 'VcNotFound',
          message: `could not find vc ${vcName}`,
        });
      } else {
        logger.warn('internal server error');
        return res.status(500).json({
          error: 'InternalServerError',
          message: 'internal server error',
        });
      }
    }
    req.vc = vcInfo;
    return next();
  });
};

/**
 * Get vc status.
 */
const get = (req, res) => {
  return res.json(req.vc);
};

/**
 * Get all vc info.
 */
const list = (req, res) => {
  Vc.prototype.getVcList((vcList, err) => {
    if (err) {
      logger.warn('get vc list error\n%s', err.stack);
      return res.status(500).json({
        error: 'GetVcListError',
        message: 'get vc list error',
      });
    } else if (vcList === undefined) {
      logger.warn('list vcs error, no vc found');
      return res.status(500).json({
        error: 'VcListNotFound',
        message: 'could not find vc list',
      });
    } else {
      return res.status(200).json(vcList);
    }
  });
};

// module exports
module.exports = {
  load,
  get,
  list,
};