# JSON Validator

This is utility package that helps in validating the json schema. It uses ajv package internally to validate


## Features

- Validate through json schema
- Validate through json filename


## Installation

```bash
  npm i @sb/json-validator
  OR
  yarn @sb/json-validator
```
    
## Usage/Examples

### Usage

```javascript
// validating through schema directly
import { validator } from '@sb/json-validator';

const response = validator.validate(payload, jsonSchema);
if(!response.isValid) {
    console.log(response.errors);
}
```

```javascript
// validating through schema filename
import { validator } from '@sb/json-validator';

validator.initialize({
    schemaPath: 'relative/path/to/folder'
})

const response = validator.validate(payload, 'remaining_path/filename.json');
if(!response.isValid) {
    console.log(response.errors);
}
```

```javascript
// if need to get ajv original error then pass third parameter value as true

const response = validator.validate(first_param, second_param, true);
if(!response.isValid) {
    console.log(response.errors); // will print original ajv style error if validation fails
}
```

### Example

```javascript
import { validator } from '@sb/json-validator';

const payload = {
    foo: 123,
    bar: "value"
};
const jsonSchema = {
  "type": "object",
  "properties": {
    "foo": {
      "type": "integer"
    },
    "bar": {
      "type": "string"
    }
  },
  "required": [
    "foo"
  ],
  "additionalProperties": false
}

const response = validator.validate(payload, jsonSchema);
if(!response.isValid) {
    console.log(response.errors);
}
```