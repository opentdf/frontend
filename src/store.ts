import { Store } from "pullstate";
import { Authorities, AuthorityDefinition } from "./types/attributes";

interface AttributesFiltersStore {
  possibleAuthorities: Authorities;
  authority: AuthorityDefinition;
}

export const AttributesFiltersStore = new Store<AttributesFiltersStore>({
  possibleAuthorities: [],
  authority: {
    authority: '',
  },
});
