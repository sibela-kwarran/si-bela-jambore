import supabase from "../lib/supabase";


// ambil kapling berdasarkan gudep
export async function getKaplingByGudep(gudep_id){

const {data,error}=await supabase
.from("penempatan_blok")
.select(`
 *,
 profil_gudep(
   nama_pangkalan
 )
`)
.eq("gudep_id",gudep_id)
.single();


if(error){

console.error(
"GET KAPLING ERROR:",
error
);

throw error;

}


return data;

}
export async function getBlok(){

const {data,error}=await supabase
.from("penempatan_blok")
.select(`
 *,
 profil_gudep(
   nama_pangkalan
 )
`)
.order("id");


if(error){

console.error(
"GET BLOK ERROR:",
error
);

throw error;

}


return data || [];

}
export async function savePenempatanBlok(data){

const {data:hasil,error}=await supabase
.from("penempatan_blok")
.insert([data])
.select()
.single();


if(error){

console.error(
"SAVE BLOK ERROR:",
error
);

throw error;

}


return hasil;

}
export async function savePeta(data){

  const { data:hasil, error } = await supabase
    .from("penempatan_blok")
    .insert(data)
    .select()
    .single();


  if(error){

    console.error(
      "SAVE PETA ERROR:",
      error
    );

    throw error;

  }


  return hasil;

}
// ======================================
// CEK APAKAH GUDEP SUDAH PUNYA KAPLING
// ======================================
export async function cekKaplingGudep(gudepId) {

  const { data, error } = await supabase
    .from("penempatan_blok")
    .select("id")
    .eq("gudep_id", gudepId)
    .maybeSingle();

  if (error) throw error;

  return data;
}


// ======================================
// NOMOR KAPLING PUTRA TERAKHIR
// ======================================
export async function getNomorPutraTerakhir() {

  const { data, error } = await supabase
    .from("penempatan_blok")
    .select("kapling_putra")
    .not("kapling_putra", "is", null);

  if (error) throw error;

  if (!data || data.length === 0) return 0;

  return Math.max(
    ...data.map(x => Number(x.kapling_putra))
  );

}


// ======================================
// NOMOR KAPLING PUTRI TERAKHIR
// ======================================
export async function getNomorPutriTerakhir() {

  const { data, error } = await supabase
    .from("penempatan_blok")
    .select("kapling_putri")
    .not("kapling_putri", "is", null);

  if (error) throw error;

  if (!data || data.length === 0) return 0;

  return Math.max(
    ...data.map(x => Number(x.kapling_putri))
  );

}
// =====================================
// CARI NOMOR KAPLING BERIKUTNYA
// LANGSUNG DARI SUPABASE
// =====================================

export async function getNomorKaplingBerikutnya(jenis) {

  const kolom =
    jenis === "putra"
      ? "kapling_putra"
      : "kapling_putri";

  const { data, error } = await supabase
    .from("kapling")
    .select(kolom)
    .not(kolom, "is", null);

  if (error) {

    console.error(
      "GAGAL CEK NOMOR KAPLING:",
      error
    );

    throw error;
  }

  const nomorTerpakai = (data || [])
    .map(item => Number(item[kolom]))
    .filter(nomor => !isNaN(nomor));


  let nomor = 1;

  while (
    nomorTerpakai.includes(nomor)
  ) {
    nomor++;
  }

  return nomor;
}