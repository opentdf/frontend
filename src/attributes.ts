/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/attributes": {
    get: operations["read_attributes_attributes_get"];
  };
  "/definitions/attributes": {
    get: operations["read_attributes_definitions_definitions_attributes_get"];
    put: operations["update_attribute_definition_definitions_attributes_put"];
    post: operations["create_attributes_definitions_definitions_attributes_post"];
    delete: operations["delete_attributes_definitions_definitions_attributes_delete"];
  };
  "/authorities": {
    get: operations["read_authorities_authorities_get"];
    post: operations["create_authorities_authorities_post"];
  };
}

export interface components {
  schemas: {
    /**
     * AttributeDefinition
     * @example [object Object]
     */
    AttributeDefinition: {
      /**
       * Authority
       * Format: uri
       */
      authority: string;
      /** Name */
      name: string;
      /** Order */
      order: string[];
      rule: components["schemas"]["RuleEnum"];
      /** State */
      state?: string;
      group_by?: {
        authority: string,
        name: string,
        value: string
      }
    };
    /** AuthorityDefinition */
    AuthorityDefinition: {
      /**
       * Authority
       * Format: uri
       */
      authority: string;
    };
    /** HTTPValidationError */
    HTTPValidationError: {
      /** Detail */
      detail?: components["schemas"]["ValidationError"][];
    };
    /**
     * RuleEnum
     * @description An enumeration.
     * @enum {string}
     */
    RuleEnum: "hierarchy" | "anyOf" | "allOf";
    /** ValidationError */
    ValidationError: {
      /** Location */
      loc: string[];
      /** Message */
      msg: string;
      /** Error Type */
      type: string;
    };
  };
}

export interface operations {
  read_attributes_attributes_get: {
    parameters: {
      query: {
        authority?: string;
        name?: string;
        rule?: string;
        order?: string;
        sort?: string;
        offset?: number;
        limit?: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": string[];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  read_attributes_definitions_definitions_attributes_get: {
    parameters: {
      query: {
        authority?: string;
        name?: string;
        order?: string;
        sort?: string;
        offset?: number;
        limit?: number;
      };
    };
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["AttributeDefinition"][];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  update_attribute_definition_definitions_attributes_put: {
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["AttributeDefinition"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["AttributeDefinition"];
      };
    };
  };
  create_attributes_definitions_definitions_attributes_post: {
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": components["schemas"]["AttributeDefinition"];
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["AttributeDefinition"];
      };
    };
  };
  delete_attributes_definitions_definitions_attributes_delete: {
    responses: {
      /** No Content */
      202: {
        content: {
          "application/json": unknown;
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["AttributeDefinition"];
      };
    };
  };
  read_authorities_authorities_get: {
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": unknown;
        };
      };
    };
  };
  create_authorities_authorities_post: {
    responses: {
      /** Successful Response */
      200: {
        content: {
          "application/json": unknown;
        };
      };
      /** Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["AuthorityDefinition"];
      };
    };
  };
}

export interface external {}
