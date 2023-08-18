import { ErrorObject as AjvErrorObject } from 'ajv';

export type ConfigOption = {
  schemaPath: string;
};

export type JsonObject = {
  [key: string]: any
}

export type ValidatorResponse = {
  isValid: boolean;
  errors?: ErrorObject[] | AjvErrorObject[];
};

export type ErrorObject = {
  path?: string;
  property?: string;
  message: string;
};
