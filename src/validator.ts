import Ajv, { ErrorObject as AjvErrorObject } from 'ajv';
import { ConfigOption, ErrorObject, JsonObject, ValidatorResponse } from './types/validator.types';
import { evalErrorProperty } from './static/constants';
import path from 'path';
import { readFileSync } from 'fs';

const ajv = new Ajv({ allErrors: true });

const getProcessedError = (error: AjvErrorObject): ErrorObject | null  => {
  if(error.keyword.match(/if|anyOf|allOf|oneOf/)) {
    return null;
  }
  const propertyName = evalErrorProperty[error.keyword];
  let fieldName = propertyName ? error.params[propertyName] : '';
  let instancePath = error.instancePath;
  if(!fieldName) {
    fieldName = error.instancePath?.substring(error.instancePath.lastIndexOf('/') + 1);
    instancePath = error.instancePath?.substring(0, error.instancePath.lastIndexOf('/'));
  }

  const result: ErrorObject = {
    message: error.message || 'unknown error message',
  }
  if(fieldName) {
    result.property = fieldName;
  }
  if(instancePath) {
    result.path = instancePath;
  }
  return result;
}

const formatError = (errorList: AjvErrorObject[], ajvFormatting: boolean): ErrorObject[] | AjvErrorObject[] => {
  if(ajvFormatting) {
    return errorList;
  }
  const result: ErrorObject[] = [];
  errorList.forEach((error) => {
    const errResp = getProcessedError(error);
    if(errResp) {
      result.push(errResp);
    }
  });
  return result;
}

const getSchema = (fileName: string, schemaPath?: string): JsonObject => {
  if(!schemaPath) {
    throw new Error('Validator is not initialized with schemaPath');
  }
  const dirName = path.resolve(path.dirname(""));
  const absolutePath = path.join(dirName, `${schemaPath}/${fileName}`);
  const jsonSchema = JSON.parse(readFileSync(absolutePath, 'utf-8'));
  return jsonSchema;
}

export class Validator {
  static #instance: Validator;
  #options!: ConfigOption;

  initialize(options: ConfigOption) {
    this.#options = options;
  }

  static getInstance() {
    if(!this.#instance) {
      this.#instance = new Validator();
    }
    return this.#instance;
  }

  validate(reqBody: JsonObject, fileName: string, ajvFormatting?: boolean): ValidatorResponse;
  validate(reqBody: JsonObject, schema: JsonObject, ajvFormatting?: boolean): ValidatorResponse;

  validate(reqBody: JsonObject, schemaOrFileName: string | JsonObject, ajvFormatting: boolean = false): ValidatorResponse {
    const response: ValidatorResponse = {
      isValid: true
    };
    try {
      let schema: JsonObject;
      if (typeof schemaOrFileName === "string") {
        schema = getSchema(schemaOrFileName, this.#options?.schemaPath);
      } else {
        schema = schemaOrFileName;
      }

      const ajvValidate = ajv.compile(schema);
      const isValid = ajvValidate(reqBody);
      if (!isValid) {
        response.isValid = false;
        if(ajvValidate.errors) {
          response.errors = formatError(ajvValidate.errors, ajvFormatting);
        }
      }
    } catch (err: any) {
      throw new Error(err.message);
    }
    return response;
  }
}
