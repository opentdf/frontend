import { Store } from "pullstate";
import { Authorities } from "./types/attributes";

interface AttributesFiltersStore {
	possibleAuthorities: Authorities;
	authority: string;
}

export const AttributesFiltersStore = new Store<AttributesFiltersStore>({
	possibleAuthorities: [],
	authority: '',
});
