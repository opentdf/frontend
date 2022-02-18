import {Store} from "pullstate";
import {Authorities} from "./types/attributes";

export const AttributesFiltersStore = new Store<{
	possibleAuthorities: Authorities;
	authority: string;
	query: {
		name: string;
		order: string;
		limit: number;
		offset: number;
		sort: string;
	}
	pageNumber: number;
}>({
	possibleAuthorities: [],
	authority: '',
	query: {
		name: '',
		order: '',
		limit: 10,
		offset: 1,
		sort: '',
	},
	pageNumber: 1
});
