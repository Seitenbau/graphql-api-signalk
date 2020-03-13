/* tslint:disable */
/* eslint-disable */

export type ValueTypes = {
    /** Represents a Pokémon's attack types */
["Attack"]: AliasType<{
	/** The name of this Pokémon attack */
	name?:true,
	/** The type of this Pokémon attack */
	type?:true,
	/** The damage of this Pokémon attack */
	damage?:true
		__typename?: true
}>;
	/** Represents a Pokémon */
["Pokemon"]: AliasType<{
	/** The ID of an object */
	id?:true,
	/** The identifier of this Pokémon */
	number?:true,
	/** The name of this Pokémon */
	name?:true,
	/** The minimum and maximum weight of this Pokémon */
	weight?:ValueTypes["PokemonDimension"],
	/** The minimum and maximum weight of this Pokémon */
	height?:ValueTypes["PokemonDimension"],
	/** The classification of this Pokémon */
	classification?:true,
	/** The type(s) of this Pokémon */
	types?:true,
	/** The type(s) of Pokémons that this Pokémon is resistant to */
	resistant?:true,
	/** The attacks of this Pokémon */
	attacks?:ValueTypes["PokemonAttack"],
	/** The type(s) of Pokémons that this Pokémon weak to */
	weaknesses?:true,
	fleeRate?:true,
	/** The maximum CP of this Pokémon */
	maxCP?:true,
	/** The evolutions of this Pokémon */
	evolutions?:ValueTypes["Pokemon"],
	/** The evolution requirements of this Pokémon */
	evolutionRequirements?:ValueTypes["PokemonEvolutionRequirement"],
	/** The maximum HP of this Pokémon */
	maxHP?:true,
	image?:true
		__typename?: true
}>;
	/** Represents a Pokémon's attack types */
["PokemonAttack"]: AliasType<{
	/** The fast attacks of this Pokémon */
	fast?:ValueTypes["Attack"],
	/** The special attacks of this Pokémon */
	special?:ValueTypes["Attack"]
		__typename?: true
}>;
	/** Represents a Pokémon's dimensions */
["PokemonDimension"]: AliasType<{
	/** The minimum value of this dimension */
	minimum?:true,
	/** The maximum value of this dimension */
	maximum?:true
		__typename?: true
}>;
	/** Represents a Pokémon's requirement to evolve */
["PokemonEvolutionRequirement"]: AliasType<{
	/** The amount of candy to evolve */
	amount?:true,
	/** The name of the candy to evolve */
	name?:true
		__typename?: true
}>;
	/** Query any Pokémon by number or name */
["Query"]: AliasType<{
	query?:ValueTypes["Query"],
pokemons?: [{	first:number},ValueTypes["Pokemon"]],
pokemon?: [{	id?:string,	name?:string},ValueTypes["Pokemon"]]
		__typename?: true
}>
  }

export type PartialObjects = {
    /** Represents a Pokémon's attack types */
["Attack"]: {
		__typename?: "Attack";
			/** The name of this Pokémon attack */
	name?:string,
			/** The type of this Pokémon attack */
	type?:string,
			/** The damage of this Pokémon attack */
	damage?:number
	},
	/** Represents a Pokémon */
["Pokemon"]: {
		__typename?: "Pokemon";
			/** The ID of an object */
	id?:string,
			/** The identifier of this Pokémon */
	number?:string,
			/** The name of this Pokémon */
	name?:string,
			/** The minimum and maximum weight of this Pokémon */
	weight?:PartialObjects["PokemonDimension"],
			/** The minimum and maximum weight of this Pokémon */
	height?:PartialObjects["PokemonDimension"],
			/** The classification of this Pokémon */
	classification?:string,
			/** The type(s) of this Pokémon */
	types?:(string | undefined)[],
			/** The type(s) of Pokémons that this Pokémon is resistant to */
	resistant?:(string | undefined)[],
			/** The attacks of this Pokémon */
	attacks?:PartialObjects["PokemonAttack"],
			/** The type(s) of Pokémons that this Pokémon weak to */
	weaknesses?:(string | undefined)[],
			fleeRate?:number,
			/** The maximum CP of this Pokémon */
	maxCP?:number,
			/** The evolutions of this Pokémon */
	evolutions?:(PartialObjects["Pokemon"] | undefined)[],
			/** The evolution requirements of this Pokémon */
	evolutionRequirements?:PartialObjects["PokemonEvolutionRequirement"],
			/** The maximum HP of this Pokémon */
	maxHP?:number,
			image?:string
	},
	/** Represents a Pokémon's attack types */
["PokemonAttack"]: {
		__typename?: "PokemonAttack";
			/** The fast attacks of this Pokémon */
	fast?:(PartialObjects["Attack"] | undefined)[],
			/** The special attacks of this Pokémon */
	special?:(PartialObjects["Attack"] | undefined)[]
	},
	/** Represents a Pokémon's dimensions */
["PokemonDimension"]: {
		__typename?: "PokemonDimension";
			/** The minimum value of this dimension */
	minimum?:string,
			/** The maximum value of this dimension */
	maximum?:string
	},
	/** Represents a Pokémon's requirement to evolve */
["PokemonEvolutionRequirement"]: {
		__typename?: "PokemonEvolutionRequirement";
			/** The amount of candy to evolve */
	amount?:number,
			/** The name of the candy to evolve */
	name?:string
	},
	/** Query any Pokémon by number or name */
["Query"]: {
		__typename?: "Query";
			query?:PartialObjects["Query"],
			pokemons?:(PartialObjects["Pokemon"] | undefined)[],
			pokemon?:PartialObjects["Pokemon"]
	}
  }

/** Represents a Pokémon's attack types */
export type Attack = {
	__typename?: "Attack",
	/** The name of this Pokémon attack */
	name?:string,
	/** The type of this Pokémon attack */
	type?:string,
	/** The damage of this Pokémon attack */
	damage?:number
}

/** Represents a Pokémon */
export type Pokemon = {
	__typename?: "Pokemon",
	/** The ID of an object */
	id:string,
	/** The identifier of this Pokémon */
	number?:string,
	/** The name of this Pokémon */
	name?:string,
	/** The minimum and maximum weight of this Pokémon */
	weight?:PokemonDimension,
	/** The minimum and maximum weight of this Pokémon */
	height?:PokemonDimension,
	/** The classification of this Pokémon */
	classification?:string,
	/** The type(s) of this Pokémon */
	types?:(string | undefined)[],
	/** The type(s) of Pokémons that this Pokémon is resistant to */
	resistant?:(string | undefined)[],
	/** The attacks of this Pokémon */
	attacks?:PokemonAttack,
	/** The type(s) of Pokémons that this Pokémon weak to */
	weaknesses?:(string | undefined)[],
	fleeRate?:number,
	/** The maximum CP of this Pokémon */
	maxCP?:number,
	/** The evolutions of this Pokémon */
	evolutions?:(Pokemon | undefined)[],
	/** The evolution requirements of this Pokémon */
	evolutionRequirements?:PokemonEvolutionRequirement,
	/** The maximum HP of this Pokémon */
	maxHP?:number,
	image?:string
}

/** Represents a Pokémon's attack types */
export type PokemonAttack = {
	__typename?: "PokemonAttack",
	/** The fast attacks of this Pokémon */
	fast?:(Attack | undefined)[],
	/** The special attacks of this Pokémon */
	special?:(Attack | undefined)[]
}

/** Represents a Pokémon's dimensions */
export type PokemonDimension = {
	__typename?: "PokemonDimension",
	/** The minimum value of this dimension */
	minimum?:string,
	/** The maximum value of this dimension */
	maximum?:string
}

/** Represents a Pokémon's requirement to evolve */
export type PokemonEvolutionRequirement = {
	__typename?: "PokemonEvolutionRequirement",
	/** The amount of candy to evolve */
	amount?:number,
	/** The name of the candy to evolve */
	name?:string
}

/** Query any Pokémon by number or name */
export type Query = {
	__typename?: "Query",
	query?:Query,
	pokemons?:(Pokemon | undefined)[],
	pokemon?:Pokemon
}


type Func<P extends any[], R> = (...args: P) => R;
type AnyFunc = Func<any, any>;

type WithTypeNameValue<T> = T & {
  __typename?: true;
};

type AliasType<T> = WithTypeNameValue<T> & {
  __alias?: Record<string, WithTypeNameValue<T>>;
};

type NotUndefined<T> = T extends undefined ? never : T;

export type ResolverType<F> = NotUndefined<F extends [infer ARGS, any] ? ARGS : undefined>;

export type ArgsType<F extends AnyFunc> = F extends Func<infer P, any> ? P : never;

interface GraphQLResponse {
  data?: Record<string, any>;
  errors?: Array<{
    message: string;
  }>;
}
export type MapInterface<SRC, DST> = SRC extends {
  __interface: infer INTERFACE;
  __resolve: infer IMPLEMENTORS;
}
  ? ObjectToUnion<
      Omit<
        {
          [Key in keyof Omit<DST, keyof INTERFACE | '__typename'>]: Key extends keyof IMPLEMENTORS
            ? MapType<IMPLEMENTORS[Key], DST[Key]> &
                Omit<
                  {
                    [Key in keyof Omit<
                      DST,
                      keyof IMPLEMENTORS | '__typename'
                    >]: Key extends keyof INTERFACE
                      ? LastMapTypeSRCResolver<INTERFACE[Key], DST[Key]>
                      : never;
                  },
                  keyof IMPLEMENTORS
                > &
                (DST extends { __typename: any }
                  ? MapType<IMPLEMENTORS[Key], { __typename: true }>
                  : {})
            : never;
        },
        keyof INTERFACE | '__typename'
      >
    >
  : never;

export type ValueToUnion<T> = T extends {
  __typename: infer R;
}
  ? {
      [P in keyof Omit<T, '__typename'>]: T[P] & {
        __typename: R;
      };
    }
  : T;

export type ObjectToUnion<T> = {
  [P in keyof T]: T[P];
}[keyof T];

type Anify<T> = { [P in keyof T]?: any };


type LastMapTypeSRCResolver<SRC, DST> = SRC extends undefined
  ? undefined
  : SRC extends Array<infer AR>
  ? LastMapTypeSRCResolver<AR, DST>[]
  : SRC extends { __interface: any; __resolve: any }
  ? MapInterface<SRC, DST>
  : SRC extends { __union: any; __resolve: infer RESOLVE }
  ? ObjectToUnion<MapType<RESOLVE, ValueToUnion<DST>>>
  : DST extends boolean
  ? SRC
  : MapType<SRC, DST>;

type MapType<SRC extends Anify<DST>, DST> = DST extends boolean
  ? SRC
  : DST extends {
      __alias: any;
    }
  ? {
      [A in keyof DST["__alias"]]: Required<SRC> extends Anify<
        DST["__alias"][A]
      >
        ? MapType<Required<SRC>, DST["__alias"][A]>
        : never;
    } &
      {
        [Key in keyof Omit<DST, "__alias">]: DST[Key] extends [
          any,
          infer PAYLOAD
        ]
          ? LastMapTypeSRCResolver<SRC[Key], PAYLOAD>
          : LastMapTypeSRCResolver<SRC[Key], DST[Key]>;
      }
  : {
      [Key in keyof DST]: DST[Key] extends [any, infer PAYLOAD]
        ? LastMapTypeSRCResolver<SRC[Key], PAYLOAD>
        : LastMapTypeSRCResolver<SRC[Key], DST[Key]>;
    };

type OperationToGraphQL<V, T> = <Z>(o: Z | V) => Promise<MapType<T, Z>>;

type CastToGraphQL<V, T> = (
  resultOfYourQuery: any
) => <Z>(o: Z | V) => MapType<T, Z>;

type fetchOptions = ArgsType<typeof fetch>;

export type SelectionFunction<V> = <T>(t: T | V) => T;


export declare function Chain(
  ...options: fetchOptions
):{
  query: OperationToGraphQL<ValueTypes["Query"],Query>
}

export declare const Zeus: {
  query: (o: ValueTypes["Query"]) => string
}

export declare const Cast: {
  query: CastToGraphQL<
  ValueTypes["Query"],
  Query
>
}

export declare const Gql: ReturnType<typeof Chain>
