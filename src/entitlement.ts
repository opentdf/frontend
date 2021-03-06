/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/entitlements": {
    get: operations["read_entitlements_entitlements_get"];
  };
  "/entitlements/{entityId}": {
    post: operations["add_entitlements_to_entity_entitlements__entityId__post"];
    delete: operations["remove_entitlement_from_entity_entitlements__entityId__delete"];
  };
}

export interface components {
  schemas: {
    /**
     * Entitlements
     * @example [object Object]
     */
    Entitlements: { [key: string]: string[] };
    /** HTTPValidationError */
    HTTPValidationError: {
      /** Detail */
      detail?: components["schemas"]["ValidationError"][];
    };
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
  read_entitlements_entitlements_get: {
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
          "application/json": components["schemas"]["Entitlements"][];
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
  add_entitlements_to_entity_entitlements__entityId__post: {
    parameters: {
      path: {
        entityId: string;
      };
    };
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
        "application/json": string[];
      };
    };
  };
  remove_entitlement_from_entity_entitlements__entityId__delete: {
    parameters: {
      path: {
        entityId: string;
      };
    };
    responses: {
      /** Successful Response */
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
        "application/json": string[];
      };
    };
  };
}

export interface external {}
