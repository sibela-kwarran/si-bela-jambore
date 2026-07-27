import supabase from "../lib/supabase";

const TABLE = "profil_gudep";
function getOperatorLogin() {
  const operator = JSON.parse(localStorage.getItem("operatorLogin"));

  if (!operator) {
    throw new Error("Operator belum login.");
  }

  return operator;
}

// Ambil semua profil
export async function getProfilGudep() {

  const operator = getOperatorLogin();

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("operator_id", operator.id)
    .maybeSingle();


  if(error) throw error;


  if(data){

    localStorage.setItem(
      "operatorLogin",
      JSON.stringify({
        ...operator,
        gudep_id:data.id
      })
    );

  }


  return data;
}





// Simpan profil baru
export async function saveProfilGudep(form) {


  const operator = getOperatorLogin();


  console.log(
    "OPERATOR AKTIF:",
    operator
  );


  const dataBaru = {

    operator_id: operator.id,

    nama_pangkalan: form.pangkalan,

    gudep_putra: form.gudepPutra,

    gudep_putri: form.gudepPutri,

    kwarran: form.kwarran,

    kwarcab: form.kwarcab,

    kabupaten: form.kabupaten,

    provinsi: form.provinsi,

    alamat: form.alamat,

    email: form.email,

    nama_mabigus: form.namaMabigus,

    hp_mabigus: form.hpMabigus,

  };


  console.log(
    "DATA PROFIL DIKIRIM:",
    dataBaru
  );

  // Cek apakah user sudah punya profil
  const { data: profilLama, error: cekError } = await supabase
    .from(TABLE)
    .select("id")
    .eq("operator_id", operator.id)
    .maybeSingle();

  console.log(
 "CEK PROFIL LAMA:",
 profilLama
);

  // Jika sudah ada → update
  if (profilLama) {
    const { data, error } = await supabase
      .from(TABLE)
      .update(dataBaru)
      .eq("id", profilLama.id)
      .select()
      .single();

    // update gudep_id ke operator
await supabase
.from("operator_gudep")
.update({
  gudep_id: data.id
})
.eq(
  "id",
  operator.id
);
}
  // Jika belum ada → insert
  const { data, error } = await supabase
    .from(TABLE)
    .insert(dataBaru)
    .select()
    .single();


console.log(
  "HASIL INSERT PROFIL:",
  data
);


console.log(
  "ERROR INSERT PROFIL:",
  error
);


if (error) throw error;
}



// Update profil

export async function updateProfilGudep(id,form){


const dataUpdate={

nama_pangkalan: form.pangkalan,

gudep_putra: form.gudepPutra,

gudep_putri: form.gudepPutri,

kwarran: form.kwarran,

kwarcab: form.kwarcab,

kabupaten: form.kabupaten,

provinsi: form.provinsi,

alamat: form.alamat,

email: form.email,

nama_mabigus: form.namaMabigus,

hp_mabigus: form.hpMabigus,

};



const {error}=await supabase

.from(TABLE)

.update(dataUpdate)

.eq("id",id);



if(error) throw error;


}
// Ambil profil gudep berdasarkan id untuk admin

export async function getProfilGudepById(id){

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();


  if(error){

    console.error(
      "ERROR GET PROFIL GUDEP BY ID:",
      error
    );

    throw error;

  }


  return data;

}