// app/components/LogoScroller.tsx
"use client";

import Image from "next/image";

const logos = [
  "afore1_logo_80x40.png",
  "allea_logo_80x40.png",
  "bdb_logo_80x40.png",
  "bde_logo_80x40.png",
  "beghoffoundation_logo_80x40.png",
  "beuc1_logo_80x40.png",
  "carbonmarketwatch_logo_80x40.png",
  "care_logo_80x40.png",
  "catf1_logo_80x40.png",
  "clientearth_logo_80x40.png",
  "eb_star_logo_80x40.png",
  "ecmwf1_logo_80x40.png",
  "edqm_logo_80x40.png",
  "efbs2_logo_80x40_2013.png",
  "efic_pain_logo_80x40.png",
  "eftasurveil_logo_2_80x40.png",
  "eitfood_logo_80x40.png",
  "ekd_logo_80x40_.png",
  "energycommunity_logo_80x40.png",
  "esm_logo_80x40.png",
  "esmo_logo_80x40.png",
  "esrf_logo_80x40.png",
  "eurelectric_logo_80x40.png",
  "euspa_logo_80x40.png",
  "euturbines1_logo_80x40.png",
  "fcdo_logo_80x40.png",
  "fediaf_eu_pet_food_logo_80x40.png",
  "gdv_logo_80x40.png",
  "iep_europolitik_logo_80x40.png",
  "ihi_logo_80x40.png",
  "less_logo_80x40.png",
  "mileu_logo_80x40.png",
  "mpa_emea_logo_80x40.png",
  "nef_logo_80x40.png",
  "openway_logo_80x40.png",
  "sd_logo_80x40.png",
  "the_left_eu_parliament_80x40.png",
  "unhcr_paris_logo_80x40.png",
  "wind_europe_logo_80x40.png",
  "wmu_logo2_80x40.png",
];

export default function LogoScroller() {
  return (
    <div className="hidden sm:block overflow-hidden py-1 bg-white border-t">
      <div className="whitespace-nowrap animate-scroll flex gap-8 px-0 py-0 items-center">
        {[...logos, ...logos].map((logo, i) => (
            <Image
              key={i}
              src={`/logos/${logo}`}
              alt={`Logo ${i}`}
              width={100}
              height={40}
              className="object-contain inline-block flex-shrink-0"
            />
          ))}
        {/* Repeat for seamless scroll */}
        {logos.map((logo, i) => (
          <Image
            key={`repeat-${i}`}
            src={`/logos/${logo}`}
            alt={`Company logo repeat ${i + 1}`}
            width={100}
            height={40}
            className="object-contain inline-block"
          />
        ))}
      </div>
    </div>
  );
}
