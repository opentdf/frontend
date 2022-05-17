import { Store } from "pullstate";
import { Authorities } from "./types/attributes";

export interface AttributesFilters {
  possibleAuthorities: Authorities;
  authority: string;
  query: {
    name: string;
    order: string;
    limit: number;
    offset: number;
    sort: string;
    rule: string;
  }
  pageNumber: number;
}

export const AttributesFiltersStore = new Store<AttributesFilters>({
  possibleAuthorities: [],
  authority: '',
  query: {
    name: '',
    order: '',
    limit: 10,
    offset: 1,
    sort: '',
    rule: ''
  },
  pageNumber: 1
});
