export interface Contract {
  name: string;                        // ex: "toulouse" (identifiant API)
  commercial_name: string | null;      // ex: "Vélo'V" — peut être null
  cities: string[] | null;             // ex: ["Lyon"] — peut être null
  country_code: string | null;         // ex: "FR"
}
