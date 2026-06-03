declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
			components: import('astro').MDXInstance<{}>['components'];
		}>;
	}
}

declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"activations": {
"activation-functions-en.mdx": {
	id: "activation-functions-en.mdx";
  slug: "activation-functions-en";
  body: string;
  collection: "activations";
  data: InferEntrySchema<"activations">
} & { render(): Render[".mdx"] };
"activation-functions.mdx": {
	id: "activation-functions.mdx";
  slug: "activation-functions";
  body: string;
  collection: "activations";
  data: InferEntrySchema<"activations">
} & { render(): Render[".mdx"] };
};
"architectures": {
"architecture-anatomy-en.mdx": {
	id: "architecture-anatomy-en.mdx";
  slug: "architecture-anatomy-en";
  body: string;
  collection: "architectures";
  data: InferEntrySchema<"architectures">
} & { render(): Render[".mdx"] };
"architecture-anatomy.mdx": {
	id: "architecture-anatomy.mdx";
  slug: "architecture-anatomy";
  body: string;
  collection: "architectures";
  data: InferEntrySchema<"architectures">
} & { render(): Render[".mdx"] };
"cnn-en.mdx": {
	id: "cnn-en.mdx";
  slug: "cnn-en";
  body: string;
  collection: "architectures";
  data: InferEntrySchema<"architectures">
} & { render(): Render[".mdx"] };
"cnn.mdx": {
	id: "cnn.mdx";
  slug: "cnn";
  body: string;
  collection: "architectures";
  data: InferEntrySchema<"architectures">
} & { render(): Render[".mdx"] };
"graph-neural-networks-en.mdx": {
	id: "graph-neural-networks-en.mdx";
  slug: "graph-neural-networks-en";
  body: string;
  collection: "architectures";
  data: InferEntrySchema<"architectures">
} & { render(): Render[".mdx"] };
"graph-neural-networks.mdx": {
	id: "graph-neural-networks.mdx";
  slug: "graph-neural-networks";
  body: string;
  collection: "architectures";
  data: InferEntrySchema<"architectures">
} & { render(): Render[".mdx"] };
"modern-cnns-en.mdx": {
	id: "modern-cnns-en.mdx";
  slug: "modern-cnns-en";
  body: string;
  collection: "architectures";
  data: InferEntrySchema<"architectures">
} & { render(): Render[".mdx"] };
"modern-cnns.mdx": {
	id: "modern-cnns.mdx";
  slug: "modern-cnns";
  body: string;
  collection: "architectures";
  data: InferEntrySchema<"architectures">
} & { render(): Render[".mdx"] };
"normalization-layers-en.mdx": {
	id: "normalization-layers-en.mdx";
  slug: "normalization-layers-en";
  body: string;
  collection: "architectures";
  data: InferEntrySchema<"architectures">
} & { render(): Render[".mdx"] };
"normalization-layers.mdx": {
	id: "normalization-layers.mdx";
  slug: "normalization-layers";
  body: string;
  collection: "architectures";
  data: InferEntrySchema<"architectures">
} & { render(): Render[".mdx"] };
"representation-learning-en.mdx": {
	id: "representation-learning-en.mdx";
  slug: "representation-learning-en";
  body: string;
  collection: "architectures";
  data: InferEntrySchema<"architectures">
} & { render(): Render[".mdx"] };
"representation-learning.mdx": {
	id: "representation-learning.mdx";
  slug: "representation-learning";
  body: string;
  collection: "architectures";
  data: InferEntrySchema<"architectures">
} & { render(): Render[".mdx"] };
"resnet-en.mdx": {
	id: "resnet-en.mdx";
  slug: "resnet-en";
  body: string;
  collection: "architectures";
  data: InferEntrySchema<"architectures">
} & { render(): Render[".mdx"] };
"resnet.mdx": {
	id: "resnet.mdx";
  slug: "resnet";
  body: string;
  collection: "architectures";
  data: InferEntrySchema<"architectures">
} & { render(): Render[".mdx"] };
"sequence-models-en.mdx": {
	id: "sequence-models-en.mdx";
  slug: "sequence-models-en";
  body: string;
  collection: "architectures";
  data: InferEntrySchema<"architectures">
} & { render(): Render[".mdx"] };
"sequence-models.mdx": {
	id: "sequence-models.mdx";
  slug: "sequence-models";
  body: string;
  collection: "architectures";
  data: InferEntrySchema<"architectures">
} & { render(): Render[".mdx"] };
"state-space-models-en.mdx": {
	id: "state-space-models-en.mdx";
  slug: "state-space-models-en";
  body: string;
  collection: "architectures";
  data: InferEntrySchema<"architectures">
} & { render(): Render[".mdx"] };
"state-space-models.mdx": {
	id: "state-space-models.mdx";
  slug: "state-space-models";
  body: string;
  collection: "architectures";
  data: InferEntrySchema<"architectures">
} & { render(): Render[".mdx"] };
"transformer-en.mdx": {
	id: "transformer-en.mdx";
  slug: "transformer-en";
  body: string;
  collection: "architectures";
  data: InferEntrySchema<"architectures">
} & { render(): Render[".mdx"] };
"transformer-variants-en.mdx": {
	id: "transformer-variants-en.mdx";
  slug: "transformer-variants-en";
  body: string;
  collection: "architectures";
  data: InferEntrySchema<"architectures">
} & { render(): Render[".mdx"] };
"transformer-variants.mdx": {
	id: "transformer-variants.mdx";
  slug: "transformer-variants";
  body: string;
  collection: "architectures";
  data: InferEntrySchema<"architectures">
} & { render(): Render[".mdx"] };
"transformer.mdx": {
	id: "transformer.mdx";
  slug: "transformer";
  body: string;
  collection: "architectures";
  data: InferEntrySchema<"architectures">
} & { render(): Render[".mdx"] };
};
"foundations": Record<string, {
  id: string;
  slug: string;
  body: string;
  collection: "foundations";
  data: InferEntrySchema<"foundations">;
  render(): Render[".md"];
}>;
"optimization": {
"loss-landscape-en.mdx": {
	id: "loss-landscape-en.mdx";
  slug: "loss-landscape-en";
  body: string;
  collection: "optimization";
  data: InferEntrySchema<"optimization">
} & { render(): Render[".mdx"] };
"loss-landscape.mdx": {
	id: "loss-landscape.mdx";
  slug: "loss-landscape";
  body: string;
  collection: "optimization";
  data: InferEntrySchema<"optimization">
} & { render(): Render[".mdx"] };
};
"training": {
"adam-en.mdx": {
	id: "adam-en.mdx";
  slug: "adam-en";
  body: string;
  collection: "training";
  data: InferEntrySchema<"training">
} & { render(): Render[".mdx"] };
"adam.mdx": {
	id: "adam.mdx";
  slug: "adam";
  body: string;
  collection: "training";
  data: InferEntrySchema<"training">
} & { render(): Render[".mdx"] };
"lr-schedules-en.mdx": {
	id: "lr-schedules-en.mdx";
  slug: "lr-schedules-en";
  body: string;
  collection: "training";
  data: InferEntrySchema<"training">
} & { render(): Render[".mdx"] };
"lr-schedules.mdx": {
	id: "lr-schedules.mdx";
  slug: "lr-schedules";
  body: string;
  collection: "training";
  data: InferEntrySchema<"training">
} & { render(): Render[".mdx"] };
"modern-optimizers-en.mdx": {
	id: "modern-optimizers-en.mdx";
  slug: "modern-optimizers-en";
  body: string;
  collection: "training";
  data: InferEntrySchema<"training">
} & { render(): Render[".mdx"] };
"modern-optimizers.mdx": {
	id: "modern-optimizers.mdx";
  slug: "modern-optimizers";
  body: string;
  collection: "training";
  data: InferEntrySchema<"training">
} & { render(): Render[".mdx"] };
"momentum-en.mdx": {
	id: "momentum-en.mdx";
  slug: "momentum-en";
  body: string;
  collection: "training";
  data: InferEntrySchema<"training">
} & { render(): Render[".mdx"] };
"momentum.mdx": {
	id: "momentum.mdx";
  slug: "momentum";
  body: string;
  collection: "training";
  data: InferEntrySchema<"training">
} & { render(): Render[".mdx"] };
"optimizers-en.mdx": {
	id: "optimizers-en.mdx";
  slug: "optimizers-en";
  body: string;
  collection: "training";
  data: InferEntrySchema<"training">
} & { render(): Render[".mdx"] };
"optimizers.mdx": {
	id: "optimizers.mdx";
  slug: "optimizers";
  body: string;
  collection: "training";
  data: InferEntrySchema<"training">
} & { render(): Render[".mdx"] };
"sgd-deep-dive-en.mdx": {
	id: "sgd-deep-dive-en.mdx";
  slug: "sgd-deep-dive-en";
  body: string;
  collection: "training";
  data: InferEntrySchema<"training">
} & { render(): Render[".mdx"] };
"sgd-deep-dive.mdx": {
	id: "sgd-deep-dive.mdx";
  slug: "sgd-deep-dive";
  body: string;
  collection: "training";
  data: InferEntrySchema<"training">
} & { render(): Render[".mdx"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../../src/content/config.js");
}
