import { Authorities } from "./types/attributes";
import {Store} from "pullstate";

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
  collapseValue: string;
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
  pageNumber: 1,
  collapseValue: '0'
});
