const OK_CODE = 200;
const CREATED_CODE = 201;
const BAD_REQUEST_ERROR_CODE = 400;
const UNAUTHORIZE_ERROR_CODE = 401;
const NOT_FOUND_ERROR_CODE = 404;
const INTERNAL_SERVER_ERROR_CODE = 500;

const REG_EXP = /https?:\/\/(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/;

module.exports = {
  INTERNAL_SERVER_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  BAD_REQUEST_ERROR_CODE,
  CREATED_CODE,
  REG_EXP,
  UNAUTHORIZE_ERROR_CODE,
  OK_CODE,
};
