import { Store } from "pullstate";
import { Authorities } from "./types/attributes";

interface AttributesFiltersStore {
	possibleAuthorities: Authorities;
	authority: string;
	filters: {
		name: string;
		order: string;
		rule: string;
	}
	sort: string,
	limit: number;
	offset: number;
}

export const AttributesFiltersStore = new Store<AttributesFiltersStore>({
	possibleAuthorities: [],
	authority: '',
	filters: {
		name: '',
		order: '',
		rule: ''
	},
	sort: '-name',
	limit: 10,
	offset: 0,
});
