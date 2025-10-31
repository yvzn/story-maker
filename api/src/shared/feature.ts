export interface FeatureSet {
	options: FeatureSetOption[];
}

export interface FeatureSetOption {
	id: FeatureSetOptionId;
	name: string;
	description: string;
	valuesHighlighted: string;
	visualPrompts: string;
}

export type FeatureSetOptionId = number;
